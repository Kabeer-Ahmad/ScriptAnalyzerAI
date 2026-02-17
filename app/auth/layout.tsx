import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Get Started | ScriptAnalyzer",
    description: "Sign in or create an account to start analyzing your media files.",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
