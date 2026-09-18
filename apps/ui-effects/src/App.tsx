import { BeamStage } from './BeamStage.tsx'
import { SECTIONS } from './catalog.ts'
import { GooeyStage } from './GooeyStage.tsx'
import { ImageStage } from './ImageStage.tsx'
import { MetalStage } from './MetalStage.tsx'
import { OrbStage } from './OrbStage.tsx'

export default function App() {
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <a className="flex items-center gap-2.5" href="#top">
            <span className="grid size-8 place-items-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[15px]">
              ✶
            </span>
            <span>
              <span className="block text-[13px] font-medium leading-none">Atelier</span>
              <span className="mono text-[10px] tracking-wide text-[var(--muted)]">
                libraries.dev
              </span>
            </span>
          </a>
          <nav aria-label="Libraries" className="flex flex-wrap gap-1">
            {SECTIONS.map((section) => (
              <a
                className="rounded-full px-2.5 py-1 text-[12px] text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]"
                href={`#${section.id}`}
                key={section.id}
              >
                {section.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-24" id="top">
        <section className="py-14 sm:py-20">
          <p className="mono text-[11px] tracking-[0.24em] text-[var(--lilac)] uppercase">
            Five MIT packages · one gallery
          </p>
          <h1 className="display mt-3 max-w-3xl text-[clamp(2.4rem,7vw,4.6rem)] leading-[0.95] font-medium tracking-tight">
            UI that does not look like a default agent app.
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-[var(--muted)]">
            Jakub Antalik’s Libraries.dev effects — border beam, thinking orbs, gooey, liquid
            metal, and image generation — live here with simple playgrounds. Source:{' '}
            <a
              className="text-[var(--text)] underline decoration-white/20 underline-offset-4 hover:decoration-[var(--mint)]"
              href="https://x.com/Jakubantalik/status/2095551141367173608"
              rel="noreferrer"
              target="_blank"
            >
              the announcement post
            </a>
            .
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {SECTIONS.map((section, index) => (
              <li key={section.id}>
                <a
                  className="mono inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/[0.03] px-3 py-1.5 text-[11px] text-[var(--muted)] hover:text-[var(--text)]"
                  href={`#${section.id}`}
                >
                  <span className="text-[var(--lilac)]">0{index + 1}</span>
                  {section.pkg}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-8">
          <BeamStage />
          <OrbStage />
          <GooeyStage />
          <MetalStage />
          <ImageStage />
        </div>
      </main>

      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-[12px] text-[var(--muted)]">
          <p>All five libraries are MIT. Need React 18+; img-fx also needs three.</p>
          <a
            className="hover:text-[var(--text)]"
            href="https://libraries.dev"
            rel="noreferrer"
            target="_blank"
          >
            libraries.dev
          </a>
        </div>
      </footer>
    </div>
  )
}
