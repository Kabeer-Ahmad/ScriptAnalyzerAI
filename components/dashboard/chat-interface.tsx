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
    }, [messages])

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
        <div className="flex flex-col h-full max-w-4xl mx-auto">
            <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-muted-foreground py-10">
                            <p>Ask me anything about the content of this file.</p>
                        </div>
                    )}

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                }`}
                        >
                            {message.role === 'assistant' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                                </Avatar>
                            )}

                            <div
                                className={`rounded-lg p-3 max-w-[80%] ${message.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                    }`}
                            >
                                <p className="text-sm">{message.content}</p>
                            </div>

                            {message.role === 'user' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            <div className="bg-muted rounded-lg p-3">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            <div className="mt-4 pt-4 border-t">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        placeholder="Type your question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </div>
        </div>
    )
}
