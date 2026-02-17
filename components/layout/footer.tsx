
import Link from "next/link";
import { FileText } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full py-12 bg-gray-50 dark:bg-gray-900 border-t">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-2 md:col-span-1">
                        <Link className="flex items-center gap-2 mb-4" href="/">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <span className="font-bold text-lg">ScriptAnalyzerAI</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            The smartest way to interact with your audio and video content.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/#features" className="hover:text-primary">Features</Link></li>
                            <li><Link href="/#pricing" className="hover:text-primary">Pricing</Link></li>
                            <li><Link href="/#faq" className="hover:text-primary">FAQ</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
                            <li><Link href="/security" className="hover:text-primary">Security</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} ScriptAnalyzerAI. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
