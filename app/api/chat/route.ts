import { createClient } from '@/utils/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: Request) {
    try {
        const { messages, fileId } = await request.json()

        if (!messages || !fileId) {
            return new Response('Missing messages or fileId', { status: 400 })
        }

        const supabase = await createClient()

        // 1. Fetch transcript/analysis context
        const { data: file } = await supabase
            .from('files')
            .select('*, transcriptions(*), analyses(*)')
            .eq('id', fileId)
            .single()

        if (!file || !file.transcriptions?.[0]) {
            return new Response('Context not found', { status: 404 })
        }

        const transcript = file.transcriptions[0].transcript_text
        const summary = file.analyses?.[0]?.summary || ''

        // 2. Fetch Chat History
        const { data: history } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('file_id', fileId)
            .order('created_at', { ascending: true })

        // 3. Prepare Messages for Claude
        // Convert history to Anthropic format
        const historyMessages = (history || []).map((msg: any) => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
        }))

        // Current user message is already in 'messages' array from request if we blindly forwarded it?
        // Actually, the request usually sends the FULL conversation from the client if it's a standard useChat hook.
        // BUT we want to persist it.
        // If the client sends the full array, we only need to store the *newest* user message.
        // However, standard Vercel AI SDK useChat sends the whole history.
        // We should rely on our DB history for context, and only use the LAST message from the request as the new input.
        // OR, the client handles the display state, and we just sync.

        // Let's assume the client sends the full conversation array [m1, m2, m3].
        // The last message is the new User message.
        const lastMessage = messages[messages.length - 1]
        if (lastMessage.role !== 'user') {
            // Should not happen if client is standard
        }

        // Store the new User message
        await supabase.from('chat_messages').insert({
            file_id: fileId,
            role: 'user',
            content: lastMessage.content
        })

        // Construct full context for AI
        const systemPrompt = `
    You are an AI assistant analyzing a transcript.
    Use the following context to answer the user's question.
    
    Context:
    Summary: ${summary}
    
    Full Transcript:
    ${transcript ? transcript.substring(0, 50000) : ''} 
    
    Answer concisely and accurately based ONLY on the context provided.
    `
        // Combine DB history + New Message for the prompt
        // (Actually, 'historyMessages' includes old messages. 'lastMessage' is the new one.)
        const payloadMessages = [
            ...historyMessages,
            { role: 'user', content: lastMessage.content }
        ]

        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY!,
        })

        const stream = await anthropic.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            system: systemPrompt,
            messages: payloadMessages.map((m: { role: string, content: string }) => ({
                role: m.role as 'user' | 'assistant',
                content: m.content
            })),
            stream: true,
        })

        // Create a ReadableStream and intercept to store the AI response
        const readableStream = new ReadableStream({
            async start(controller) {
                let fullAiResponse = ''
                const encoder = new TextEncoder()

                for await (const chunk of stream) {
                    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                        const text = chunk.delta.text
                        fullAiResponse += text
                        controller.enqueue(encoder.encode(text))
                    }
                }
                controller.close()

                // Store AI response in DB after streaming is done
                await supabase.from('chat_messages').insert({
                    file_id: fileId,
                    role: 'assistant',
                    content: fullAiResponse
                })
            },
        })

        return new Response(readableStream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        })

    } catch (error: any) {
        console.error('Chat API Error:', error)
        return new Response(error.message, { status: 500 })
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')

    if (!fileId) {
        return new Response('Missing fileId', { status: 400 })
    }

    try {
        const supabase = await createClient()

        const { data: messages, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('file_id', fileId)
            .order('created_at', { ascending: true })

        if (error) throw error

        return Response.json({ messages })
    } catch (error: any) {
        console.error('Chat History Error:', error)
        return new Response(error.message, { status: 500 })
    }
}
