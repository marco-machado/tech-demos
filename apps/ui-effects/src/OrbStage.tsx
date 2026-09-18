import { useState } from 'react'
import { ThinkingOrb } from 'thinking-orbs'
import { Chip, Stage } from './ui.tsx'

const STATES = [
  'working',
  'searching',
  'solving',
  'listening',
  'connecting',
  'weaving',
  'composing',
  'breathing',
  'shaping',
] as const

export function OrbStage() {
  const [state, setState] = useState<(typeof STATES)[number]>('searching')
  const [size, setSize] = useState<20 | 64>(64)
  const [speed, setSpeed] = useState(1)
  const [paused, setPaused] = useState(false)

  return (
    <Stage
      blurb="Nine hand-tuned thought-orb states for AI waiting rooms — canvas dots, no WebGL."
      controls={
        <>
          <div>
            <p className="mb-1.5 text-[11px] text-[var(--muted)]">State</p>
            <div className="flex flex-wrap gap-1.5">
              {STATES.map((value) => (
                <Chip active={state === value} key={value} onClick={() => setState(value)}>
                  {value}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-[11px] text-[var(--muted)]">Size</p>
            <div className="flex gap-1.5">
              <Chip active={size === 64} onClick={() => setSize(64)}>
                64 avatar
              </Chip>
              <Chip active={size === 20} onClick={() => setSize(20)}>
                20 inline
              </Chip>
            </div>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-[11px] text-[var(--muted)]">
              Speed {speed.toFixed(1)}×
            </span>
            <input
              className="range w-full"
              max={2}
              min={0.4}
              onChange={(event) => setSpeed(Number(event.target.value))}
              step={0.1}
              type="range"
              value={speed}
            />
          </label>
          <Chip active={paused} onClick={() => setPaused((current) => !current)}>
            {paused ? 'Resume orb' : 'Pause orb'}
          </Chip>
        </>
      }
      docs="https://libraries.dev/orbs.html"
      id="orbs"
      index="02"
      pkg="thinking-orbs"
      title="Thinking orbs"
    >
      <div className="flex w-[min(100%,340px)] items-center gap-4 rounded-3xl border border-white/8 bg-[#14141c] px-5 py-4">
        <ThinkingOrb paused={paused} size={size} speed={speed} state={state} theme="dark" />
        <div className="min-w-0">
          <p className="text-[13px] font-medium">Atelier agent</p>
          <p className="truncate text-[12px] text-[var(--muted)]">
            {paused ? 'Paused on this frame' : `Currently ${state}…`}
          </p>
        </div>
      </div>
    </Stage>
  )
}
