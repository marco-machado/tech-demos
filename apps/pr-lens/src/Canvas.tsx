import { useCallback, useEffect, useRef, useState, type PointerEvent, type WheelEvent } from 'react'
import type { RenderAtlas } from '@coldtea/pr-lens-renderer'
import {
  fitCamera,
  zoomAt,
  type Camera,
} from './camera.ts'
import { focusBoxes, frameBox, type StageTarget, type Step } from './focus.ts'

type Picture = {
  svg: string
  width: number
  height: number
  atlas: RenderAtlas
}

export function DiagramCanvas({
  picture,
  step,
  theme,
  target,
}: {
  picture: Picture
  step: Step | undefined
  theme: 'dark' | 'light'
  target: StageTarget
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const latest = useRef({ picture, step })
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, scale: 1 })
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{ x: number; y: number; camX: number; camY: number; scale: number } | null>(
    null,
  )

  useEffect(() => {
    latest.current = { picture, step }
  }, [picture, step])

  const fit = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const { picture: nextPicture, step: nextStep } = latest.current
    const size = { width: viewport.clientWidth, height: viewport.clientHeight }
    const box = frameBox(nextPicture.atlas, nextPicture, nextStep)
    setCamera(fitCamera(size, box, nextStep ? 72 : 48))
  }, [])

  useEffect(() => {
    fit()
  }, [fit, picture.svg, picture.width, picture.height, step?.id, target.lens, target.view, theme])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const observer = new ResizeObserver(() => fit())
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [fit])

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    const bounds = event.currentTarget.getBoundingClientRect()
    const point = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
    const factor = event.deltaY < 0 ? 1.08 : 1 / 1.08
    setCamera((current) => zoomAt(current, point, factor))
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      camX: camera.x,
      camY: camera.y,
      scale: camera.scale,
    }
    setDragging(true)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const origin = drag.current
    if (!origin) return
    setCamera({
      x: origin.camX + (event.clientX - origin.x),
      y: origin.camY + (event.clientY - origin.y),
      scale: origin.scale,
    })
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = null
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const spots = focusBoxes(picture.atlas, step)
  const markup = svgMarkup(picture.svg)

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={viewportRef}
        className={`absolute inset-0 overflow-hidden ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        aria-label="PR diagram canvas"
        role="application"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <div
          className="canvas-stage absolute left-0 top-0 will-change-transform"
          style={{
            width: picture.width,
            height: picture.height,
            transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
            transformOrigin: '0 0',
            transition: dragging ? 'none' : 'transform 280ms ease',
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: markup }} />
          {spots.length > 0 ? (
            <Spotlight
              width={picture.width}
              height={picture.height}
              boxes={spots}
              theme={theme}
            />
          ) : null}
        </div>
      </div>

      <div className="pointer-events-none absolute right-3 bottom-3 flex gap-1.5">
        <CanvasButton
          label="−"
          onClick={() =>
            setCamera((current) => {
              const viewport = viewportRef.current
              if (!viewport) return current
              return zoomAt(
                current,
                { x: viewport.clientWidth / 2, y: viewport.clientHeight / 2 },
                1 / 1.18,
              )
            })
          }
        />
        <CanvasButton
          label={`${Math.round(camera.scale * 100)}%`}
          onClick={() => fit()}
        />
        <CanvasButton
          label="+"
          onClick={() =>
            setCamera((current) => {
              const viewport = viewportRef.current
              if (!viewport) return current
              return zoomAt(
                current,
                { x: viewport.clientWidth / 2, y: viewport.clientHeight / 2 },
                1.18,
              )
            })
          }
        />
        <CanvasButton label="Fit" onClick={() => fit()} />
      </div>
    </div>
  )
}

function Spotlight({
  width,
  height,
  boxes,
  theme,
}: {
  width: number
  height: number
  boxes: { x: number; y: number; width: number; height: number }[]
  theme: 'dark' | 'light'
}) {
  const pad = 8
  const stroke = theme === 'dark' ? '#3fb950' : '#1f883d'
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      height={height}
      width={width}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <mask id="pr-lens-spotlight">
          <rect fill="white" height={height} width={width} x="0" y="0" />
          {boxes.map((box, index) => (
            <rect
              fill="black"
              height={box.height + pad * 2}
              key={`${box.x}-${box.y}-${index}`}
              rx="10"
              width={box.width + pad * 2}
              x={box.x - pad}
              y={box.y - pad}
            />
          ))}
        </mask>
      </defs>
      <rect
        fill="var(--veil)"
        height={height}
        mask="url(#pr-lens-spotlight)"
        width={width}
        x="0"
        y="0"
      />
      {boxes.map((box, index) => (
        <rect
          fill="none"
          height={box.height + pad * 2}
          key={`rim-${box.x}-${box.y}-${index}`}
          rx="10"
          stroke={stroke}
          strokeWidth="2.5"
          width={box.width + pad * 2}
          x={box.x - pad}
          y={box.y - pad}
        />
      ))}
    </svg>
  )
}

function CanvasButton({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      className="pointer-events-auto rounded-md border border-[var(--border)] bg-[var(--chrome)]/92 px-2.5 py-1 text-[11px] text-[var(--text)] shadow-sm backdrop-blur hover:border-[var(--muted)]"
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}

function svgMarkup(svg: string) {
  const start = svg.indexOf('<svg')
  return start === -1 ? svg : svg.slice(start)
}
