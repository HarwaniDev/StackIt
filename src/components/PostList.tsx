"use client"

import { memo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"
import Link from "next/link"

interface Post {
    slug: string;
    title: string;
    description: string;
    createdAt: string;
    author: string;
    tags: string[];
    commentsCount: number;
}

interface PostListProps {
    posts: Post[];
    searchQuery: string;
}

const PostCard = memo(({ post }: { post: Post }) => {
    // Function to strip HTML tags and get plain text
    function stripFormatting(text: string): string {
        return text
            .replace(/\*\*(.*?)\*\*/g, '$1') // bold
            .replace(/\*(.*?)\*/g, '$1')     // italic
            .replace(/`(.*?)`/g, '$1')       // highlight/code
            .replace(/~(.*?)~/g, '$1')       // strikethrough
            .trim();
    }
    

    // Get plain text content for preview
    const plainTextContent = stripFormatting(post.description);

    // Truncate content to ~200 characters for preview
    const previewContent = plainTextContent.length > 200
        ? plainTextContent.substring(0, 200) + "..."
        : plainTextContent;

    return (
        <Card className="hover:shadow-md transition-shadow bg-white border border-gray-200">
            <CardContent className="p-6 bg-white">
                <div className="flex flex-col">
                    <div className="flex-1 flex flex-col">
                        <Link href={`/post/${post.slug}`}>
                            <h3 className="text-lg font-semibold cursor-pointer mb-2 text-black hover:opacity-80">
                                {post.title}
                            </h3>
                        </Link>
                        <p className="text-gray-700 mb-3 leading-relaxed">
                            {previewContent}
                            {plainTextContent.length > 200 && (
                                <Link href={`/post/${post.slug}`} className="text-blue-600 hover:text-blue-800 font-medium ml-1">
                                    Read more
                                </Link>
                            )}
                        </p>
                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4 text-black" />
                                <span>{post.commentsCount} comments</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map((tag) => (
                                <Badge key={tag} className="text-xs bg-black text-white">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {post.author.charAt(0).toUpperCase()}
                        </div>
                        <span>posted by <span className="font-medium text-gray-800">{post.author}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">•</span>
                        <span className="font-medium">{post.createdAt}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
})

PostCard.displayName = "PostCard"

export default function PostList({ posts, searchQuery }: PostListProps) {
    const filteredPosts = posts.filter((post) =>
        searchQuery.trim() === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredPosts.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                No results found.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {filteredPosts.map((post, index) => (
                <PostCard key={`${post.slug}-${index}`} post={post} />
            ))}
        </div>
    );
}
