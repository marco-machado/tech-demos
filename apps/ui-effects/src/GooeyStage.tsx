import { Liquid } from 'liquid-gooey'
import { useState } from 'react'
import { Chip, Stage } from './ui.tsx'

export function GooeyStage() {
  const [open, setOpen] = useState(true)
  const [blur, setBlur] = useState(10)

  return (
    <Stage
      blurb="Touching pieces merge like goo. The silhouette filters; your live DOM stays crisp."
      controls={
        <>
          <Chip active={open} onClick={() => setOpen((current) => !current)}>
            {open ? 'Fold menu' : 'Split menu'}
          </Chip>
          <label className="block">
            <span className="mb-1.5 block text-[11px] text-[var(--muted)]">
              Blur {blur}px — raise it to bridge farther
            </span>
            <input
              className="range w-full"
              max={18}
              min={4}
              onChange={(event) => setBlur(Number(event.target.value))}
              step={1}
              type="range"
              value={blur}
            />
          </label>
          <p className="text-[12px] leading-relaxed text-[var(--muted)]">
            Click the plus, or use the fold control. Neighbours melt into one mass, then split
            with a bounce.
          </p>
        </>
      }
      docs="https://libraries.dev/gooey.html"
      id="gooey"
      index="03"
      pkg="liquid-gooey"
      title="Gooey"
    >
      <Liquid
        blur={blur}
        className="relative h-[230px] w-[230px]"
        contrast={20}
        fill="var(--goo)"
        filterPadding={32}
        shadow="0 10px 28px rgba(0,0,0,.35)"
      >
        <Liquid.Item delay={20} transition="bouncy" x={open ? -58 : 0} y={open ? -40 : 0}>
          <button aria-label="Compose" className="goo-btn" type="button">
            ⌘
          </button>
        </Liquid.Item>
        <Liquid.Item delay={40} transition="bouncy" x={0} y={open ? -72 : 0}>
          <button aria-label="Spark" className="goo-btn" type="button">
            ✦
          </button>
        </Liquid.Item>
        <Liquid.Item delay={60} transition="bouncy" x={open ? 58 : 0} y={open ? -40 : 0}>
          <button aria-label="Layers" className="goo-btn" type="button">
            ▦
          </button>
        </Liquid.Item>
        <Liquid.Item>
          <button
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="goo-btn goo-plus"
            onClick={() => setOpen((current) => !current)}
            type="button"
          >
            {open ? '×' : '+'}
          </button>
        </Liquid.Item>
      </Liquid>
    </Stage>
  )
}
