import React, { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface Props {
  content: string
}

export default function LaTeXDocument({ content }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const rendered = convertLaTeXToHTML(content)
    containerRef.current.innerHTML = rendered

    // Render math after DOM update
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
  }, [content])

  return <div ref={containerRef} className="prose-tex space-y-4" />
}

function convertLaTeXToHTML(texContent: string): string {
  let html = texContent

  // Remove preamble and document wrapper
  html = html.replace(/\\documentclass\{[^}]*\}/g, '')
  html = html.replace(/\\usepackage(?:\[[^\]]*\])?\{[^}]*\}/g, '')
  html = html.replace(/\\geometry\{[^}]*\}/g, '')
  html = html.replace(/\\pagestyle\{[^}]*\}/g, '')
  html = html.replace(/\\setcounter\{[^}]*\}\{[^}]*\}/g, '')
  html = html.replace(/\\renewcommand\{[^}]*\}\{[^}]*\}/g, '')
  html = html.replace(/\\begin\{document\}/g, '')
  html = html.replace(/\\end\{document\}/g, '')
  
  // Remove abstract
  html = html.replace(/\\begin\{abstract\}[\s\S]*?\\end\{abstract\}/g, '')
  
  // Remove maketitle
  html = html.replace(/\\maketitle/g, '')

  // Handle title, author, date
  const titleMatch = html.match(/\\title\{([^}]+)\}/)
  const authorMatch = html.match(/\\author\{([^}]+)\}/)
  const dateMatch = html.match(/\\date\{([^}]+)\}/)
  
  let titleHtml = ''
  if (titleMatch) {
    titleHtml += `<h1 class="text-5xl font-bold mb-4 text-white">${titleMatch[1]}</h1>\n`
  }
  if (authorMatch) {
    titleHtml += `<p class="text-lg text-gray-400 mb-2">${authorMatch[1]}</p>\n`
  }
  if (dateMatch) {
    titleHtml += `<p class="text-sm text-gray-500 mb-8">${dateMatch[1]}</p>\n`
  }
  
  html = html.replace(/\\title\{([^}]+)\}/g, '')
  html = html.replace(/\\author\{([^}]+)\}/g, '')
  html = html.replace(/\\date\{([^}]+)\}/g, '')

  // Handle \\ command (must be before other replacements)
  html = html.replace(/\\\\/g, '<br />')
  html = html.replace(/\\newline/g, '<br />')

  // Handle display math environments FIRST (longest matches)
  html = html.replace(/\\\[([\s\S]*?)\\\]/g, '<div class="my-6 overflow-x-auto" data-math="$1" data-display="true"></div>')
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, '<div class="my-6 overflow-x-auto" data-math="$1" data-display="true"></div>')
  html = html.replace(/\\begin\{equation\*?\}([\s\S]*?)\\end\{equation\*?\}/g, '<div class="my-6 overflow-x-auto" data-math="$1" data-display="true"></div>')
  html = html.replace(/\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, '<div class="my-6 overflow-x-auto" data-math="$1" data-display="true"></div>')
  html = html.replace(/\\begin\{align\}([\s\S]*?)\\end\{align\}/g, '<div class="my-6 overflow-x-auto" data-math="$1" data-display="true"></div>')
  html = html.replace(/\\begin\{gather\*?\}([\s\S]*?)\\end\{gather\*?\}/g, '<div class="my-6 overflow-x-auto" data-math="$1" data-display="true"></div>')
  html = html.replace(/\\begin\{eqnarray\*?\}([\s\S]*?)\\end\{eqnarray\*?\}/g, '<div class="my-6 overflow-x-auto" data-math="$1" data-display="true"></div>')
  html = html.replace(/\\begin\{multline\*?\}([\s\S]*?)\\end\{multline\*?\}/g, '<div class="my-6 overflow-x-auto" data-math="$1" data-display="true"></div>')

  // Handle inline math: $ ... $ (must be after display math)
  html = html.replace(/(?<!\$)\$(?!\$)((?:(?!\$).)*?)\$/g, '<span data-math="$1" data-display="false"></span>')

  // Handle sections with proper styling
  html = html.replace(/\\section\*?\{([^}]+)\}/g, '<h2 class="text-4xl font-bold mt-12 mb-6 text-white border-b-2 border-orange-500 pb-3">$1</h2>')
  html = html.replace(/\\subsection\*?\{([^}]+)\}/g, '<h3 class="text-3xl font-semibold mt-10 mb-5 text-gray-100">$1</h3>')
  html = html.replace(/\\subsubsection\*?\{([^}]+)\}/g, '<h4 class="text-2xl font-semibold mt-8 mb-4 text-gray-200">$1</h4>')
  html = html.replace(/\\paragraph\*?\{([^}]+)\}/g, '<h5 class="text-xl font-semibold mt-6 mb-3 text-gray-300">$1</h5>')

  // Handle text formatting
  html = html.replace(/\\textbf\{([^}]+)\}/g, '<strong class="font-bold">$1</strong>')
  html = html.replace(/\\textit\{([^}]+)\}/g, '<em class="italic">$1</em>')
  html = html.replace(/\\texttt\{([^}]+)\}/g, '<code class="bg-cosmic-800 px-2 py-1 rounded text-sm font-mono">$1</code>')
  html = html.replace(/\\textsl\{([^}]+)\}/g, '<em class="italic">$1</em>')
  html = html.replace(/\\textsc\{([^}]+)\}/g, '<span class="uppercase tracking-wide text-sm">$1</span>')
  html = html.replace(/\\textrm\{([^}]+)\}/g, '<span class="font-serif">$1</span>')
  html = html.replace(/\\textsf\{([^}]+)\}/g, '<span class="font-sans">$1</span>')
  html = html.replace(/\\emph\{([^}]+)\}/g, '<em class="italic">$1</em>')
  html = html.replace(/\\textup\{([^}]+)\}/g, '<span class="not-italic">$1</span>')
  html = html.replace(/\\texorpdfstring\{([^}]*)\}\{([^}]*)\}/g, '$1')

  // Handle itemize
  html = html.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (match, items) => {
    const itemList = items.match(/\\item\s+([^\n]*?)(?=\\item|\\end)/g) || []
    const listItems = itemList
      .map((item: string) => {
        let text = item.replace(/\\item\s+/, '').trim()
        // Parse nested LaTeX in list items
        text = text.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
        text = text.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
        text = text.replace(/\$([^$]*)\$/g, '<span data-math="$1" data-display="false"></span>')
        return `<li class="ml-4 mb-2 flex items-start"><span class="mr-3">•</span><span>${text}</span></li>`
      })
      .join('')
    return `<ul class="my-4">${listItems}</ul>`
  })

  // Handle enumerate
  html = html.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (match, items) => {
    const itemList = items.match(/\\item\s+([^\n]*?)(?=\\item|\\end)/g) || []
    const listItems = itemList
      .map((item: string, idx: number) => {
        let text = item.replace(/\\item\s+/, '').trim()
        text = text.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
        text = text.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
        text = text.replace(/\$([^$]*)\$/g, '<span data-math="$1" data-display="false"></span>')
        return `<li class="ml-4 mb-2 flex items-start"><span class="mr-3">${idx + 1}.</span><span>${text}</span></li>`
      })
      .join('')
    return `<ol class="my-4">${listItems}</ol>`
  })

  // Handle footnotes
  html = html.replace(/\\footnote\{([^}]*)\}/g, '<sup class="text-xs text-orange-400">[*]</sup>')

  // Handle citations (must handle nested braces)
  html = html.replace(/\\cite\{([^}]*)\}/g, '<sup class="text-xs text-orange-400">[citation]</sup>')
  html = html.replace(/\\citep\{([^}]*)\}/g, '<sup class="text-xs text-orange-400">[citation]</sup>')
  html = html.replace(/\\citet\{([^}]*)\}/g, '<sup class="text-xs text-orange-400">[citation]</sup>')

  // Handle references
  html = html.replace(/\\ref\{([^}]*)\}/g, '<a href="#$1" class="text-orange-500 hover:underline">Ref. $1</a>')
  html = html.replace(/\\eqref\{([^}]*)\}/g, '<a href="#$1" class="text-orange-500 hover:underline">($1)</a>')
  html = html.replace(/\\label\{([^}]*)\}/g, '<a id="$1"></a>')

  // Handle figures
  html = html.replace(/\\begin\{figure\*?\}[\s\S]*?\\caption\{([^}]*)\}[\s\S]*?\\end\{figure\*?\}/g, 
    (match, caption) => `<figure class="my-8"><figcaption class="text-sm text-gray-400 italic mt-2">${caption}</figcaption></figure>`
  )
  html = html.replace(/\\includegraphics(?:\s*\[[^\]]*\])?\s*\{([^}]+)\}/g, 
    (match, path) => `<img src="/assets/${path.split('/').pop()}" alt="figure" class="max-w-full h-auto rounded-lg my-4" loading="lazy" />`
  )

  // Handle verbatim
  html = html.replace(/\\begin\{verbatim\}([\s\S]*?)\\end\{verbatim\}/g, 
    (match, code) => `<pre class="bg-cosmic-800 p-4 rounded overflow-x-auto text-sm my-4"><code>${code.trim()}</code></pre>`
  )

  // Handle quotes
  html = html.replace(/\\begin\{quote\}([\s\S]*?)\\end\{quote\}/g, 
    (match, quote) => `<blockquote class="border-l-4 border-orange-500 pl-4 italic my-4">${quote.trim()}</blockquote>`
  )

  // Handle miscellaneous commands
  html = html.replace(/\\noindent\s*/g, '')
  html = html.replace(/\\hspace\{[^}]*\}/g, '&nbsp;')
  html = html.replace(/\\vspace\{[^}]*\}/g, '<div class="my-2"></div>')
  html = html.replace(/~+/g, '&nbsp;')
  html = html.replace(/---/g, '—')
  html = html.replace(/--/g, '–')
  html = html.replace(/``/g, '"')
  html = html.replace(/''/g, '"')

  // Clean up LaTeX special characters that should just be text
  html = html.replace(/\\textbackslash/g, '\\')
  html = html.replace(/\\\$/g, '$')
  html = html.replace(/\\%/g, '%')
  html = html.replace(/\\\{/g, '{')
  html = html.replace(/\\\}/g, '}')
  html = html.replace(/\\_/g, '_')
  html = html.replace(/\\\^([a-zA-Z])/g, (match, char) => char.charCodeAt(0) < 97 ? char.toUpperCase() : char.toLowerCase())

  // Split into paragraphs and wrap
  const paragraphs = html
    .split(/\n\n+/)
    .map((para) => {
      para = para.trim()
      if (!para) return ''
      
      // Don't wrap block elements
      if (/^<(h[1-6]|ul|ol|div|figure|img|table|blockquote|pre|br)/.test(para)) {
        return para
      }
      
      // Handle multiple lines within a paragraph (join them)
      if (para.includes('\n')) {
        para = para.replace(/\n/g, ' ').replace(/\s+/g, ' ')
      }
      
      return `<p class="mb-4 leading-relaxed text-gray-200 first-letter:capitalize">${para}</p>`
    })
    .filter((p) => p.length > 0)
    .join('')

  // Clean up empty math elements
  html = paragraphs.replace(/<div[^>]*data-math=""[^>]*><\/div>/g, '')
  html = html.replace(/<span[^>]*data-math=""[^>]*><\/span>/g, '')
  
  // Remove stray LaTeX commands that weren't caught
  html = html.replace(/\\[a-zA-Z]+(\{[^}]*\})?/g, '')

  return titleHtml + html
}
