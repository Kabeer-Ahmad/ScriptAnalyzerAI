'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, File, X, Loader2, Youtube } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null)
    const [youtubeUrl, setYoutubeUrl] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const router = useRouter()
    const supabase = createClient()

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0])
            setYoutubeUrl('') // Clear YouTube URL if file is dropped
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'audio/*': [],
            'video/*': []
        },
        maxFiles: 1,
        multiple: false
    })

    const removeFile = () => {
        setFile(null)
    }

    const handleUpload = async () => {
        if (!file && !youtubeUrl) {
            toast.error('Please select a file or enter a YouTube URL')
            return
        }

        setIsUploading(true)
        setUploadProgress(0)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                toast.error('You must be logged in to upload')
                router.push('/login')
                return
            }

            if (file) {
                // File Upload Logic
                const fileExt = file.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
                const filePath = `${user.id}/${fileName}`

                // 1. Upload to Storage
                const { error: uploadError, data } = await supabase.storage
                    .from('media-files')
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: false
                    })

                if (uploadError) throw uploadError

                // 2. Create DB Record
                const { data: fileData, error: dbError } = await supabase.from('files').insert({
                    user_id: user.id,
                    filename: file.name,
                    original_filename: file.name,
                    file_type: file.type,
                    file_size: file.size,
                    storage_path: data.path,
                    source_type: 'upload',
                    status: 'processing' // Initial status
                }).select().single()

                if (dbError) throw dbError

                // 3. Trigger transcription
                await fetch('/api/transcribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileId: fileData.id }),
                })

                toast.success('File uploaded and processing started')
                router.push('/dashboard')

            } else if (youtubeUrl) {
                // YouTube Logic
                // This will be handled by a server-side API Route
                const response = await fetch('/api/process/youtube', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ url: youtubeUrl })
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.error || 'Failed to process YouTube URL')
                }

                toast.success('YouTube video queued for processing')
                router.push('/dashboard')
            }

        } catch (error: any) {
            console.error(error)
            toast.error(error.message || 'Upload failed')
        } finally {
            setIsUploading(false)
            setUploadProgress(0)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Upload Content</h2>

            <div className="grid gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>File Upload</CardTitle>
                        <CardDescription>Upload audio or video files (up to 500MB)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!file ? (
                            <div
                                {...getRootProps()}
                                className={`
                                border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
                                ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900'}
                            `}
                            >
                                <input {...getInputProps()} />
                                <div className="flex flex-col items-center gap-2">
                                    <UploadCloud className="h-10 w-10 text-muted-foreground" />
                                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">MP3, MP4, WAV, MOV (max 500MB)</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                                <div className="flex items-center gap-3">
                                    <File className="h-8 w-8 text-primary" />
                                    <div>
                                        <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={removeFile}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>YouTube URL</CardTitle>
                        <CardDescription>Paste a YouTube link to process</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Youtube className="h-5 w-5 text-red-600" />
                            <Input
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                disabled={!!file}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Button size="lg" onClick={handleUpload} disabled={isUploading || (!file && !youtubeUrl)}>
                    {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isUploading ? 'Processing...' : 'Start Processing'}
                </Button>
            </div>
        </div>
    )
}
