'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface Analysis {
    summary?: string
    key_points?: string[]
    insights?: string
    time_assessment?: string
    target_audience?: string
    rewrite_suggestions?: string[]
    file_id?: string
}

interface AnalysisViewProps {
    analysis: Analysis | null
    fileId: string
}

export function AnalysisView({ analysis, fileId }: AnalysisViewProps) {
    const [isReanalyzing, setIsReanalyzing] = useState(false)

    const handleReanalyze = async () => {
        setIsReanalyzing(true)
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileId })
            })

            if (response.ok) {
                toast.success('Re-analysis started! Refresh the page in a few moments.')
            } else {
                const error = await response.json()
                toast.error(error.error || 'Failed to start re-analysis')
            }
        } catch (error) {
            toast.error('Failed to start re-analysis')
        } finally {
            setIsReanalyzing(false)
        }
    }

    if (!analysis) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
                <p>No analysis available yet.</p>
                <p className="text-sm">Analysis starts after transcription is complete.</p>
                <Button onClick={handleReanalyze} disabled={isReanalyzing}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isReanalyzing ? 'animate-spin' : ''}`} />
                    {isReanalyzing ? 'Analyzing...' : 'Start Analysis'}
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Analysis Report</h2>
                <Button variant="outline" size="sm" onClick={handleReanalyze} disabled={isReanalyzing}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isReanalyzing ? 'animate-spin' : ''}`} />
                    {isReanalyzing ? 'Re-analyzing...' : 'Re-analyze'}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose dark:prose-invert text-sm">
                            {analysis.summary}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Target Audience</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{analysis.target_audience || 'N/A'}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Time Assessment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{analysis.time_assessment || 'N/A'}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Key Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm">
                            {analysis.key_points && Array.isArray(analysis.key_points) && analysis.key_points.map((point: string, index: number) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Insights & Takeaways</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose dark:prose-invert text-sm">
                            {analysis.insights}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {analysis.rewrite_suggestions && analysis.rewrite_suggestions.length > 0 && (
                <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
                    <CardHeader>
                        <CardTitle className="text-blue-700 dark:text-blue-300">Rewrite & Improvement Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground">
                            {analysis.rewrite_suggestions.map((suggestion: string, index: number) => (
                                <li key={index}>{suggestion}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
