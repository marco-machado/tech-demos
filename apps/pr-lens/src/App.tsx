import { render, type Theme } from '@coldtea/pr-lens-renderer'
import { useEffect, useState } from 'react'
import { DiagramCanvas } from './Canvas.tsx'
import {
  defaultTarget,
  targetForStep,
  type LensName,
} from './focus.ts'
import {
  architectureViews,
  hasLens,
  sampleById,
  SAMPLES,
  type SampleId,
} from './samples.ts'

const PLAY_MS = 4200

export default function App() {
  const [sampleId, setSampleId] = useState<SampleId>('postmark')
  const [theme, setTheme] = useState<Theme>('dark')
  const [lens, setLens] = useState<LensName>('architecture')
  const [viewId, setViewId] = useState<string | undefined>('overview')
  const [stepIndex, setStepIndex] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [jsonOpen, setJsonOpen] = useState(false)

  const sample = sampleById(sampleId)
  const doc = sample.doc
  const steps = doc.walkthrough?.steps ?? []
  const step = stepIndex === null ? undefined : steps[stepIndex]
  const target = step ? targetForStep(doc, step) : { lens, view: viewId }
  const views = architectureViews(doc)
  const canFlow = hasLens(doc, 'data-flow') && doc.flows.length > 0

  let picture: { ok: true; rendered: ReturnType<typeof render> } | { ok: false; message: string }
  try {
    picture = {
      ok: true,
      rendered: render(doc, {
        lens: target.lens,
        theme,
        view: target.lens === 'architecture' ? target.view : undefined,
      }),
    }
  } catch (error) {
    picture = {
      ok: false,
      message: error instanceof Error ? error.message : 'Render failed',
    }
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])

  useEffect(() => {
    if (!playing || steps.length === 0) return
    const timer = window.setTimeout(() => {
      setStepIndex((current) => {
        const index = current ?? 0
        if (index >= steps.length - 1) {
          setPlaying(false)
          return index
        }
        return index + 1
      })
    }, PLAY_MS)
    return () => window.clearTimeout(timer)
  }, [playing, stepIndex, steps.length])

  const togglePlay = (count: number) => {
    if (count === 0) return
    setPlaying((current) => {
      const next = !current
      if (next) {
        setStepIndex((index) => (index === null || index >= count - 1 ? 0 : index))
      }
      return next
    })
  }

  const stepBy = (delta: number, count: number) => {
    if (count === 0) return
    setPlaying(false)
    setStepIndex((current) => {
      const index = current ?? (delta > 0 ? -1 : 0)
      return Math.min(count - 1, Math.max(0, index + delta))
    })
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }
      if (event.key === 'w' || event.key === 'W' || event.key === ' ') {
        event.preventDefault()
        togglePlay(steps.length)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        stepBy(1, steps.length)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        stepBy(-1, steps.length)
      } else if (event.key === 'Escape') {
        setPlaying(false)
        setStepIndex(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [steps.length])

  const chooseSample = (id: SampleId) => {
    const next = sampleById(id)
    setSampleId(id)
    setPlaying(false)
    setStepIndex(null)
    setJsonOpen(false)
    const nextLens = hasLens(next.doc, 'architecture') ? 'architecture' : 'data-flow'
    setLens(nextLens)
    setViewId(defaultTarget(next.doc, nextLens).view)
  }

  const chooseLens = (next: LensName) => {
    if (next === 'data-flow' && !canFlow) return
    setPlaying(false)
    setStepIndex(null)
    setLens(next)
    setViewId(next === 'architecture' ? architectureViews(doc)[0]?.id : undefined)
  }

  const stats = doc.stats

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--bg)] text-[var(--text)]">
      <header className="flex flex-none flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--chrome)] px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <Mark />
          <div className="min-w-0">
            <p className="text-[13px] font-medium tracking-tight">{doc.title}</p>
            <p className="truncate text-[11px] text-[var(--muted)]">
              PR Lens renderer · schema-checked graph · pan, zoom, or press W
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {SAMPLES.map((entry) => (
            <Chip
              key={entry.id}
              active={entry.id === sampleId}
              label={entry.label}
              onClick={() => chooseSample(entry.id)}
            />
          ))}
          <Chip
            active={theme === 'dark'}
            label={theme === 'dark' ? 'Dark' : 'Light'}
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          />
          <Chip active={jsonOpen} label="JSON" onClick={() => setJsonOpen((open) => !open)} />
        </div>
      </header>

      <div className="flex h-10 flex-none items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--pane)] px-3">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <Chip
            active={target.lens === 'architecture'}
            label="Architecture"
            onClick={() => chooseLens('architecture')}
          />
          <Chip
            active={target.lens === 'data-flow'}
            disabled={!canFlow}
            label="Data flow"
            onClick={() => chooseLens('data-flow')}
          />
          {target.lens === 'architecture'
            ? views.map((view) => (
                <Chip
                  key={view.id}
                  active={target.view === view.id}
                  label={view.id === 'overview' ? 'Blast radius' : view.title}
                  onClick={() => {
                    setPlaying(false)
                    setStepIndex(null)
                    setLens('architecture')
                    setViewId(view.id)
                  }}
                />
              ))
            : null}
        </div>
        <div className="hidden items-center gap-2 text-[11px] text-[var(--muted)] sm:flex">
          <Legend swatch="var(--added)" label="added" />
          <Legend swatch="var(--modified)" label="changed" />
          <Legend swatch="var(--removed)" label="removed" />
        </div>
      </div>

      {stats ? (
        <div className="flex flex-none flex-wrap items-center gap-2 border-b border-[var(--border)] bg-[var(--chrome)] px-3 py-2 text-[11px]">
          <span className="text-[var(--muted)]">
            {stats.filesChanged} files · +{stats.additions} / −{stats.deletions}
          </span>
          {stats.chips.map((chip) => (
            <span
              className={`rounded-full border px-2 py-0.5 ${
                chip.tone === 'hero'
                  ? 'border-[var(--added)]/40 text-[var(--added)]'
                  : chip.tone === 'added'
                    ? 'border-[var(--added)]/35 text-[var(--added)]'
                    : chip.tone === 'removed'
                      ? 'border-[var(--removed)]/35 text-[var(--removed)]'
                      : 'border-[var(--border)] text-[var(--muted)]'
              }`}
              key={chip.label}
            >
              {chip.label} {chip.value}
            </span>
          ))}
          <span className="ml-auto rounded-full border border-[var(--added)]/35 px-2 py-0.5 text-[var(--added)]">
            schema {doc.schemaVersion} · valid
          </span>
        </div>
      ) : (
        <div className="flex flex-none items-center justify-end border-b border-[var(--border)] bg-[var(--chrome)] px-3 py-2 text-[11px]">
          <span className="rounded-full border border-[var(--added)]/35 px-2 py-0.5 text-[var(--added)]">
            schema {doc.schemaVersion} · valid
          </span>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <main className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-[var(--canvas)]">
          {picture.ok ? (
            <DiagramCanvas
              picture={picture.rendered}
              step={step}
              target={target}
              theme={theme}
            />
          ) : (
            <p className="m-auto max-w-md px-6 text-center text-[13px] text-[var(--removed)]">
              {picture.message}
            </p>
          )}

          {step ? (
            <aside className="pointer-events-none absolute bottom-14 left-1/2 z-10 w-[min(36rem,calc(100%-1.5rem))] -translate-x-1/2 rounded-xl border border-[var(--border)] bg-[var(--chrome)]/94 px-4 py-3 shadow-[0_16px_40px_var(--shadow)] backdrop-blur">
              <p className="text-[10px] tracking-[0.16em] text-[var(--muted)] uppercase">
                Step {stepIndex! + 1} of {steps.length}
              </p>
              <h2 className="mt-1 text-[15px] font-medium tracking-tight">{step.heading}</h2>
              <p className="mt-1 text-[13px] text-[var(--muted)]">{step.body}</p>
            </aside>
          ) : (
            <p className="pointer-events-none absolute bottom-14 left-1/2 z-10 -translate-x-1/2 text-[11px] text-[var(--muted)]">
              Drag to pan · scroll to zoom · play walks the change
            </p>
          )}
        </main>

        {jsonOpen ? (
          <aside className="hidden w-[min(22rem,38%)] shrink-0 overflow-auto border-l border-[var(--border)] bg-[var(--pane)] p-3 md:block">
            <p className="text-[11px] tracking-[0.14em] text-[var(--muted)] uppercase">
              Graph document
            </p>
            <pre className="mono mt-2 whitespace-pre-wrap text-[11px] leading-5 text-[var(--text)]/90">
              {JSON.stringify(
                {
                  kind: doc.kind,
                  schemaVersion: doc.schemaVersion,
                  title: doc.title,
                  lenses: doc.lenses,
                  lanes: doc.lanes.map((lane) => lane.id),
                  nodes: doc.nodes.map((node) => ({
                    id: node.id,
                    kind: node.kind,
                    delta: node.delta,
                    lane: node.lane,
                  })),
                  edges: doc.edges.map((edge) => edge.id),
                  flows: doc.flows.map((flow) => flow.id),
                  walkthrough: doc.walkthrough?.steps.map((item) => item.id),
                },
                null,
                2,
              )}
            </pre>
          </aside>
        ) : null}
      </div>

      <footer className="flex h-12 flex-none items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--chrome)] px-3">
        <div className="flex items-center gap-1.5">
          <Chip
            disabled={steps.length === 0}
            label="Prev"
            onClick={() => stepBy(-1, steps.length)}
          />
          <Chip
            active={playing}
            disabled={steps.length === 0}
            label={playing ? 'Pause' : 'Play'}
            onClick={() => togglePlay(steps.length)}
          />
          <Chip
            disabled={steps.length === 0}
            label="Next"
            onClick={() => stepBy(1, steps.length)}
          />
          {stepIndex !== null ? (
            <Chip
              label="Exit tour"
              onClick={() => {
                setPlaying(false)
                setStepIndex(null)
              }}
            />
          ) : null}
        </div>
        <p className="hidden text-[11px] text-[var(--muted)] sm:block">
          {steps.length > 0
            ? `Walkthrough · ${steps.length} steps · W to play`
            : 'This sample has no walkthrough — pan and zoom the diagram'}
        </p>
      </footer>
    </div>
  )
}

function Chip({
  active = false,
  disabled = false,
  label,
  onClick,
}: {
  active?: boolean
  disabled?: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      aria-pressed={active}
      className={`rounded-md border px-2.5 py-1 text-[11px] disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? 'border-[var(--added)]/45 bg-[var(--added)]/12 text-[var(--added)]'
          : 'border-[var(--border)] bg-[var(--pane)] text-[var(--muted)] hover:text-[var(--text)]'
      }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-1.5 rounded-full" style={{ background: swatch }} />
      {label}
    </span>
  )
}

function Mark() {
  return (
    <svg aria-hidden="true" className="size-7 shrink-0" fill="none" viewBox="0 0 32 32">
      <rect fill="var(--pane)" height="32" rx="8" width="32" />
      <circle cx="14" cy="14" r="7.5" stroke="var(--added)" strokeWidth="2" />
      <circle cx="14" cy="14" fill="var(--added)" r="3" />
      <path d="M19.4 19.4 L25 25" stroke="var(--text)" strokeLinecap="round" strokeWidth="2.4" />
    </svg>
  )
}
