import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Download, FileText, MessageSquare, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { TranscriptView } from '@/components/dashboard/transcript-view'
import { AnalysisView } from '@/components/dashboard/analysis-view'
import { ChatInterface } from '@/components/dashboard/chat-interface'
import { DeleteFileButton } from '@/components/dashboard/delete-file-button'

import { Metadata } from 'next'

interface FileDetailPageProps {
    params: Promise<{
        id: string
    }>
}

export async function generateMetadata({ params }: FileDetailPageProps): Promise<Metadata> {
    const { id } = await params
    const supabase = await createClient()
    const { data: file } = await supabase.from('files').select('filename').eq('id', id).single()

    return {
        title: file ? file.filename : 'File Details',
    }
}

export default async function FileDetailPage({ params }: FileDetailPageProps) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch file with related data
    const { data: file, error } = await supabase
        .from('files')
        .select(`
      *,
      transcriptions (*),
      analyses (*)
    `)
        .eq('id', id)
        .single()

    if (error || !file) {
        notFound()
    }

    const transcription = file.transcriptions?.[0]
    const analysis = file.analyses?.[0]

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-semibold truncate max-w-md" title={file.filename}>
                            {file.filename}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {new Date(file.created_at).toLocaleDateString()} • {file.file_type}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <DeleteFileButton fileId={file.id} filename={file.filename} />
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="transcript" className="flex-1 flex flex-col overflow-hidden">
                <div className="border-b px-1">
                    <TabsList>
                        <TabsTrigger value="transcript">
                            <FileText className="mr-2 h-4 w-4" />
                            Transcript
                        </TabsTrigger>
                        <TabsTrigger value="analysis">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Analysis
                        </TabsTrigger>
                        <TabsTrigger value="chat">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Chat
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="transcript" className="flex-1 overflow-hidden p-4 pt-4 border rounded-md m-1 bg-white dark:bg-zinc-950">
                    <TranscriptView transcription={transcription} />
                </TabsContent>

                <TabsContent value="analysis" className="flex-1 overflow-auto p-4 pt-4 border rounded-md m-1 bg-white dark:bg-zinc-950">
                    <AnalysisView analysis={analysis} fileId={file.id} />
                </TabsContent>

                <TabsContent value="chat" className="flex-1 overflow-hidden p-4 pt-4 border rounded-md m-1 bg-white dark:bg-zinc-950">
                    <ChatInterface fileId={file.id} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
