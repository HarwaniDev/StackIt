  // Simple syntax highlighting for preview
  export const renderPreview = (text: string) => {
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