import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

// Increase max duration for Vercel serverless functions
export const maxDuration = 60;

// Helper to extract video ID from YouTube URL
function extractVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        /youtube\.com\/embed\/([^&\n?#]+)/,
        /youtube\.com\/v\/([^&\n?#]+)/
    ]

    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match && match[1]) {
            return match[1]
        }
    }
    return null
}

export async function POST(request: Request) {
    try {
        const { url } = await request.json()

        if (!url) {
            return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 })
        }

        // Extract video ID
        const videoId = extractVideoId(url)
        if (!videoId) {
            return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })
        }

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Create admin client for RLS bypass
        const supabaseAdmin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Check for API token
        const apiToken = process.env.YOUTUBE_TRANSCRIPT_API_TOKEN
        if (!apiToken) {
            return NextResponse.json({
                error: 'YouTube Transcript API token not configured. Please add YOUTUBE_TRANSCRIPT_API_TOKEN to your environment variables.'
            }, { status: 500 })
        }

        console.log(`Fetching transcript for video: ${videoId}`)

        // Call YouTube Transcript API
        const transcriptResponse = await fetch('https://www.youtube-transcript.io/api/transcripts', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${apiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ids: [videoId] })
        })

        if (!transcriptResponse.ok) {
            const errorText = await transcriptResponse.text()
            console.error('YouTube Transcript API error:', errorText)
            return NextResponse.json({
                error: `Failed to fetch transcript: ${transcriptResponse.status} ${transcriptResponse.statusText}`
            }, { status: 500 })
        }

        const transcriptData = await transcriptResponse.json()

        // Debug: Log the full response to understand structure
        console.log('YouTube Transcript API Response:', JSON.stringify(transcriptData, null, 2))

        // The API returns an array, not an object keyed by video ID
        if (!transcriptData || !Array.isArray(transcriptData) || transcriptData.length === 0) {
            return NextResponse.json({
                error: 'No transcript data received from API'
            }, { status: 404 })
        }

        // Get the first (and usually only) video data
        const videoData = transcriptData[0]

        if (!videoData) {
            return NextResponse.json({
                error: 'Video data not found in API response'
            }, { status: 404 })
        }

        // The transcript is provided as a full 'text' field
        const fullText = videoData.text

        if (!fullText || typeof fullText !== 'string' || fullText.length === 0) {
            console.error('No transcript text found. Video data keys:', Object.keys(videoData))
            return NextResponse.json({
                error: 'No transcript text available for this video'
            }, { status: 404 })
        }

        const videoTitle = videoData.title || videoData.microformat?.playerMicroformatRenderer?.title?.simpleText || `YouTube Video ${videoId}`
        const duration = parseInt(videoData.microformat?.playerMicroformatRenderer?.lengthSeconds || '0')

        console.log(`Transcript fetched: ${fullText.length} characters, title: ${videoTitle}`)

        // Upload transcript as text file to storage
        const safeTitle = videoTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()
        const safeFilename = `${safeTitle}.txt`
        const filePath = `${user.id}/${Date.now()}-${safeFilename}`

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('media-files')
            .upload(filePath, fullText, {
                contentType: 'text/plain',
                upsert: false
            })

        if (uploadError) {
            throw new Error(`Storage upload failed: ${uploadError.message}`)
        }

        // Create file record
        const { data: fileData, error: dbError } = await supabase.from('files').insert({
            user_id: user.id,
            filename: videoTitle,
            original_filename: url,
            file_type: 'text/plain',
            file_size: Buffer.byteLength(fullText),
            storage_path: uploadData.path,
            source_type: 'youtube',
            status: 'transcribed'
        }).select().single()

        if (dbError) throw dbError

        // Save transcription - MUST complete before triggering analysis
        // Use admin client to bypass RLS policy
        const { error: transcriptionError } = await supabaseAdmin.from('transcriptions').insert({
            file_id: fileData.id,
            transcript_text: fullText,
            language: 'en',
            transcription_service: 'youtube-transcript-api'
        })

        if (transcriptionError) {
            console.error('Failed to save transcription:', transcriptionError)
            throw new Error(`Transcription save failed: ${transcriptionError.message}`)
        }

        console.log('Transcription saved successfully for file:', fileData.id)

        // Trigger analysis - now that transcription is definitely saved
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        console.log('Triggering analysis for file:', fileData.id)
        try {
            const analysisResponse = await fetch(`${appUrl}/api/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-internal-secret': process.env.INTERNAL_API_SECRET || ''
                },
                body: JSON.stringify({ fileId: fileData.id }),
            })
            const analysisResult = await analysisResponse.json()
            console.log('Analysis trigger response:', analysisResponse.status, analysisResult)
        } catch (analysisError) {
            console.error('Failed to trigger analysis:', analysisError)
        }

        return NextResponse.json({ success: true, fileId: fileData.id })

    } catch (error: any) {
        console.error('YouTube processing failed:', error)
        return NextResponse.json({
            error: error.message || 'Internal Server Error'
        }, { status: 500 })
    }
}
