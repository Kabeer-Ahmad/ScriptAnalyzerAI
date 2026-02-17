
import { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
    title: "Privacy Policy - ScriptAnalyzerAI",
    description: "Privacy Policy for ScriptAnalyzerAI",
}

export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="flex-1 pt-24 pb-12">
                <div className="container max-w-4xl mx-auto px-4 md:px-6">
                    <div className="space-y-6">
                        <div className="border-b pb-6">
                            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">Privacy Policy</h1>
                            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                        </div>

                        <div className="prose dark:prose-invert max-w-none space-y-8 mt-8">
                            <section>
                                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                                <p className="leading-relaxed text-muted-foreground">
                                    Welcome to ScriptAnalyzerAI. We are committed to protecting your personal information and your right to privacy.
                                    This Privacy Policy explains what information we collect, how we use it, and your rights in relation to it.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
                                <p className="mb-4 text-muted-foreground">We collect information that you provide securely to us when you register on the website, express an interest in obtaining information about us or our products and services, or otherwise when you contact us.</p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li><strong>Personal Information:</strong> Includes email addresses, names, and passwords necessary for authentication.</li>
                                    <li><strong>Media Files:</strong> Audio and video files you upload for transcription and analysis.</li>
                                    <li><strong>Usage Data:</strong> Information about how you use our website, such as access times and pages viewed.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                                <p className="mb-4 text-muted-foreground">We use personal information collected via our website for a variety of business purposes described below:</p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>To facilitate account creation and logon process.</li>
                                    <li>To provide the transcription and analysis services you request.</li>
                                    <li>To send administrative information to you.</li>
                                    <li>To protect our services (e.g., fraud monitoring and prevention).</li>
                                </ul>
                                <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
                                    <p className="font-semibold text-sm">Important Note</p>
                                    <p className="text-sm text-muted-foreground mt-1">We do not use your uploaded media files or transcripts to train our AI models. Your data remains yours.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">4. Sharing Your Information</h2>
                                <p className="mb-4 text-muted-foreground">We only share information with the following third parties to provide our services:</p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li><strong>AssemblyAI:</strong> For speech-to-text transcription services.</li>
                                    <li><strong>Anthropic (Claude):</strong> For text analysis and summarization.</li>
                                    <li><strong>Supabase:</strong> For secure database and authentication services.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
                                <p className="leading-relaxed text-muted-foreground">
                                    We retain your personal information and media files only for as long as necessary to fulfill the purposes set out in this privacy policy,
                                    unless a longer retention period is required or permitted by law. You can delete your account and all associated data at any time from your settings page.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
                                <p className="leading-relaxed text-muted-foreground">
                                    If you have questions or comments about this policy, you may email us at <a href="mailto:support@scriptanalyzer.com" className="text-primary hover:underline">support@scriptanalyzer.com</a>.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
