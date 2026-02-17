'use client'

import React from 'react'
import Link from 'next/link'
import { FileVideo, FileAudio, Calendar, Clock, MoreVertical, Trash, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DeleteFileMenuItem } from '@/components/dashboard/delete-file-menu-item'

export interface FileRecord {
    id: string
    filename: string
    file_type: string
    status: string
    created_at: string
    transcriptions?: { duration_seconds: number }[]
}

interface FileCardProps {
    file: FileRecord
}

export function FileCard({ file }: FileCardProps) {
    const isVideo = file.file_type.includes('video')
    const duration_seconds = file.transcriptions?.[0]?.duration_seconds

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                    {isVideo ? <FileVideo className="h-4 w-4 text-blue-500" /> : <FileAudio className="h-4 w-4 text-purple-500" />}
                    <Badge variant="outline" className="text-xs uppercase">{file.status}</Badge>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/files/${file.id}`} className="flex items-center cursor-pointer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Open
                            </Link>
                        </DropdownMenuItem>
                        {/* We use the DeleteFileButton's alert dialog logic but triggered from dropdown? 
                            The DeleteFileButton renders a button. We might need to refactor DeleteFileButton to accept a custom trigger 
                            or just replicate the delete logic here since FileCard is already a client component.
                            Let's import DeleteFileButton for now and see if we can use it as a trigger wrapper or just execute delete.
                            Actually, simpler to just put DeleteFileButton in the card footer or header as a standalone icon button if needed.
                            But user asked for "improve project card and actions". 
                            A dropdown with "Delete" is standard.
                            Let's modify DeleteFileButton to accept 'children' as trigger?
                            Or just duplicate the simple delete logic here for speed.
                        */}
                        <DeleteFileMenuItem fileId={file.id} filename={file.filename} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <Link href={`/dashboard/files/${file.id}`} className="hover:underline">
                    <CardTitle className="text-base truncate" title={file.filename}>
                        {file.filename}
                    </CardTitle>
                </Link>
            </CardContent>
            <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between">
                <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(file.created_at).toLocaleDateString()}</span>
                </div>
                {file.transcriptions && file.transcriptions.length > 0 && file.transcriptions[0].duration_seconds && (
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{Math.round(file.transcriptions[0].duration_seconds / 60)}m</span>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}
