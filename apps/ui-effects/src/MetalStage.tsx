import { MetalBadge, MetalFx, MetalText } from 'metal-fx'
import { useState } from 'react'
import { Chip, Stage } from './ui.tsx'

const PRESETS = ['chromatic', 'silver', 'gold'] as const

export function MetalStage() {
  const [preset, setPreset] = useState<(typeof PRESETS)[number]>('chromatic')
  const [strength, setStrength] = useState(1)
  const [variant, setVariant] = useState<'button' | 'circle'>('button')
  const [paused, setPaused] = useState(false)

  return (
    <Stage
      blurb="A real-time WebGL liquid-metal ring around buttons and icons, plus metal type and badges."
      controls={
        <>
          <div>
            <p className="mb-1.5 text-[11px] text-[var(--muted)]">Preset</p>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((value) => (
                <Chip active={preset === value} key={value} onClick={() => setPreset(value)}>
                  {value}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-[11px] text-[var(--muted)]">Variant</p>
            <div className="flex gap-1.5">
              <Chip active={variant === 'button'} onClick={() => setVariant('button')}>
                button
              </Chip>
              <Chip active={variant === 'circle'} onClick={() => setVariant('circle')}>
                circle
              </Chip>
            </div>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-[11px] text-[var(--muted)]">
              Strength {strength.toFixed(2)}
            </span>
            <input
              className="range w-full"
              max={1}
              min={0.2}
              onChange={(event) => setStrength(Number(event.target.value))}
              step={0.05}
              type="range"
              value={strength}
            />
          </label>
          <Chip active={paused} onClick={() => setPaused((current) => !current)}>
            {paused ? 'Resume metal' : 'Pause shader'}
          </Chip>
        </>
      }
      docs="https://libraries.dev/metal.html"
      id="metal"
      index="04"
      pkg="metal-fx"
      title="Liquid metal"
    >
      <div className="flex flex-col items-center gap-6">
        <MetalText color="#E8E4DC" font="600 42px/1 Fraunces, Georgia, serif" glow>
          Pro
        </MetalText>
        <div className="flex items-center gap-4">
          <MetalFx
            innerShadow
            paused={paused}
            preset={preset}
            strength={strength}
            theme="dark"
            variant={variant}
          >
            {variant === 'button' ? (
              <button
                className="h-11 rounded-full border border-white/10 bg-[#14141c] px-6 text-[13px] font-medium"
                type="button"
              >
                Upgrade to Pro
              </button>
            ) : (
              <button
                aria-label="Send"
                className="grid size-11 place-items-center rounded-full border border-white/10 bg-[#14141c] text-lg"
                type="button"
              >
                ↑
              </button>
            )}
          </MetalFx>
          <MetalBadge>New</MetalBadge>
        </div>
      </div>
    </Stage>
  )
}
