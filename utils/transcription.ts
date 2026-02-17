import { createClient } from '@supabase/supabase-js'
import { AssemblyAI } from 'assemblyai'

// Service Role Client for backend processing (bypasses RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function processTranscription(fileId: string) {
    console.log(`Starting transcription for file: ${fileId}`)

    // 1. Get file record using Admin Client (bypasses RLS if needed, though reading might be fine)
    const { data: file, error: fileError } = await supabaseAdmin
        .from('files')
        .select('*')
        .eq('id', fileId)
        .single()

    if (fileError || !file) {
        throw new Error(`File not found: ${fileError?.message}`)
    }

    // 2. Update status to 'transcribing'
    await supabaseAdmin
        .from('files')
        .update({ status: 'transcribing' })
        .eq('id', fileId)

    try {
        // 3. Get signed URL
        const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin
            .storage
            .from('media-files')
            .createSignedUrl(file.storage_path, 3600)

        if (signedUrlError || !signedUrlData) {
            throw new Error(`Failed to get signed URL: ${signedUrlError?.message}`)
        }

        const signedUrl = signedUrlData.signedUrl

        // 4. Start Transcription
        const client = new AssemblyAI({
            apiKey: process.env.ASSEMBLYAI_API_KEY!,
        })

        const transcript = await client.transcripts.transcribe({
            audio: signedUrl,
            speaker_labels: true,
            speech_models: ['universal-2']
        } as any)

        if (transcript.status === 'error') {
            throw new Error(transcript.error)
        }

        // 5. Save Transcript to DB (using Admin Client to bypass RLS)
        const { error: insertError } = await supabaseAdmin.from('transcriptions').insert({
            file_id: fileId,
            transcript_text: transcript.text,
            transcription_service: 'assemblyai',
            confidence_score: transcript.confidence,
            language: transcript.language_code,
            duration_seconds: transcript.audio_duration,
            word_count: transcript.words?.length || 0
        })

        if (insertError) throw insertError

        // 6. Update file status
        await supabaseAdmin
            .from('files')
            .update({ status: 'transcribed' })
            .eq('id', fileId)

        // 7. Trigger Analysis (fire and forget using internal secret)
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        fetch(`${appUrl}/api/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-internal-secret': process.env.INTERNAL_API_SECRET || 'super_secret_internal_key_123'
            },
            body: JSON.stringify({ fileId }),
        }).catch(err => console.error('Failed to trigger analysis:', err))

        return { success: true }

    } catch (error: any) {
        console.error('Transcription process failed:', error)

        await supabaseAdmin
            .from('files')
            .update({ status: 'failed' })
            .eq('id', fileId)

        throw error
    }
}
