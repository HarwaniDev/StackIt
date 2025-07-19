"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  LinkIcon,
  ImageIcon,
  Smile,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
} from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isPreview, setIsPreview] = useState(false)

  const insertText = (before: string, after = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
    onChange(newText)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const handleBold = () => insertText("**", "**")
  const handleItalic = () => insertText("*", "*")
  const handleStrikethrough = () => insertText("~~", "~~")
  const handleBulletList = () => insertText("\n- ", "")
  const handleNumberedList = () => insertText("\n1. ", "")
  const handleLink = () => insertText("[", "](url)")
  const handleImage = () => insertText("![alt text](", ")")
  const handleEmoji = () => insertText("😊", "")
  const handleCodeBlock = () => insertText("\n```\n", "\n```\n")

  // Simple syntax highlighting for preview
  const renderPreview = (text: string) => {
    let html = text

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="bg-gray-100 p-4 rounded border overflow-x-auto"><code class="text-sm font-mono text-black">${code.trim()}</code></pre>`
    })

    // Inline code
    html = html.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-black">$1</code>',
    )

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Italic
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>")

    // Strikethrough
    html = html.replace(/~~(.*?)~~/g, "<del>$1</del>")

    // Links
    html = html.replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')

    // Line breaks
    html = html.replace(/\n/g, "<br>")

    return html
  }

  return (
    <div className="border rounded-md bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b bg-gray-50 rounded-t-md">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBold}
          className="h-9 w-9 p-0 hover:bg-blue-100 hover:text-blue-600 border border-gray-200 bg-white"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleItalic}
          className="h-9 w-9 p-0 hover:bg-blue-100 hover:text-blue-600 border border-gray-200 bg-white"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleStrikethrough}
          className="h-9 w-9 p-0 hover:bg-blue-100 hover:text-blue-600 border border-gray-200 bg-white"
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBulletList}
          className="h-9 w-9 p-0 hover:bg-green-100 hover:text-green-600 border border-gray-200 bg-white"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleNumberedList}
          className="h-9 w-9 p-0 hover:bg-green-100 hover:text-green-600 border border-gray-200 bg-white"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCodeBlock}
          className="h-9 w-9 p-0 hover:bg-gray-100 hover:text-gray-600 border border-gray-200 bg-white"
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleLink}
          className="h-9 w-9 p-0 hover:bg-purple-100 hover:text-purple-600 border border-gray-200 bg-white"
          title="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleImage}
          className="h-9 w-9 p-0 hover:bg-purple-100 hover:text-purple-600 border border-gray-200 bg-white"
          title="Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleEmoji}
          className="h-9 w-9 p-0 hover:bg-yellow-100 hover:text-yellow-600 border border-gray-200 bg-white"
          title="Emoji"
        >
          <Smile className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 hover:bg-orange-100 hover:text-orange-600 border border-gray-200 bg-white"
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 hover:bg-orange-100 hover:text-orange-600 border border-gray-200 bg-white"
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 hover:bg-orange-100 hover:text-orange-600 border border-gray-200 bg-white"
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="flex-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
          className="h-9 px-3 hover:bg-blue-100 hover:text-blue-600 border border-gray-200 bg-white text-sm"
        >
          {isPreview ? "Edit" : "Preview"}
        </Button>
      </div>

      {/* Content Area */}
      {isPreview ? (
        <div
          className="min-h-[200px] p-4 bg-white text-black prose max-w-none"
          dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
        />
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[200px] border-0 resize-none focus-visible:ring-0 bg-white text-black placeholder:text-gray-500 font-mono"
        />
      )}
    </div>
  )
}
