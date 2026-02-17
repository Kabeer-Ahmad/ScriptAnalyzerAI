'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from 'sonner'
import { Loader2, FileText, ArrowLeft } from 'lucide-react'

function AuthPageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const defaultTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login'

    // Login State
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [isLoginLoading, setIsLoginLoading] = useState(false)

    // Signup State
    const [signupEmail, setSignupEmail] = useState('')
    const [signupPassword, setSignupPassword] = useState('')
    const [isSignupLoading, setIsSignupLoading] = useState(false)

    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoginLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password: loginPassword,
            })

            if (error) {
                toast.error(error.message)
                return
            }

            router.push('/dashboard')
            router.refresh()
        } catch (error) {
            toast.error('An unexpected error occurred')
        } finally {
            setIsLoginLoading(false)
        }
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSignupLoading(true)

        try {
            const { error } = await supabase.auth.signUp({
                email: signupEmail,
                password: signupPassword,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                },
            })

            if (error) {
                toast.error(error.message)
                return
            }

            toast.success('Check your email to confirm your account')
            // Switch to login tab optionally, or just redirect
            // For now, let's keep them here with success message
        } catch (error) {
            toast.error('An unexpected error occurred')
        } finally {
            setIsSignupLoading(false)
        }
    }

    return (
        <div className="w-full max-w-lg z-10 px-4">
            <div className="flex flex-col items-center text-center space-y-6 mb-8">
                <Link href="/" className="group flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm shadow-xl transition-transform group-hover:scale-105">
                    <FileText className="h-8 w-8 text-primary group-hover:text-primary/80 transition-colors" />
                </Link>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to ScriptAnalyzerAI</h1>
                    <p className="text-base text-muted-foreground max-w-sm mx-auto">
                        Your AI-powered companion for media transcription and analysis.
                    </p>
                </div>
            </div>

            <div className="backdrop-blur-xl bg-white/40 dark:bg-black/40 border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl p-6 sm:p-8">
                <Tabs defaultValue={defaultTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 h-auto p-1.5 bg-muted/50 rounded-2xl">
                        <TabsTrigger
                            value="login"
                            className="rounded-xl text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm py-3 text-muted-foreground hover:text-foreground"
                        >
                            Sign In
                        </TabsTrigger>
                        <TabsTrigger
                            value="signup"
                            className="rounded-xl text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm py-3 text-muted-foreground hover:text-foreground"
                        >
                            Create Account
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email">Email Address</Label>
                                    <Input
                                        id="login-email"
                                        type="email"
                                        placeholder="name@company.com"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        required
                                        className="h-11 bg-white/50 dark:bg-black/50 border-white/20 dark:border-white/10 focus-visible:ring-primary/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="login-password">Password</Label>
                                        <Link
                                            href="#"
                                            className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                toast.info("Password reset not implemented yet.")
                                            }}
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="login-password"
                                        type="password"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required
                                        className="h-11 bg-white/50 dark:bg-black/50 border-white/20 dark:border-white/10 focus-visible:ring-primary/30"
                                    />
                                </div>
                            </div>
                            <Button className="w-full h-11 text-base shadow-lg hover:shadow-xl transition-all" type="submit" disabled={isLoginLoading}>
                                {isLoginLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">Email Address</Label>
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        placeholder="name@company.com"
                                        value={signupEmail}
                                        onChange={(e) => setSignupEmail(e.target.value)}
                                        required
                                        className="h-11 bg-white/50 dark:bg-black/50 border-white/20 dark:border-white/10 focus-visible:ring-primary/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">Password</Label>
                                    <Input
                                        id="signup-password"
                                        type="password"
                                        value={signupPassword}
                                        onChange={(e) => setSignupPassword(e.target.value)}
                                        required
                                        className="h-11 bg-white/50 dark:bg-black/50 border-white/20 dark:border-white/10 focus-visible:ring-primary/30"
                                    />
                                    <p className="text-xs text-muted-foreground px-1">
                                        Must be at least 6 characters long
                                    </p>
                                </div>
                            </div>
                            <Button className="w-full h-11 text-base shadow-lg hover:shadow-xl transition-all" type="submit" disabled={isSignupLoading}>
                                {isSignupLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Account
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
                By continuing, you agree to our{' '}
                <Link href="#" className="underline underline-offset-4 hover:text-primary">
                    Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="underline underline-offset-4 hover:text-primary">
                    Privacy Policy
                </Link>
                .
            </p>
        </div>
    )
}

export default function AuthPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-background to-background -z-10" />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-50" />

            <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
                <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </div>

            <Suspense fallback={<div className="flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                <AuthPageContent />
            </Suspense>
        </div>
    )
}
