import { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface Props {
  content: string
  images: Record<string, string>
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

  // Remove document structure
  html = html.replace(/\\documentclass\{[^}]*\}/g, '')
  html = html.replace(/\\usepackage\{[^}]*\}/g, '')
  html = html.replace(/\\geometry\{[^}]*\}/g, '')
  html = html.replace(/\\maketitle/g, '')
  html = html.replace(/\\date\{[^}]*\}/g, '')
  html = html.replace(/\\author\{[^}]*\}/g, '')
  html = html.replace(/\\begin\{abstract\}[\s\S]*?\\end\{abstract\}/g, '')

  // Handle sections
  html = html.replace(/\\section\*?\{([^}]+)\}/g, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
  html = html.replace(/\\subsection\*?\{([^}]+)\}/g, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
  html = html.replace(/\\subsubsection\*?\{([^}]+)\}/g, '<h4 class="text-lg font-semibold mt-4 mb-2">$1</h4>')

  // Handle text formatting
  html = html.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
  html = html.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
  html = html.replace(/\\texttt\{([^}]+)\}/g, '<code class="bg-cosmic-800 px-2 py-1 rounded text-sm">$1</code>')
  html = html.replace(/\\texorpdfstring\{([^}]*)\}\{([^}]*)\}/g, '$1')

  // Handle display math:  \[ ...  \] and $$ ... $$
  html = html.replace(/\\\[([\s\S]*?)\\\]/g, '<div data-math="$1" data-display="true"></div>')
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, '<div data-math="$1" data-display="true"></div>')

  // Handle inline math: $ ... $ (avoid matching $$)
  html = html.replace(/(?<!\$)\$(?!\$)((?:(?!\$).)*?)\$/g, '<span data-math="$1" data-display="false"></span>')

  // Handle equation and align environments
  html = html.replace(/\\begin\{equation\*?\}([\s\S]*?)\\end\{equation\*?\}/g, '<div data-math="$1" data-display="true"></div>')
  html = html.replace(/\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, '<div data-math="$1" data-display="true"></div>')
  html = html.replace(/\\begin\{eqnarray\*?\}([\s\S]*?)\\end\{eqnarray\*?\}/g, '<div data-math="$1" data-display="true"></div>')
  html = html.replace(/\\begin\{gather\*?\}([\s\S]*?)\\end\{gather\*?\}/g, '<div data-math="$1" data-display="true"></div>')

  // Handle itemize and enumerate
  html = html.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (match, items) => {
    const itemList = items.match(/\\item\s+([^\n]*?)(?=\\item|$)/g) || []
    const listItems = itemList
      .map((item:  string) => {
        let text = item.replace(/\\item\s+/, '').trim()
        // Clean up LaTeX commands in list items
        text = text. replace(/\$([^$]*)\$/g, '<span data-math="$1" data-display="false"></span>')
        text = text.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
        text = text.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
        return `<li>${text}</li>`
      })
      .join('')
    return `<ul class="list-disc list-inside space-y-2 ml-4">${listItems}</ul>`
  })

  html = html.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (match, items) => {
    const itemList = items.match(/\\item\s+([^\n]*?)(?=\\item|$)/g) || []
    const listItems = itemList
      .map((item: string) => {
        let text = item.replace(/\\item\s+/, '').trim()
        text = text.replace(/\$([^$]*)\$/g, '<span data-math="$1" data-display="false"></span>')
        text = text.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
        return `<li>${text}</li>`
      })
      .join('')
    return `<ol class="list-decimal list-inside space-y-2 ml-4">${listItems}</ol>`
  })

  // Handle figures and subfigures
  html = html. replace(/\\begin\{figure\*?\}[\s\S]*?\\caption\{([^}]*)\}[\s\S]*?\\end\{figure\*?\}/g, (match, caption) => {
    return `<figure class="my-6"><figcaption class="text-sm text-gray-400 italic mt-2">${caption}</figcaption></figure>`
  })

  // Handle image includes
  html = html.replace(/\\includegraphics(?:\s*\[[^\]]*\])?\s*\{([^}]+)\}/g, (match, imagePath) => {
    let fileName = imagePath.split('/').pop() || imagePath
    fileName = fileName.replace(/\s+/g, '')
    
    for (const [key, url] of Object.entries(images)) {
      if (key. toLowerCase() === fileName.toLowerCase() || key.includes(fileName)) {
        return `<img src="${url}" alt="${fileName}" class="max-w-full h-auto rounded-lg my-4" loading="lazy" />`
      }
    }
    return ''
  })

  // Handle footnotes
  html = html.replace(/\\footnote\{([^}]*)\}/g, '<sup class="text-xs text-orange-400">[*]</sup>')

  // Handle citations
  html = html.replace(/\\cite\{([^}]*)\}/g, '<sup class="text-xs text-orange-400">[citation]</sup>')
  html = html.replace(/\\citep\{([^}]*)\}/g, '<sup class="text-xs text-orange-400">[citation]</sup>')
  html = html.replace(/\\citet\{([^}]*)\}/g, '<sup class="text-xs text-orange-400">[citation]</sup>')

  // Handle references
  html = html.replace(/\\ref\{([^}]*)\}/g, '<a href="#$1" class="text-orange-500 hover:underline">Eq. $1</a>')
  html = html.replace(/\\eqref\{([^}]*)\}/g, '<a href="#$1" class="text-orange-500 hover:underline">($1)</a>')

  // Handle line breaks
  html = html.replace(/\\\\/g, '<br />')
  html = html.replace(/\\newline/g, '<br />')

  // Clean up extra whitespace and paragraphs
  html = html
    .split('\n\n+')
    .map((para) => {
      para = para.trim()
      if (! para) return ''
      // Don't wrap block elements
      if (/^<(h[1-6]|div|ul|ol|figure|img|table|blockquote)/. test(para)) {
        return para
      }
      return `<p class="leading-relaxed">${para}</p>`
    })
    .join('')

  // Remove orphaned tags
  html = html.replace(/<div data-math=""\s*data-display="[^"]*"><\/div>/g, '')
  html = html.replace(/<span data-math=""\s*data-display="false"><\/span>/g, '')

  // Wrap tables
  html = html.replace(/(<table[^>]*>[\s\S]*?<\/table>)/g, '<div class="overflow-x-auto my-4">$1</div>')

  return html
}