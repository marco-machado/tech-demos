import { useEffect, useId, useState } from 'react'

let mermaidReady: Promise<typeof import('mermaid').default> | null = null

function loadMermaid() {
  mermaidReady ??= import('mermaid').then(({ default: mermaid }) => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      themeVariables: {
        background: 'transparent',
        fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
        fontSize: '15px',
        primaryColor: '#f3eee4',
        primaryTextColor: '#1b1712',
        primaryBorderColor: '#c94b2a',
        secondaryColor: '#e8e0d2',
        tertiaryColor: '#fffdf8',
        lineColor: '#6d6458',
        textColor: '#1b1712',
        actorBkg: '#fffdf8',
        actorBorder: '#1b1712',
        actorTextColor: '#1b1712',
        actorLineColor: '#6d6458',
        signalColor: '#c94b2a',
        signalTextColor: '#1b1712',
        labelBoxBkgColor: '#f3eee4',
        labelBoxBorderColor: '#c94b2a',
        labelTextColor: '#1b1712',
        noteBkgColor: '#e8e0d2',
        noteTextColor: '#1b1712',
        activationBkgColor: '#e8d5b0',
        sequenceNumberColor: '#fffdf8',
      },
    })
    return mermaid
  })
  return mermaidReady
}

export function MermaidPane({ chart }: { chart: string }) {
  const rawId = useId().replaceAll(':', '')
  const [svg, setSvg] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const renderId = `showme-${rawId}`
    loadMermaid()
      .then((mermaid) => mermaid.render(renderId, chart))
      .then(({ svg: next }) => {
        if (cancelled) return
        setError(null)
        setSvg(next)
      })
      .catch((cause: unknown) => {
        if (cancelled) return
        setError(cause instanceof Error ? cause.message : 'Mermaid failed to render')
      })
    return () => {
      cancelled = true
    }
  }, [chart, rawId])

  if (error) {
    return <p className="text-[13px] text-[var(--removed)]">{error}</p>
  }

  if (!svg) {
    return <p className="text-[13px] text-[var(--muted)]">Drawing sequence…</p>
  }

  return (
    <div
      className="mermaid-stage"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
