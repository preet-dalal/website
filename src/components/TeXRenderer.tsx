import { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface Props {
  content: string
  images: Record<string, string>
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (char) => map[char] || char)
}

export default function TeXRenderer({ content, images }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const rendered = parseAndRender(content, images)
    containerRef.current.innerHTML = rendered

    const mathElements = containerRef.current.querySelectorAll('[data-math]')
    mathElements.forEach((elem) => {
      const tex = elem.getAttribute('data-math')
      const isDisplay = elem.getAttribute('data-display') === 'true'

      try {
        katex.render(tex || '', elem as HTMLElement, {
          displayMode: isDisplay,
          throwOnError: false,
        })
      } catch (err) {
        console.error('KaTeX error:', err)
        elem.textContent = tex || ''
      }
    })
  }, [content, images])

  return <div ref={containerRef} className="space-y-4" />
}

function parseAndRender(texContent: string, images: Record<string, string>): string {
  let html = texContent
  const mathBlocks: { [key: string]: string } = {}
  let mathCounter = 0

  // PHASE 1: Extract and preserve math
  html = html.replace(/\\\[([\s\S]*?)\\\]/g, (match, math) => {
    const key = `__MATH_DISPLAY_${mathCounter}__`
    mathBlocks[key] = `<div class="my-6 overflow-x-auto" data-math="${math.trim()}" data-display="true"></div>`
    mathCounter++
    return key
  })

  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
    const key = `__MATH_DISPLAY_${mathCounter}__`
    mathBlocks[key] = `<div class="my-6 overflow-x-auto" data-math="${math.trim()}" data-display="true"></div>`
    mathCounter++
    return key
  })

  html = html.replace(/\\begin\{equation\*?\}([\s\S]*?)\\end\{equation\*?\}/g, (match, math) => {
    const key = `__MATH_DISPLAY_${mathCounter}__`
    mathBlocks[key] = `<div class="my-6 overflow-x-auto" data-math="${math.trim()}" data-display="true"></div>`
    mathCounter++
    return key
  })

  html = html.replace(/\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, (match, math) => {
    const key = `__MATH_DISPLAY_${mathCounter}__`
    mathBlocks[key] = `<div class="my-6 overflow-x-auto" data-math="${math.trim()}" data-display="true"></div>`
    mathCounter++
    return key
  })

  html = html.replace(/\\begin\{gather\*?\}([\s\S]*?)\\end\{gather\*?\}/g, (match, math) => {
    const key = `__MATH_DISPLAY_${mathCounter}__`
    mathBlocks[key] = `<div class="my-6 overflow-x-auto" data-math="${math.trim()}" data-display="true"></div>`
    mathCounter++
    return key
  })

  html = html.replace(/\\begin\{eqnarray\*?\}([\s\S]*?)\\end\{eqnarray\*?\}/g, (match, math) => {
    const key = `__MATH_DISPLAY_${mathCounter}__`
    mathBlocks[key] = `<div class="my-6 overflow-x-auto" data-math="${math.trim()}" data-display="true"></div>`
    mathCounter++
    return key
  })

  html = html.replace(/\\begin\{multline\*?\}([\s\S]*?)\\end\{multline\*?\}/g, (match, math) => {
    const key = `__MATH_DISPLAY_${mathCounter}__`
    mathBlocks[key] = `<div class="my-6 overflow-x-auto" data-math="${math.trim()}" data-display="true"></div>`
    mathCounter++
    return key
  })

  html = html.replace(/\$([^$]+?)\$/g, (match, math) => {
    const key = `__MATH_INLINE_${mathCounter}__`
    mathBlocks[key] = `<span data-math="${math.trim()}" data-display="false"></span>`
    mathCounter++
    return key
  })

  // PHASE 2: Remove ALL document structure
  html = html.replace(/\\documentclass\{[^}]*\}/g, '')
  html = html.replace(/\\usepackage(?:\[[^\]]*\])?\{[^}]*\}/g, '')
  html = html.replace(/\\begin\{document\}/g, '')
  html = html.replace(/\\end\{document\}/g, '')
  html = html.replace(/\\begin\{abstract\}[\s\S]*?\\end\{abstract\}/g, '')
  html = html.replace(/\\maketitle/g, '')
  html = html.replace(/\\begin\{table\*?\}[\s\S]*?\\end\{table\*?\}/g, '')
  html = html.replace(/\\begin\{tabular\}[^}]*\}[\s\S]*?\\end\{tabular\}/g, '')
  html = html.replace(/\\geometry\{[^}]*\}/g, '')
  html = html.replace(/\\pagestyle\{[^}]*\}/g, '')
  html = html.replace(/\\setcounter\{[^}]*\}\{[^}]*\}/g, '')
  html = html.replace(/\\renewcommand\{[^}]*\}\{[^}]*\}/g, '')

  // Remove comments
  html = html.replace(/%[^\n]*/g, '')
  html = html.replace(/^[^a-zA-Z0-9]*\n/gm, '')

  // PHASE 3: Extract title/author/date
  const titleMatch = html.match(/\\title\{([^}]+)\}/)
  const authorMatch = html.match(/\\author\{([^}]+)\}/)
  const dateMatch = html.match(/\\date\{([^}]+)\}/)

  let titleHtml = ''
  if (titleMatch) {
    titleHtml += `<h1 class="text-4xl font-bold mb-3 text-white">${escapeHtml(titleMatch[1])}</h1>\n`
  }
  if (authorMatch) {
    titleHtml += `<p class="text-base text-gray-400 mb-1">${escapeHtml(authorMatch[1])}</p>\n`
  }
  if (dateMatch) {
    titleHtml += `<p class="text-sm text-gray-500 mb-6">${escapeHtml(dateMatch[1])}</p>\n`
  }

  html = html.replace(/\\title\{[^}]*\}/g, '')
  html = html.replace(/\\author\{[^}]*\}/g, '')
  html = html.replace(/\\date\{[^}]*\}/g, '')
  html = html.replace(/\\today/g, '')

  // PHASE 4: Convert structure
  html = html.replace(/\\section\*?\{([^}]+)\}/g, '<h2 class="text-3xl font-bold mt-10 mb-5 text-white border-b border-orange-500/50 pb-2">$1</h2>')
  html = html.replace(/\\subsection\*?\{([^}]+)\}/g, '<h3 class="text-2xl font-semibold mt-8 mb-4 text-gray-100">$1</h3>')
  html = html.replace(/\\subsubsection\*?\{([^}]+)\}/g, '<h4 class="text-xl font-semibold mt-6 mb-3 text-gray-200">$1</h4>')

  // PHASE 5: Text formatting
  html = html.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
  html = html.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
  html = html.replace(/\\texttt\{([^}]+)\}/g, '<code>$1</code>')
  html = html.replace(/\\emph\{([^}]+)\}/g, '<em>$1</em>')
  html = html.replace(/\\textsl\{([^}]+)\}/g, '<em>$1</em>')
  html = html.replace(/\\textsc\{([^}]+)\}/g, '<span class="uppercase">$1</span>')
  html = html.replace(/\\textrm\{([^}]+)\}/g, '$1')
  html = html.replace(/\\textsf\{([^}]+)\}/g, '$1')
  html = html.replace(/\\texorpdfstring\{([^}]*)\}\{([^}]*)\}/g, '$2')

  // Handle images
  html = html.replace(/\\includegraphics(?:\s*\[[^\]]*\])?\s*\{([^}]+)\}/g, (match, imagePath) => {
    let fileName = imagePath.split('/').pop() || imagePath
    fileName = fileName.replace(/\s+/g, '')
    
    for (const [key, url] of Object.entries(images)) {
      if (key.toLowerCase() === fileName.toLowerCase() || key.includes(fileName)) {
        return `<img src="${url}" alt="${fileName}" class="max-w-full h-auto rounded-lg my-4" loading="lazy" />`
      }
    }
    return ''
  })

  // Lists
  html = html.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (match, items) => {
    const itemList = items.match(/\\item\s+([^\n]*?)(?=\\item|\\end)/g) || []
    const listItems = itemList
      .map((item: string) => {
        let text = item.replace(/\\item\s+/, '').trim()
        text = text.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
        text = text.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
        return `<li>• ${text}</li>`
      })
      .join('')
    return `<ul>${listItems}</ul>`
  })

  html = html.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (match, items) => {
    const itemList = items.match(/\\item\s+([^\n]*?)(?=\\item|\\end)/g) || []
    const listItems = itemList
      .map((item: string, idx: number) => {
        let text = item.replace(/\\item\s+/, '').trim()
        text = text.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
        text = text.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
        return `<li>${idx + 1}. ${text}</li>`
      })
      .join('')
    return `<ol>${listItems}</ol>`
  })

  // AGGRESSIVE: Remove all remaining LaTeX
  html = html.replace(/\\[a-zA-Z]+(?:\{[^}]*\})?/g, '')
  html = html.replace(/\\[^a-zA-Z]/g, '')
  html = html.replace(/\{([^}]*)\}/g, '$1')
  html = html.trim()

  // Create paragraphs from line breaks
  const paragraphs = html
    .split(/\n\n+/)
    .map((para) => {
      para = para.trim()
      if (!para) return ''
      if (/^</.test(para)) return para
      const escaped = escapeHtml(para)
      return `<p class="mb-4 leading-relaxed text-gray-200">${escaped}</p>`
    })
    .filter((p) => p.length > 0)
    .join('')

  // Restore math blocks
  let result = titleHtml + paragraphs
  for (const [key, value] of Object.entries(mathBlocks)) {
    result = result.replace(new RegExp(escapeHtml(key), 'g'), value)
  }

  return result
}