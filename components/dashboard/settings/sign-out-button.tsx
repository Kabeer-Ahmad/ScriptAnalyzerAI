'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useState } from 'react'

export function SignOutButton() {
    const router = useRouter()
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)

    const handleSignOut = async () => {
        setIsLoading(true)
        const { error } = await supabase.auth.signOut()

        if (error) {
            toast.error(error.message)
            setIsLoading(false)
        } else {
            toast.success('Signed out successfully')
            router.push('/login')
        }
    }

    return (
        <Button variant="outline" onClick={handleSignOut} disabled={isLoading}>
            <LogOut className="mr-2 h-4 w-4" />
            {isLoading ? 'Signing out...' : 'Sign Out'}
        </Button>
    )
}
