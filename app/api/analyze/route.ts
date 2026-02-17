import { NextResponse } from 'next/server'
import { processAnalysis } from '@/utils/analysis'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
    try {
        const { fileId } = await request.json()
        const authHeader = request.headers.get('x-internal-secret')
        const isInternal = authHeader === process.env.INTERNAL_API_SECRET

        if (!fileId) {
            return NextResponse.json({ error: 'File ID is required' }, { status: 400 })
        }

        // Auth Check
        if (!isInternal) {
            const supabase = await createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
        } else {
            console.log("Analyzing via Internal Secret Trigger")
        }

        // Trigger Analysis
        await processAnalysis(fileId)

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Analysis API failed:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
