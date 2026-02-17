import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()

        // 1. Check Auth
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 2. Get file info to find storage path
        const { data: file, error: fetchError } = await supabase
            .from('files')
            .select('storage_path, user_id')
            .eq('id', id)
            .single()

        if (fetchError || !file) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 })
        }

        if (file.user_id !== user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // 3. Delete from Storage
        if (file.storage_path) {
            const { error: storageError } = await supabase.storage
                .from('media-files')
                .remove([file.storage_path])

            if (storageError) {
                console.error('Storage deletion error:', storageError)
                // Continue to delete DB record even if storage fails, strictly speaking
                // but usually better to warn. We'll proceed.
            }
        }

        // 4. Delete from Database
        const { error: deleteError } = await supabase
            .from('files')
            .delete()
            .eq('id', id)

        if (deleteError) {
            throw deleteError
        }

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Delete failed:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
