'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, User, Bot, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

interface ChatInterfaceProps {
    fileId: string
}

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
}

export function ChatInterface({ fileId }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Fetch initial messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/chat?fileId=${fileId}`)
                if (res.ok) {
                    const data = await res.json()
                    // Map DB messages to UI format
                    const formatted: Message[] = data.messages.map((m: any) => ({
                        id: m.id,
                        role: m.role,
                        content: m.content
                    }))
                    setMessages(formatted)
                }
            } catch (error) {
                console.error('Failed to load chat history', error)
            }
        }
        fetchMessages()
    }, [fileId])

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isLoading])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileId,
                    messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
                })
            })

            if (!response.ok) throw new Error('Failed to send message')
            if (!response.body) throw new Error('No response body')

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let botMessageContent = ''

            // Add initial empty bot message
            const botMessageId = (Date.now() + 1).toString()
            setMessages(prev => [...prev, {
                id: botMessageId,
                role: 'assistant',
                content: ''
            }])

            setIsLoading(false) // Start showing streaming immediately

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value, { stream: true })
                botMessageContent += chunk

                setMessages(prev => prev.map(msg =>
                    msg.id === botMessageId
                        ? { ...msg, content: botMessageContent }
                        : msg
                ))
            }

        } catch (error) {
            console.error(error)
            setIsLoading(false)
            // Remove user message if failed or show error
        }
    }

    return (
        <div className="flex flex-col h-full mx-auto w-full">
            <ScrollArea className="flex-1 h-0 pr-4">
                <div className="space-y-6 px-4 pb-4">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                            <div className="p-4 rounded-full bg-primary/10">
                                <Bot className="h-8 w-8 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg">Chat with your Transcript</h3>
                                <p className="text-muted-foreground text-sm max-w-sm">
                                    Ask specific questions, request summaries, or explore insights from your file.
                                </p>
                            </div>
                        </div>
                    )}

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                }`}
                        >
                            {message.role === 'assistant' && (
                                <Avatar className="h-8 w-8 mt-1 border">
                                    <AvatarImage src="/bot-avatar.png" />
                                    <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                                </Avatar>
                            )}

                            <div
                                className={`rounded-xl p-4 text-sm max-w-[85%] md:max-w-[75%] shadow-sm ${message.role === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-br-none'
                                    : 'bg-muted/50 border rounded-bl-none'
                                    }`}
                            >
                                <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                            </div>

                            {message.role === 'user' && (
                                <Avatar className="h-8 w-8 mt-1 border">
                                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <Avatar className="h-8 w-8 mt-1 border">
                                <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            <div className="bg-muted/50 border rounded-xl rounded-bl-none p-4 flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-xs text-muted-foreground">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            <div className="mt-4 pt-4 border-t bg-background">
                <form onSubmit={handleSubmit} className="flex gap-2 items-end">
                    <Input
                        placeholder="Ask a question about the file..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        className="flex-1 min-h-[44px]"
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="h-11 w-11 shrink-0">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </div>
        </div>
    )
}
