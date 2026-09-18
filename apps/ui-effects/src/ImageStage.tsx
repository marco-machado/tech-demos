import { ImageGeneration, type ImageGenerationHandle } from 'img-fx'
import { useRef, useState } from 'react'
import { REVEAL_IMAGES } from './catalog.ts'
import { Chip, Stage } from './ui.tsx'

const PRESETS = ['pixels-organic', 'pixels-mechanic', 'sweep-gradient'] as const

export function ImageStage() {
  const ref = useRef<ImageGenerationHandle>(null)
  const [preset, setPreset] = useState<(typeof PRESETS)[number]>('pixels-organic')
  const [autoReveal, setAutoReveal] = useState(true)
  const [paused, setPaused] = useState(false)
  const [cycle, setCycle] = useState('idle')

  return (
    <Stage
      blurb="A WebGL mosaic loader that churns, then dissolves into a real image. Peer: three."
      controls={
        <>
          <div>
            <p className="mb-1.5 text-[11px] text-[var(--muted)]">Preset</p>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((value) => (
                <Chip active={preset === value} key={value} onClick={() => setPreset(value)}>
                  {value.replace('pixels-', '')}
                </Chip>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Chip
              active={autoReveal}
              onClick={() => setAutoReveal((current) => !current)}
            >
              {autoReveal ? 'Auto reveal on' : 'Auto reveal off'}
            </Chip>
            <Chip active={paused} onClick={() => setPaused((current) => !current)}>
              {paused ? 'Resume' : 'Pause'}
            </Chip>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Chip
              active={false}
              onClick={() => {
                const handle = ref.current
                if (!handle) return
                if (handle.isImageActive()) handle.triggerHide()
                else handle.triggerReveal({ hold: 'manual' })
              }}
            >
              Reveal / hide
            </Chip>
            <Chip active={false} onClick={() => ref.current?.triggerRegenerate()}>
              Regenerate
            </Chip>
          </div>
          <p className="mono text-[11px] text-[var(--muted)]">Phase · {cycle}</p>
        </>
      }
      docs="https://libraries.dev/image.html"
      id="image"
      index="05"
      pkg="img-fx"
      title="Image generation"
    >
      <ImageGeneration
        autoReveal={autoReveal}
        cardBg="#12121a"
        images={REVEAL_IMAGES}
        onCycle={(event) => setCycle(event.phase)}
        paused={paused}
        preset={preset}
        ref={ref}
        theme="dark"
      >
        <div
          className="h-[280px] w-[280px] rounded-[22px] border border-white/8"
          style={{ width: 280, height: 280, borderRadius: 22 }}
        />
      </ImageGeneration>
    </Stage>
  )
}
