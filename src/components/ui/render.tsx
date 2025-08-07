import sanitizeHtml from 'sanitize-html';

// Simple syntax highlighting for preview
  export const renderPreview = (text: string) => {
    let html = text

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

    // Process lists (both bullet and numbered)
    const lines = html.split('\n')
    const processedLines = []
    let inBulletList = false
    let inNumberedList = false
    let listItems = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      if (!line) continue
      
      // Check for bullet list item
      if (line.match(/^- (.+)$/)) {
        if (!inBulletList) {
          if (inNumberedList) {
            // Close numbered list
            processedLines.push(`<ol class="list-decimal pl-6 space-y-1">${listItems.join('')}</ol>`)
            listItems = []
            inNumberedList = false
          }
          inBulletList = true
        }
        listItems.push(`<li>${line.replace(/^- (.+)$/, '$1')}</li>`)
      }
      // Check for numbered list item
      else if (line.match(/^\d+\. (.+)$/)) {
        if (!inNumberedList) {
          if (inBulletList) {
            // Close bullet list
            processedLines.push(`<ul class="list-disc pl-6 space-y-1">${listItems.join('')}</ul>`)
            listItems = []
            inBulletList = false
          }
          inNumberedList = true
        }
        listItems.push(`<li>${line.replace(/^\d+\. (.+)$/, '$1')}</li>`)
      }
      // Regular line
      else {
        if (inBulletList) {
          processedLines.push(`<ul class="list-disc pl-6 space-y-1">${listItems.join('')}</ul>`)
          listItems = []
          inBulletList = false
        } else if (inNumberedList) {
          processedLines.push(`<ol class="list-decimal pl-6 space-y-1">${listItems.join('')}</ol>`)
          listItems = []
          inNumberedList = false
        }
        processedLines.push(line)
      }
    }

    // Close any remaining lists
    if (inBulletList) {
      processedLines.push(`<ul class="list-disc pl-6 space-y-1">${listItems.join('')}</ul>`)
    } else if (inNumberedList) {
      processedLines.push(`<ol class="list-decimal pl-6 space-y-1">${listItems.join('')}</ol>`)
    }

    html = processedLines.join('\n')

    // Line breaks
    html = html.replace(/\n/g, "<br>")
    const clean = sanitizeHtml(html, {
      allowedTags: [
        'b', 'i', 'em', 'strong', 'del', 'code', 'br', 'p', 'ul', 'ol', 'li'
      ],
      allowedAttributes: {
        'code': ['class'],
        'p': ['class'],
        'ul': ['class'],
        'ol': ['class'],
        'li': ['class']
      },
      allowedClasses: {
        'code': ['text-sm', 'font-mono', 'text-black', 'bg-gray-100', 'px-1', 'py-0.5', 'rounded'],
        'ul': ['list-disc', 'pl-6', 'space-y-1', 'prose'],
        'ol': ['list-decimal', 'pl-6', 'space-y-1', 'prose'],
        'li': ['prose'],
        'p': ['prose']
      }
    });

    return clean;
  }