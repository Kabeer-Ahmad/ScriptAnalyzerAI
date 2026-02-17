import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { User, FileText, LogOut, Trash2 } from 'lucide-react'
import { SignOutButton } from '@/components/dashboard/settings/sign-out-button'
import { DeleteAccountButton } from '@/components/dashboard/settings/delete-account-button'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Settings',
}

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get user stats
    const { count: filesCount } = await supabase
        .from('files')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    const { count: analysesCount } = await supabase
        .from('analyses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    return (
        <div className="h-full overflow-y-auto p-4 md:p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">Manage your account and preferences</p>
                </div>

                <Separator />

                {/* Profile Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Profile
                        </CardTitle>
                        <CardDescription>Your account information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <p className="text-lg">{user.email}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                            <p className="text-lg">{new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Usage Statistics
                        </CardTitle>
                        <CardDescription>Your activity overview</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border rounded-lg">
                                <p className="text-sm text-muted-foreground">Total Files</p>
                                <p className="text-3xl font-bold">{filesCount || 0}</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <p className="text-sm text-muted-foreground">Total Analyses</p>
                                <p className="text-3xl font-bold">{analysesCount || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Actions</CardTitle>
                        <CardDescription>Manage your account</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h3 className="font-medium">Sign Out</h3>
                                <p className="text-sm text-muted-foreground">Sign out of your account</p>
                            </div>
                            <SignOutButton />
                        </div>

                        <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                            <div>
                                <h3 className="font-medium text-destructive">Delete Account</h3>
                                <p className="text-sm text-muted-foreground">
                                    Permanently delete your account and all associated data
                                </p>
                            </div>
                            <DeleteAccountButton />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
