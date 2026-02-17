import { Metadata } from 'next'
import { Sidebar } from '@/components/dashboard/sidebar'

export const metadata: Metadata = {
    title: {
        default: "Dashboard",
        template: "%s | ScriptAnalyzerAI"
    },
    description: "Manage your transcriptions and analysis.",
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="grid h-screen w-full lg:grid-cols-[280px_1fr] overflow-hidden">
            <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 overflow-y-auto">
                <Sidebar />
            </div>
            <div className="flex flex-col h-full overflow-hidden">
                {/* Mobile Header could go here */}
                <header className="flex h-14 lg:hidden items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 shrink-0">
                    <div className="flex items-center gap-2 font-semibold">
                        {/* Mobile Sidebar Trigger could go here */}
                        <span>ScriptAnalyzerAI</span>
                    </div>
                </header>
                <main className="flex flex-1 flex-col overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    )
}
