import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const fileId = '1f5be762-53a3-447a-81e8-245f12afc6b8'

async function check() {
    console.log('Checking URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Service Key Present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

    // Test basic file fetch
    const { data: file, error } = await supabaseAdmin
        .from('files')
        .select('*')
        .eq('id', fileId)
        .limit(1)
        .maybeSingle()

    if (error) {
        console.error('Error fetching file:', error)
    } else {
        console.log('File found:', file ? 'YES' : 'NO')
        if (file) console.log('File status:', file.status)
    }

    // Test transcription fetch
    const { data: transcripts, error: trError } = await supabaseAdmin
        .from('transcriptions')
        .select('*')
        .eq('file_id', fileId)

    if (trError) {
        console.error('Error fetching transcript:', trError)
    } else {
        console.log('Transcripts found:', transcripts?.length)
    }
}

check()
