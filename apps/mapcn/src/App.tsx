import { MotionConfig } from 'motion/react'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { isPieceId, PIECES, type PieceId } from './catalog'
import { ThemeProvider } from './lib/theme'
import { ArcsScene } from './scenes/ArcsScene'
import { ControlsScene } from './scenes/ControlsScene'
import { PinsScene } from './scenes/PinsScene'
import { RouteScene } from './scenes/RouteScene'
import { TilesScene } from './scenes/TilesScene'
import { Footer } from './shell/Footer'
import { Header } from './shell/Header'
import { Hero } from './shell/Hero'
import { Stage } from './shell/Stage'

const STAGES: Record<PieceId, () => ReactNode> = {
  pins: () => <PinsScene />,
  route: () => <RouteScene />,
  controls: () => <ControlsScene />,
  tiles: () => <TilesScene />,
  arcs: () => <ArcsScene />,
}

function readHash(): PieceId {
  const hash = window.location.hash.replace(/^#/, '')
  return isPieceId(hash) ? hash : PIECES[0].id
}

function isTypingTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)
}

function Playground() {
  const [active, setActive] = useState<PieceId>(readHash)

  const select = useCallback((id: PieceId) => {
    setActive(id)
    window.history.replaceState(null, '', `#${id}`)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return
      const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
      if (!delta) return
      event.preventDefault()
      const index = PIECES.findIndex((piece) => piece.id === active)
      select(PIECES[(index + delta + PIECES.length) % PIECES.length].id)
    }
    const onHash = () => setActive(readHash())
    window.addEventListener('keydown', onKey)
    window.addEventListener('hashchange', onHash)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('hashchange', onHash)
    }
  }, [active, select])

  return (
    <div className="min-h-full" id="top">
      <Header />
      <main className="mx-auto max-w-6xl px-5 pb-20 sm:px-6">
        <Hero />
        <Stage active={active} onChange={select}>
          {STAGES[active]()}
        </Stage>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <Playground />
      </ThemeProvider>
    </MotionConfig>
  )
}
