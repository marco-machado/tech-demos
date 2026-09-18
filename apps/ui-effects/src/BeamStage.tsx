import { BorderBeam } from 'border-beam'
import { useState, type ReactNode } from 'react'
import { Chip, Stage } from './ui.tsx'

const SIZES = ['md', 'sm', 'line', 'pulse-inner', 'pulse-outside'] as const
const COLORS = ['colorful', 'mono', 'ocean', 'sunset'] as const

export function BeamStage() {
  const [size, setSize] = useState<(typeof SIZES)[number]>('md')
  const [color, setColor] = useState<(typeof COLORS)[number]>('colorful')
  const [strength, setStrength] = useState(1)
  const [active, setActive] = useState(true)

  return (
    <Stage
      blurb="A traveling or breathing glow that rides the border of any card, button, or input."
      controls={
        <>
          <Field label="Size">
            {SIZES.map((value) => (
              <Chip active={size === value} key={value} onClick={() => setSize(value)}>
                {value}
              </Chip>
            ))}
          </Field>
          <Field label="Color">
            {COLORS.map((value) => (
              <Chip active={color === value} key={value} onClick={() => setColor(value)}>
                {value}
              </Chip>
            ))}
          </Field>
          <label className="block">
            <span className="mb-1.5 block text-[11px] text-[var(--muted)]">
              Strength {strength.toFixed(2)}
            </span>
            <input
              className="range w-full"
              max={1}
              min={0.15}
              onChange={(event) => setStrength(Number(event.target.value))}
              step={0.05}
              type="range"
              value={strength}
            />
          </label>
          <Chip active={!active} onClick={() => setActive((current) => !current)}>
            {active ? 'Pause beam' : 'Resume beam'}
          </Chip>
        </>
      }
      docs="https://libraries.dev/beam.html"
      id="beam"
      index="01"
      pkg="border-beam"
      title="Border beam"
    >
      <BorderBeam
        active={active}
        borderRadius={24}
        colorVariant={color}
        size={size}
        strength={strength}
        theme="dark"
      >
        <article
          className="w-[min(100%,320px)] rounded-3xl border border-white/10 bg-[#16141c] p-6 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.9)]"
          style={{ borderRadius: 24 }}
        >
          <p className="mono text-[10px] tracking-[0.2em] text-[var(--lilac)] uppercase">
            Live card
          </p>
          <h3 className="display mt-2 text-[26px] leading-tight">Signal riding the edge</h3>
          <p className="mt-2 text-[13px] text-[var(--muted)]">
            Swap size and palette. Pulse types breathe; rotate types travel.
          </p>
        </article>
      </BorderBeam>
    </Stage>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] text-[var(--muted)]">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}
