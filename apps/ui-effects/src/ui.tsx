import type { ReactNode } from 'react'

export function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      aria-pressed={active}
      className={`rounded-full border px-2.5 py-1 text-[11px] tracking-wide transition ${
        active
          ? 'border-[var(--lilac)]/50 bg-[var(--lilac)]/15 text-[var(--lilac)]'
          : 'border-[var(--border)] bg-white/[0.03] text-[var(--muted)] hover:text-[var(--text)]'
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

export function Stage({
  id,
  index,
  title,
  pkg,
  blurb,
  docs,
  controls,
  children,
}: {
  id: string
  index: string
  title: string
  pkg: string
  blurb: string
  docs: string
  controls: ReactNode
  children: ReactNode
}) {
  return (
    <section
      className="scroll-mt-24 overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--card)]"
      id={id}
    >
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-5 sm:px-8">
        <div className="min-w-0">
          <p className="mono text-[11px] tracking-[0.22em] text-[var(--muted)] uppercase">
            {index} · {pkg}
          </p>
          <h2 className="display mt-1 text-[28px] leading-none font-medium tracking-tight">
            {title}
          </h2>
          <p className="mt-2 max-w-xl text-[14px] text-[var(--muted)]">{blurb}</p>
        </div>
        <a
          className="mono shrink-0 rounded-full border border-[var(--border)] px-3 py-1.5 text-[11px] text-[var(--muted)] hover:text-[var(--text)]"
          href={docs}
          rel="noreferrer"
          target="_blank"
        >
          docs ↗
        </a>
      </header>
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-[var(--stage)] p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(243,239,230,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(243,239,230,0.05) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="relative z-10">{children}</div>
        </div>
        <div className="flex flex-col gap-4 border-t border-[var(--border)] p-5 lg:border-t-0 lg:border-l">
          <p className="mono text-[10px] tracking-[0.18em] text-[var(--muted)] uppercase">
            Controls
          </p>
          {controls}
        </div>
      </div>
    </section>
  )
}
