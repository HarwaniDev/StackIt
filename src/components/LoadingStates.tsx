import { Card, CardContent } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"

export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-black" />
                <span className="text-gray-600">Loading posts...</span>
            </div>
        </div>
    )
}

export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
    return (
        <div className="flex items-center justify-center py-12">
            <Card className="max-w-md">
                <CardContent className="p-6 text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
                    <p className="text-gray-600 mb-4">{message}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="bg-black text-white px-4 py-2 rounded hover:bg-black/90 transition-colors"
                        >
                            Try Again
                        </button>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export function SkeletonPost() {
    return (
        <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                    <div className="flex gap-2 mb-3">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function SkeletonPostList() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonPost key={index} />
            ))}
        </div>
    )
}
