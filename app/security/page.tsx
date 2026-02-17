
import { Metadata } from "next"
import { Shield, Lock, Server, Eye, Database, Key } from "lucide-react"
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
    title: "Security - ScriptAnalyzerAI",
    description: "Security practices and infrastructure at ScriptAnalyzerAI",
}

export default function SecurityPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="flex-1 pt-24 pb-12">
                <div className="container max-w-4xl mx-auto px-4 md:px-6">
                    <div className="space-y-6">
                        <div className="border-b pb-6">
                            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Security</h1>
                            <p className="text-xl text-muted-foreground max-w-2xl">
                                Your trust is our priority. We use enterprise-grade security to protect your data at every layer.
                            </p>
                        </div>

                        <div className="grid gap-8 mt-12">
                            {/* Infrastructure */}
                            <div className="border rounded-xl p-8 bg-card shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                                        <Server className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Secure Infrastructure</h2>
                                </div>
                                <p className="text-muted-foreground mb-4">
                                    Our infrastructure is built on industry-leading cloud providers with robust security certifications.
                                </p>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                                        <span>Hosted on secure Next.js infrastructure (Vercel).</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                                        <span>Database managed by Supabase (PostgreSQL) with automated daily backups.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                                        <span>Data isolation using Row Level Security (RLS) policies.</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Encryption */}
                            <div className="border rounded-xl p-8 bg-card shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                                        <Lock className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Data Encryption</h2>
                                </div>
                                <p className="text-muted-foreground mb-4">
                                    We encrypt your data at every stage of its lifecycle to ensure confidentiality.
                                </p>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                                        <span><strong>In Transit:</strong> All data sent to and from our services is encrypted using TLS 1.2+.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                                        <span><strong>At Rest:</strong> Your files and database records are encrypted at rest using AES-256 standards.</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Access Control */}
                            <div className="border rounded-xl p-8 bg-card shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                        <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Authentication & Access</h2>
                                </div>
                                <p className="text-muted-foreground mb-4">
                                    Strict access controls ensure only you can see your data.
                                </p>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
                                        <span>Secure passwordless and OAuth authentication methods.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
                                        <span>Strict RLS (Row Level Security) policies enforcement in the database.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
                                        <span>We do not sell your data to third parties.</span>
                                    </li>
                                </ul>
                            </div>

                            {/* AI Safety */}
                            <div className="border rounded-xl p-8 bg-card shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                                        <Eye className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold">AI Privacy</h2>
                                </div>
                                <p className="text-muted-foreground mb-4">
                                    How we handle AI processing of your confidential media.
                                </p>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                                        <span>Data is sent to AssemblyAI and Anthropic via secure, encrypted APIs.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                                        <span><strong>Zero Retention:</strong> We configure our API calls to ensure your data is not used for model training by our providers.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                                        <span>Ephemeral processing: Data is processed and returned, not permanently stored by AI providers.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
