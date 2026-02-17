import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileCard, FileRecord } from '@/components/dashboard/file-card'
import { Button } from '@/components/ui/button'
import { UploadCloud } from 'lucide-react'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: files } = await supabase
        .from('files')
        .select('*, transcriptions(duration_seconds)')
        .order('created_at', { ascending: false })

    return (
        <div className="h-full overflow-y-auto p-4 md:p-6">
            <div className="flex flex-col gap-8 max-w-6xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                        <p className="text-muted-foreground">Manage your uploaded files and transcriptions.</p>
                    </div>
                    <Link href="/dashboard/upload">
                        <Button>
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Upload File
                        </Button>
                    </Link>
                </div>

                {!files || files.length === 0 ? (
                    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
                        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                            <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                            <h3 className="mt-4 text-lg font-semibold">No files uploaded</h3>
                            <p className="mb-4 mt-2 text-sm text-muted-foreground">
                                You haven&apos;t uploaded any files yet. Upload a video or audio file to start.
                            </p>
                            <Link href="/dashboard/upload">
                                <Button>Upload File</Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {files.map((file: any) => (
                            <FileCard key={file.id} file={file as FileRecord} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
