import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Upload Media",
    description: "Upload audio or video files for AI analysis.",
}

export default function UploadLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
