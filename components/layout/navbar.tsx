
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export function Navbar() {
    return (
        <header className="px-4 lg:px-6 h-16 flex items-center border-b backdrop-blur-md fixed w-full z-50 bg-background/80">
            <Link className="flex items-center justify-center gap-2" href="/">
                <div className="bg-primary/10 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                </div>
                <span className="font-bold text-xl tracking-tight">ScriptAnalyzerAI</span>
            </Link>
            <nav className="ml-auto flex gap-6 sm:gap-8 items-center">
                <Link className="text-sm font-medium hover:text-primary transition-colors hidden sm:block" href="/#features">
                    Features
                </Link>
                <Link className="text-sm font-medium hover:text-primary transition-colors hidden sm:block" href="/#pricing">
                    Pricing
                </Link>
                <Link className="text-sm font-medium hover:text-primary transition-colors hidden sm:block" href="/#faq">
                    FAQ
                </Link>
                <Link href="/auth?tab=login">
                    <Button size="sm" className="rounded-full px-6">Get Started</Button>
                </Link>
            </nav>
        </header>
    );
}
