import { motion } from 'motion/react'
import { useState } from 'react'
import { FamilyButton } from '../components/ui/family-button'

const GLAZES = [
  { id: 'ember', label: 'Ember', hex: '#e8a45a' },
  { id: 'glaze', label: 'Glaze', hex: '#7ec8c4' },
  { id: 'clay', label: 'Clay', hex: '#c45c4a' },
  { id: 'ash', label: 'Ash', hex: '#a8a196' },
  { id: 'wisteria', label: 'Wisteria', hex: '#b7a2d6' },
  { id: 'moss', label: 'Moss', hex: '#8fae7a' },
] as const

type GlazeId = (typeof GLAZES)[number]['id']

export function FamilyStage() {
  const [glaze, setGlaze] = useState<GlazeId>('ember')
  const active = GLAZES.find((item) => item.id === glaze) ?? GLAZES[0]

  return (
    <div className="flex flex-col items-center gap-7">
      <motion.div
        animate={{ backgroundColor: active.hex }}
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.14] blur-3xl"
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
      <p className="mono flex items-center gap-2 text-[11px] tracking-[0.16em] text-quiet uppercase">
        <span
          className="size-2 rounded-full transition-colors duration-500"
          style={{ background: active.hex }}
        />
        selected · <span className="text-[var(--text)]">{active.label}</span>
      </p>

      <FamilyButton>
        <div className="flex w-[200px] flex-col items-center gap-3 px-4 pt-4">
          <p className="mono text-[10.5px] tracking-[0.16em] text-white/45 uppercase">Glaze</p>
          <div className="grid grid-cols-3 gap-2.5">
            {GLAZES.map((item) => {
              const selected = item.id === glaze
              return (
                <button
                  aria-label={item.label}
                  aria-pressed={selected}
                  className="relative grid size-8 place-items-center rounded-full"
                  key={item.id}
                  onClick={(event) => {
                    event.stopPropagation()
                    setGlaze(item.id)
                  }}
                  type="button"
                >
                  {selected ? (
                    <motion.span
                      className="absolute -inset-[3px] rounded-full border-[1.5px] border-paper/90"
                      layoutId="glaze-ring"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.45 }}
                    />
                  ) : null}
                  <span
                    className="size-7 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.5)] transition-transform duration-200 ease-out hover:scale-105 active:scale-95"
                    style={{ background: item.hex }}
                  />
                </button>
              )
            })}
          </div>
          <div className="mt-0.5 flex w-full items-center justify-between rounded-[10px] border border-white/[0.07] bg-black/30 px-3 py-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]">
            <span className="text-[13px] font-medium text-white/90">{active.label}</span>
            <span className="mono text-[10.5px] text-white/40 uppercase">{active.hex}</span>
          </div>
        </div>
      </FamilyButton>
    </div>
  )
}
