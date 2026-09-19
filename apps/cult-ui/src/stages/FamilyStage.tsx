import { useState } from 'react'
import { FamilyButton } from '../components/ui/family-button'

const GLAZES = [
  { id: 'ember', label: 'Ember', swatch: '#e8a45a' },
  { id: 'glaze', label: 'Glaze', swatch: '#7ec8c4' },
  { id: 'clay', label: 'Clay', swatch: '#c45c4a' },
] as const

export function FamilyStage() {
  const [glaze, setGlaze] = useState<(typeof GLAZES)[number]['id']>('ember')
  const active = GLAZES.find((item) => item.id === glaze) ?? GLAZES[0]

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="mono text-[11px] tracking-[0.18em] text-[var(--quiet)] uppercase">
        selected · {active.label}
      </p>
      <FamilyButton>
        <div className="flex w-[180px] flex-col items-center gap-3 px-3 pt-4">
          <p className="text-[11px] tracking-[0.16em] text-white/50 uppercase">Glaze</p>
          <div className="flex gap-2">
            {GLAZES.map((item) => (
              <button
                aria-label={item.label}
                className="size-8 rounded-full border border-white/20"
                key={item.id}
                onClick={() => setGlaze(item.id)}
                style={{
                  background: item.swatch,
                  outline: glaze === item.id ? '2px solid #f4efe6' : undefined,
                  outlineOffset: 2,
                }}
                type="button"
              />
            ))}
          </div>
          <p className="text-center text-[12px] text-white/70">{active.label} wash</p>
        </div>
      </FamilyButton>
    </div>
  )
}
