import { useState, type ReactNode } from 'react'
import { PIECES, type PieceId } from './catalog.ts'
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

function KilnMark() {
  return (
    <svg aria-hidden="true" className="size-8" fill="none" viewBox="0 0 32 32">
      <rect fill="#161412" height="32" rx="8" width="32" />
      <path
        d="M8 22c2-7 5.5-12 8-12s6 5 8 12"
        stroke="#e8a45a"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <circle cx="16" cy="22" fill="#7ec8c4" r="2.2" />
    </svg>
  )
}

export default function App() {
  const [active, setActive] = useState<PieceId>('shift')
  const piece = PIECES.find((item) => item.id === active) ?? PIECES[0]
  const index = PIECES.findIndex((item) => item.id === active)

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <a className="flex items-center gap-2.5" href="#top">
            <KilnMark />
            <span>
              <span className="block text-[13px] leading-none font-medium">Kiln</span>
              <span className="mono text-[10px] tracking-wide text-[var(--quiet)]">
                cult-ui
              </span>
            </span>
          </a>
          <nav aria-label="Pieces" className="flex flex-wrap gap-1">
            {PIECES.map((item) => (
              <button
                className={`rounded-full px-2.5 py-1 text-[12px] ${
                  item.id === active
                    ? 'bg-white/10 text-[var(--text)]'
                    : 'text-[var(--quiet)] hover:bg-white/5 hover:text-[var(--text)]'
                }`}
                key={item.id}
                onClick={() => setActive(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-24" id="top">
        <section className="py-14 sm:py-20">
          <p className="mono text-[11px] tracking-[0.24em] text-[var(--ember)] uppercase">
            Six MIT pieces · one dark stage
          </p>
          <h1 className="display mt-3 max-w-3xl text-[clamp(2.4rem,7vw,4.6rem)] leading-[0.95] font-medium tracking-tight">
            Cult UI, fired in a kiln.
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-[var(--quiet)]">
            Free, copy-paste Cult components — Shift Card, texture button and
            card, Expandable, Family Button, Dock — running as owned source in
            this Bun gallery. Not Cult Pro.
          </p>
        </section>

        <section className="overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--card)]">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--line)] px-5 py-4">
            <div>
              <p className="mono text-[11px] tracking-[0.2em] text-[var(--glaze)] uppercase">
                0{index + 1} · {piece.label}
              </p>
              <h2 className="display mt-1 text-[28px] leading-none">{piece.blurb}</h2>
            </div>
            <p className="text-[13px] text-[var(--quiet)]">{piece.hint}</p>
          </div>
          <div className="relative grid min-h-[520px] place-items-center px-4 py-12">
            <div className="grain pointer-events-none absolute inset-0 opacity-[0.07]" />
            <div className="relative z-10">{STAGES[active]()}</div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--line)]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-[12px] text-[var(--quiet)]">
          <p>
            MIT registry pieces from{' '}
            <a
              className="text-[var(--text)] underline decoration-white/20 underline-offset-4 hover:decoration-[var(--ember)]"
              href="https://cult-ui.com"
              rel="noreferrer"
              target="_blank"
            >
              cult-ui.com
            </a>
            . Inbox source:{' '}
            <a
              className="text-[var(--text)] underline decoration-white/20 underline-offset-4 hover:decoration-[var(--ember)]"
              href="https://app.notion.com/37189ff326a1816db52fcacf29a21641"
              rel="noreferrer"
              target="_blank"
            >
              Notion
            </a>
            .
          </p>
          <span className="mono">apps/cult-ui</span>
        </div>
      </footer>
    </div>
  )
}
