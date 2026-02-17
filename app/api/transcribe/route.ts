import { NextResponse } from 'next/server'
import { processTranscription } from '@/utils/transcription'

// This route can be called by the client (after upload) OR by other server processes
export async function POST(request: Request) {
    try {
        const { fileId } = await request.json()

        if (!fileId) {
            return NextResponse.json({ error: 'File ID is required' }, { status: 400 })
        }

        // Trigger the shared transcription logic
        // Verify if we want to await it or background it. 
        // For Vercel, usually better to await or use Inngest/background jobs.
        // We will await it to catch errors immediately for the user feedback in this MVP.
        await processTranscription(fileId)

        // Trigger Analysis (fire and forget)
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        fetch(`${appUrl}/api/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileId }),
        }).catch(console.error)

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Transcription API failed:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
