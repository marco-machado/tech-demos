import {
  ArrowLeft,
  ArrowRight,
  Keyboard,
  MousePointer2,
  MousePointerClick,
  Move,
  type LucideIcon,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { PIECES, type InteractionMode, type Piece, type PieceId } from '../catalog.ts'
import { TextureButton } from '../components/ui/texture-button'

const EASE_OUT = [0.16, 1, 0.3, 1] as const
const EASE_IN = [0.4, 0, 1, 1] as const

const MODE_ICON: Record<InteractionMode, LucideIcon> = {
  hover: MousePointer2,
  click: MousePointerClick,
  type: Keyboard,
  sweep: Move,
}

interface StageProps {
  active: PieceId
  onChange: (id: PieceId) => void
  children: ReactNode
}

export function Stage({ active, onChange, children }: StageProps) {
  const index = PIECES.findIndex((piece) => piece.id === active)
  const piece: Piece = PIECES[index] ?? PIECES[0]
  const step = (delta: number) =>
    onChange(PIECES[(index + delta + PIECES.length) % PIECES.length].id)

  return (
    <section
      aria-labelledby="stage-title"
      className="rounded-[24px] border border-line bg-[var(--surface)] p-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_30px_90px_-40px_rgba(0,0,0,0.9)]"
    >
      <div className="flex items-center justify-between gap-3 px-1 pt-1 pb-2">
        <PieceNav active={active} onChange={onChange} />
        <p className="mono hidden shrink-0 pr-2 text-[11px] text-faint sm:block">
          <span className="text-quiet">0{index + 1}</span> / 0{PIECES.length}
        </p>
      </div>

      <div className="overflow-hidden rounded-[16px] border border-line bg-[var(--bg)]">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 border-b border-line px-5 py-5 sm:px-6">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } }}
              className="min-w-0"
              exit={{ opacity: 0, y: -6, transition: { duration: 0.12, ease: EASE_IN } }}
              initial={{ opacity: 0, y: 6 }}
              key={piece.id}
            >
              <p className="mono text-[11px] tracking-[0.18em] text-glaze uppercase">
                0{index + 1} · {piece.label}
              </p>
              <h2
                className="display mt-1.5 text-[24px] leading-[1.15] tracking-[-0.01em] text-balance sm:text-[27px]"
                id="stage-title"
              >
                {piece.title}
              </h2>
            </motion.div>
          </AnimatePresence>
          <HintPill hint={piece.hint} mode={piece.mode} />
        </div>

        <div className="relative isolate flex min-h-[540px] items-center justify-center overflow-hidden px-4 py-8 sm:px-8">
          <div className="spotlight pointer-events-none absolute inset-0" />
          <div className="dots pointer-events-none absolute inset-0" />
          <div className="grain pointer-events-none absolute inset-0 opacity-[0.06]" />
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE_OUT } }}
              className="relative z-10 flex w-full items-center justify-center"
              exit={{ opacity: 0, y: -8, transition: { duration: 0.14, ease: EASE_IN } }}
              initial={{ opacity: 0, y: 12 }}
              key={active}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-3 sm:px-6">
          <p className="mono min-w-0 truncate text-[11px] text-faint">
            <span className="text-quiet">{piece.source}</span>
            <span className="mx-2">·</span>
            {piece.built}
            <span className="mx-2 hidden sm:inline">·</span>
            <span className="hidden sm:inline">MIT</span>
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <span className="mono mr-1 hidden text-[10.5px] text-faint md:inline">← → keys</span>
            <TextureButton
              aria-label="Previous piece"
              onClick={() => step(-1)}
              size="icon"
              variant="icon"
            >
              <ArrowLeft className="size-7 p-1.5 text-quiet" strokeWidth={1.75} />
            </TextureButton>
            <TextureButton
              aria-label="Next piece"
              onClick={() => step(1)}
              size="icon"
              variant="icon"
            >
              <ArrowRight className="size-7 p-1.5 text-quiet" strokeWidth={1.75} />
            </TextureButton>
          </div>
        </div>
      </div>
    </section>
  )
}

function PieceNav({ active, onChange }: Omit<StageProps, 'children'>) {
  return (
    <nav
      aria-label="Pieces"
      className="no-scrollbar -mx-1 flex min-w-0 gap-0.5 overflow-x-auto rounded-[16px] bg-white/[0.03] p-1"
    >
      {PIECES.map((piece, i) => {
        const selected = piece.id === active
        return (
          <button
            aria-current={selected ? 'true' : undefined}
            className={`relative shrink-0 rounded-[12px] px-3 py-1.5 text-[13px] whitespace-nowrap transition-colors duration-150 ease-out ${
              selected ? 'text-[var(--text)]' : 'text-quiet hover:text-[var(--text)]'
            }`}
            key={piece.id}
            onClick={() => onChange(piece.id)}
            type="button"
          >
            {selected ? (
              <motion.span
                className="absolute inset-0 rounded-[12px] bg-white/[0.07] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.4)]"
                layoutId="piece-indicator"
                transition={{ type: 'spring', bounce: 0.18, duration: 0.5 }}
              />
            ) : null}
            <span className="relative z-10 flex items-center gap-2">
              <span
                className={`mono text-[10px] tabular-nums transition-colors duration-150 ${
                  selected ? 'text-ember' : 'text-faint'
                }`}
              >
                0{i + 1}
              </span>
              {piece.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

function HintPill({ hint, mode }: { hint: string; mode: InteractionMode }) {
  const Icon = MODE_ICON[mode]
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.p
        animate={{ opacity: 1, transition: { duration: 0.3, ease: EASE_OUT } }}
        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-white/[0.03] py-1.5 pr-3.5 pl-2.5 text-[12.5px] text-quiet"
        exit={{ opacity: 0, transition: { duration: 0.12, ease: EASE_IN } }}
        initial={{ opacity: 0 }}
        key={`${mode}-${hint}`}
      >
        <Icon className="size-3.5 text-ember" strokeWidth={2} />
        {hint}
      </motion.p>
    </AnimatePresence>
  )
}
