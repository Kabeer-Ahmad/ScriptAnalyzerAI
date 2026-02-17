
import { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
    title: "Terms of Service - ScriptAnalyzerAI",
    description: "Terms and Conditions for using ScriptAnalyzerAI",
}

export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="flex-1 pt-24 pb-12">
                <div className="container max-w-4xl mx-auto px-4 md:px-6">
                    <div className="space-y-6">
                        <div className="border-b pb-6">
                            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">Terms of Service</h1>
                            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                        </div>

                        <div className="prose dark:prose-invert max-w-none space-y-8 mt-8">
                            <section>
                                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                                <p className="leading-relaxed text-muted-foreground">
                                    By accessing and using ScriptAnalyzerAI, you accept and agree to be bound by the terms and provision of this agreement.
                                    If you do not agree to abide by these terms, please do not use this service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">2. User Accounts</h2>
                                <p className="mb-4 text-muted-foreground">
                                    To access certain features of the platform, you must register for an account. You agree to provide accurate information
                                    and to keep it updated. You are responsible for maintaining the confidentiality of your account credentials.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">3. Content and Intellectual Property</h2>
                                <p className="mb-4 text-muted-foreground">
                                    You retain all rights to the audio and video content you upload to ScriptAnalyzerAI. By uploading content, you grant us
                                    a limited license to process, transcribe, and analyze the content solely for the purpose of providing the service to you.
                                </p>
                                <p className="text-muted-foreground">
                                    The generated transcripts and analysis reports belong to you.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">4. Acceptable Use</h2>
                                <p className="mb-4 text-muted-foreground">You agree not to use the service to:</p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>Upload illegal, harmful, or malicious content.</li>
                                    <li>Attempt to gain unauthorized access to the service or its related systems.</li>
                                    <li>Interfere with or disrupt the integrity or performance of the service.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
                                <p className="leading-relaxed text-muted-foreground">
                                    In no event shall ScriptAnalyzerAI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">6. Changes to Terms</h2>
                                <p className="leading-relaxed text-muted-foreground">
                                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days notice prior to any new terms taking effect.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
                                <p className="leading-relaxed text-muted-foreground">
                                    If you have any questions about these Terms, please contact us at <a href="mailto:terms@scriptanalyzer.com" className="text-primary hover:underline">terms@scriptanalyzer.com</a>.
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
