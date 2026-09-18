import { useEffect, useState } from 'react'
import { Stage } from './Stage.tsx'
import { FORMATS, STORY, formatById, nextFormat, type FormatId } from './story.ts'

export default function App() {
  const [format, setFormat] = useState<FormatId>('call-tree')
  const meta = formatById(format)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }
      const digit = Number(event.key)
      if (digit >= 1 && digit <= FORMATS.length) {
        event.preventDefault()
        setFormat(FORMATS[digit - 1].id)
        return
      }
      if (event.key === 'ArrowDown' || event.key === 'j' || event.key === 'ArrowRight') {
        event.preventDefault()
        setFormat((current) => nextFormat(current, 1))
      } else if (event.key === 'ArrowUp' || event.key === 'k' || event.key === 'ArrowLeft') {
        event.preventDefault()
        setFormat((current) => nextFormat(current, -1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex min-h-full flex-col">
      <header className="flex flex-none flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--paper)_82%,white)] px-4 py-3 backdrop-blur-md">
        <div className="flex min-w-0 items-center gap-3">
          <Mark />
          <div className="min-w-0">
            <p className="text-[13px] font-medium tracking-tight">Show Me</p>
            <p className="truncate text-[11px] text-[var(--muted)]">
              {STORY.kicker} · {STORY.title}
            </p>
          </div>
        </div>
        <p className="hidden text-[11px] text-[var(--muted)] sm:block">
          Keys 1–7 · arrows or j/k to step formats
        </p>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col lg:flex-row">
        <nav
          aria-label="Visual formats"
          className="flex flex-none gap-1 overflow-x-auto border-b border-[var(--line)] p-2 lg:w-56 lg:flex-col lg:overflow-visible lg:border-r lg:border-b-0 lg:p-3"
          role="tablist"
        >
          {FORMATS.map((item) => {
            const active = item.id === format
            return (
              <button
                aria-controls="format-panel"
                aria-selected={active}
                className={`flex min-w-[9.5rem] flex-col rounded-xl border px-3 py-2 text-left lg:min-w-0 ${
                  active
                    ? 'border-[var(--accent)]/40 bg-[var(--card)] shadow-[0_8px_20px_rgba(27,23,18,0.06)]'
                    : 'border-transparent hover:bg-black/5'
                }`}
                id={`tab-${item.id}`}
                key={item.id}
                onClick={() => setFormat(item.id)}
                role="tab"
                type="button"
              >
                <span className="mono text-[10px] tracking-[0.16em] text-[var(--accent)]">
                  {item.n}
                </span>
                <span className="text-[13px] font-medium">{item.label}</span>
                <span className="hidden text-[11px] text-[var(--muted)] lg:block">
                  {item.useWhen}
                </span>
              </button>
            )
          })}
        </nav>

        <main className="flex min-w-0 flex-1 flex-col gap-6 px-4 py-6 lg:flex-row lg:px-8">
          <section className="min-w-0 flex-1">
            <p className="mono text-[11px] tracking-[0.18em] text-[var(--accent)] uppercase">
              {STORY.kicker}
            </p>
            <h1 className="display mt-1 max-w-xl text-[clamp(1.8rem,4vw,2.7rem)] leading-[1.1] font-medium tracking-tight">
              {STORY.title}
            </h1>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-[var(--muted)]">
              {STORY.summary}
            </p>
            <div
              aria-labelledby={`tab-${format}`}
              className="stage-in mt-6"
              id="format-panel"
              key={format}
              role="tabpanel"
            >
              <Stage format={format} />
            </div>
          </section>

          <aside className="w-full shrink-0 lg:w-64">
            <p className="mono text-[10px] tracking-[0.18em] text-[var(--muted)] uppercase">
              {meta.n} · {meta.label}
            </p>
            <h2 className="display mt-2 text-[1.35rem] leading-snug font-medium">{meta.useWhen}</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--muted)]">{meta.prose}</p>
            <p className="mt-6 text-[12px] text-[var(--muted)]">
              Smallest view that makes the point. The skill would pick one; this gallery shows all
              seven for the same story.
            </p>
          </aside>
        </main>
      </div>

      <footer className="mt-auto border-t border-[var(--line)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-[12px] text-[var(--muted)]">
          <p>
            Formats from{' '}
            <a
              className="text-[var(--ink)] underline decoration-[var(--line)] underline-offset-4 hover:decoration-[var(--accent)]"
              href={STORY.skillUrl}
              rel="noreferrer"
              target="_blank"
            >
              humanlayer /show-me
            </a>
            . Not a live skill runtime.
          </p>
          <a
            className="hover:text-[var(--ink)]"
            href={STORY.bookmarkUrl}
            rel="noreferrer"
            target="_blank"
          >
            Source bookmark →
          </a>
        </div>
      </footer>
    </div>
  )
}

function Mark() {
  return (
    <svg aria-hidden="true" className="size-8 shrink-0" fill="none" viewBox="0 0 32 32">
      <rect fill="var(--card)" height="32" rx="8" stroke="var(--line)" width="32" />
      <ellipse cx="16" cy="16" rx="10" ry="6.2" stroke="var(--ink)" strokeWidth="1.6" />
      <circle cx="16" cy="16" fill="var(--accent)" r="3.2" />
      <circle cx="17.1" cy="15.1" fill="var(--card)" r="1" />
    </svg>
  )
}
