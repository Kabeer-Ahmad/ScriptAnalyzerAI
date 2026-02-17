'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

interface TranscriptViewProps {
    transcription: any // Type this properly later
}

export function TranscriptView({ transcription }: TranscriptViewProps) {
    if (!transcription) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <p>No transcription available yet.</p>
                <p className="text-sm">Please wait while we process your file.</p>
            </div>
        )
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(transcription.transcript_text)
        toast.success('Transcript copied to clipboard')
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-end mb-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Text
                </Button>
            </div>
            <ScrollArea className="flex-1 h-0 rounded-md border p-4">
                <div className="whitespace-pre-wrap leading-relaxed">
                    {transcription.transcript_text || "Processing transcript..."}
                </div>
            </ScrollArea>
        </div>
    )
}
