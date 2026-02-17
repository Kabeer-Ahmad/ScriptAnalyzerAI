import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

// Service Role Client (bypasses RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function processAnalysis(fileId: string) {
    console.log(`Starting analysis for file: ${fileId}`)

    // 1. Get file and transcript
    const { data: file, error: fileError } = await supabaseAdmin
        .from('files')
        .select('*')
        .eq('id', fileId)
        .limit(1)
        .maybeSingle()

    if (fileError || !file) {
        throw new Error(`File not found: ${fileError?.message}`)
    }

    // Fetch transcription separately to avoid relationship issues
    const { data: transcriptions, error: transcriptError } = await supabaseAdmin
        .from('transcriptions')
        .select('transcript_text')
        .eq('file_id', fileId)
        .limit(1)

    if (transcriptError || !transcriptions || transcriptions.length === 0) {
        throw new Error('Transcript not found for this file')
    }

    const transcriptText = transcriptions[0].transcript_text

    if (!transcriptText) {
        throw new Error('Transcript is empty')
    }

    try {
        // 2. Analyze with Claude
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY!,
        })

        const systemPrompt = `You are an expert content analyst. Your goal is to analyze the provided transcript and extract high-value insights, summaries, and structured data.
        
        IMPORTANT: Output valid JSON only. Do not include any conversational text, markdown formatting (like \`\`\`json), or preamble. Start your response with "{".

        JSON Schema:
        {
            "summary": "3-5 paragraph executive summary",
            "key_points": ["point 1", "point 2", ...], 
            "insights": "Main takeaways, patterns, or surprising details",
            "time_assessment": "Estimated read time and value proposition (e.g. 'High value for developers')",
            "target_audience": "Who is this content for? (e.g. 'Beginners', 'Industry Experts')",
            "rewrite_suggestions": ["Specific advice on how to improve or rewrite this script/content", "suggestion 2"],
            "topics": ["topic1", "topic2"],
            "sentiment": "positive|neutral|negative",
            "action_items": ["action 1", "action 2"]
        }`

        const userPrompt = `Analyze the following transcript:\n\n${transcriptText.substring(0, 150000)}`

        const completion = await anthropic.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 4000,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }],
            temperature: 0.1,
        })

        const responseContent = completion.content[0].type === 'text' ? completion.content[0].text : ''

        // Parse JSON with robust extraction
        let jsonString = responseContent.trim()

        // Extract JSON object if mixed with text
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            jsonString = jsonMatch[0]
        }

        let analysisResult

        try {
            analysisResult = JSON.parse(jsonString)
        } catch (e) {
            console.error("Failed to parse Analysis JSON", responseContent)
            // Attempt to rescue or fallback
            analysisResult = {
                summary: "Analysis failed to parse correctly. Raw output below.\n\n" + responseContent,
                key_points: ["Could not parse structured analysis"],
                insights: "Raw output: " + responseContent.substring(0, 500),
                time_assessment: "N/A",
                target_audience: "N/A",
                rewrite_suggestions: []
            }
        }

        // 3. Save Analysis to DB
        // Check if analysis already exists? simpler to just insert or upsert? 
        // Insert works if 1:1, but 'analyses' table likely links to file_id.
        // Let's delete old one if exists to be safe (re-analysis)
        await supabaseAdmin.from('analyses').delete().eq('file_id', fileId)

        const { error: insertError } = await supabaseAdmin.from('analyses').insert({
            file_id: fileId,
            summary: analysisResult.summary,
            key_points: analysisResult.key_points,
            insights: analysisResult.insights,
            time_assessment: analysisResult.time_assessment,
            target_audience: analysisResult.target_audience,
            rewrite_suggestions: analysisResult.rewrite_suggestions,
            analysis_service: 'claude',
        })

        if (insertError) throw insertError

        // 4. Update file status
        await supabaseAdmin
            .from('files')
            .update({ status: 'completed' })
            .eq('id', fileId)

        return { success: true }

    } catch (error: any) {
        console.error('Analysis process failed:', error)
        await supabaseAdmin
            .from('files')
            .update({ status: 'transcribed' }) // Revert to transcribed if analysis fails
            .eq('id', fileId)
        throw error
    }
}
