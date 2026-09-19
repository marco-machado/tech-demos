import { MotionConfig } from 'motion/react'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { isPieceId, PIECES, type PieceId } from './catalog.ts'
import { Footer } from './shell/Footer.tsx'
import { Header } from './shell/Header.tsx'
import { Hero } from './shell/Hero.tsx'
import { Stage } from './shell/Stage.tsx'
import { DockStage } from './stages/DockStage.tsx'
import { ExpandableStage } from './stages/ExpandableStage.tsx'
import { FamilyStage } from './stages/FamilyStage.tsx'
import { ShiftStage } from './stages/ShiftStage.tsx'
import { TextureButtonStage } from './stages/TextureButtonStage.tsx'
import { TextureCardStage } from './stages/TextureCardStage.tsx'

const STAGES: Record<PieceId, () => ReactNode> = {
  shift: () => <ShiftStage />,
  'texture-button': () => <TextureButtonStage />,
  'texture-card': () => <TextureCardStage />,
  expandable: () => <ExpandableStage />,
  family: () => <FamilyStage />,
  dock: () => <DockStage />,
}

function readHash(): PieceId {
  const hash = window.location.hash.replace(/^#/, '')
  return isPieceId(hash) ? hash : PIECES[0].id
}

function isTypingTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)
}

export default function App() {
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
    <MotionConfig reducedMotion="user">
      <div className="min-h-full" id="top">
        <Header />
        <main className="mx-auto max-w-5xl px-5 pb-20 sm:px-6">
          <Hero />
          <Stage active={active} onChange={select}>
            {STAGES[active]()}
          </Stage>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}
