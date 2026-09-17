import { Group, Panel, Separator } from 'motion-panels/react'
import { useState, type ReactNode } from 'react'
import { CONSOLE, SOURCE, TREE, type FileId } from './content.ts'

const SIDEBAR = 248
const PREVIEW = 340
const TERMINAL = 148

const FOLD = { bounce: 0.22, type: 'spring', visualDuration: 0.42 } as const

function sizeLabel(size: number, collapsed: boolean) {
  return collapsed ? 'folded' : `${Math.round(size)}px`
}

function tokenClass(token: string) {
  if (/^(?:import|from|export|function|return|const)$/u.test(token)) {
    return 'text-[var(--sand)]'
  }
  if (/^['"`]/.test(token) || token.startsWith('#')) {
    return 'text-[var(--harbor)]'
  }
  if (/^[A-Z]/.test(token) || token.startsWith('--')) {
    return 'text-[var(--kelp)]'
  }
  if (/^[{}()[\]=:,;<>/]$/.test(token) || token === '=>' || token === '{{') {
    return 'text-[var(--muted)]'
  }
  return 'text-[var(--text)]/80'
}

function highlight(line: string) {
  return line.split(/([A-Za-z_][\w-]*|'[^']*'|"[^"]*"|`[^`]*`|#[0-9a-fA-F]{3,8}|[{}()[\]=:,;<>/]+)/u)
}

function IconPanels() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 16 16">
      <rect x="1" y="2" width="3.5" height="12" rx="0.8" fill="#d4a574" />
      <rect x="5.5" y="2" width="5" height="12" rx="0.8" fill="#7eb8c9" />
      <rect x="11.5" y="2" width="3.5" height="12" rx="0.8" fill="#c9d4a0" />
    </svg>
  )
}

export default function App() {
  const [files, setFiles] = useState(SIDEBAR)
  const [preview, setPreview] = useState(PREVIEW)
  const [terminal, setTerminal] = useState(TERMINAL)
  const [fold, setFold] = useState({
    files: false,
    preview: false,
    terminal: false,
  })
  const [active, setActive] = useState<FileId>('harbor')

  const reset = () => {
    setFiles(SIDEBAR)
    setPreview(PREVIEW)
    setTerminal(TERMINAL)
    setFold({ files: false, preview: false, terminal: false })
  }

  const source = SOURCE[active]

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--bg)]">
      <header className="flex h-12 flex-none items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--chrome)] px-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <IconPanels />
          <div className="min-w-0">
            <p className="text-[13px] font-medium tracking-tight text-[var(--text)]">
              Harbor
            </p>
            <p className="truncate text-[11px] text-[var(--muted)]">
              Motion Panels · drag a seam or fold a pane
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <Toggle
            label="Files"
            on={fold.files}
            onClick={() => setFold((current) => ({ ...current, files: !current.files }))}
          />
          <Toggle
            label="Preview"
            on={fold.preview}
            onClick={() =>
              setFold((current) => ({ ...current, preview: !current.preview }))
            }
          />
          <Toggle
            label="Console"
            on={fold.terminal}
            onClick={() =>
              setFold((current) => ({ ...current, terminal: !current.terminal }))
            }
          />
          <button
            className="ml-1 rounded-md border border-[var(--border)] bg-[var(--pane)] px-2.5 py-1 text-[11px] text-[var(--muted)] hover:text-[var(--text)]"
            onClick={reset}
            type="button"
          >
            Reset
          </button>
        </div>
      </header>

      <main className="min-h-0 flex-1">
        <Group orientation="horizontal" style={{ height: '100%', width: '100%' }}>
          <Panel
            collapsed={fold.files}
            defaultSize={SIDEBAR}
            maxSize={420}
            minSize={180}
            onCollapsedChange={(collapsed) =>
              setFold((current) => ({ ...current, files: collapsed }))
            }
            onSizeChange={setFiles}
            size={files}
            transition={FOLD}
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -18 }}
            style={{ originX: 1 }}
          >
            <Pane kicker="Files" size={sizeLabel(files, fold.files)}>
              <nav className="flex flex-col py-2" aria-label="Project files">
                {TREE.map((row) =>
                  row.kind === 'folder' ? (
                    <div
                      className="flex items-center gap-2 px-3 py-1 text-[12px] text-[var(--muted)]"
                      key={row.name}
                    >
                      <span className="text-[var(--sand)]">▾</span>
                      {row.name}
                    </div>
                  ) : (
                    <button
                      className={`flex items-center gap-2 px-3 py-1 text-left text-[12px] ${row.nest ? 'pl-7' : ''} ${
                        active === row.id
                          ? 'bg-white/5 text-[var(--text)]'
                          : 'text-[var(--muted)] hover:bg-white/[0.04] hover:text-[var(--text)]'
                      }`}
                      key={row.name}
                      onClick={() => setActive(row.id)}
                      type="button"
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          row.id === 'harbor'
                            ? 'bg-[var(--sand)]'
                            : row.id === 'tokens'
                              ? 'bg-[var(--harbor)]'
                              : 'bg-[var(--kelp)]'
                        }`}
                      />
                      {row.name}
                    </button>
                  ),
                )}
              </nav>
            </Pane>
          </Panel>

          <Separator aria-label="Resize files panel" />

          <Panel pin>
            <Group orientation="vertical" style={{ height: '100%', width: '100%' }}>
              <Panel pin>
                <Pane kicker={source.title} size="fill">
                  <div className="h-full overflow-auto bg-[var(--editor)] py-3 font-mono text-[12.5px] leading-7">
                    {source.lines.map((line, index) => (
                      <div className="flex gap-4 px-4" key={`${index}-${line}`}>
                        <span className="w-6 shrink-0 text-right text-[var(--muted)]/55">
                          {index + 1}
                        </span>
                        <code className="min-w-0 whitespace-pre">
                          {line
                            ? highlight(line).map((token, tokenIndex) =>
                                token ? (
                                  <span
                                    className={tokenClass(token)}
                                    key={`${tokenIndex}-${token}`}
                                  >
                                    {token}
                                  </span>
                                ) : null,
                              )
                            : ' '}
                        </code>
                      </div>
                    ))}
                  </div>
                </Pane>
              </Panel>

              <Separator aria-label="Resize console panel" />

              <Panel
                collapsed={fold.terminal}
                defaultSize={TERMINAL}
                maxSize={280}
                minSize={88}
                onCollapsedChange={(collapsed) =>
                  setFold((current) => ({ ...current, terminal: collapsed }))
                }
                onSizeChange={setTerminal}
                size={terminal}
                transition={FOLD}
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 16 }}
                style={{ originY: 0 }}
              >
                <Pane kicker="Console" size={sizeLabel(terminal, fold.terminal)}>
                  <ul className="space-y-1 bg-[var(--editor)] px-4 py-3 font-mono text-[12px]">
                    {CONSOLE.map((row) => (
                      <li
                        className={
                          row.tone === 'ok'
                            ? 'text-[var(--kelp)]'
                            : row.tone === 'sand'
                              ? 'text-[var(--sand)]'
                              : 'text-[var(--muted)]'
                        }
                        key={row.text}
                      >
                        {row.text}
                      </li>
                    ))}
                  </ul>
                </Pane>
              </Panel>
            </Group>
          </Panel>

          <Separator aria-label="Resize preview panel" />

          <Panel
            collapsed={fold.preview}
            defaultSize={PREVIEW}
            maxSize={560}
            minSize={240}
            onCollapsedChange={(collapsed) =>
              setFold((current) => ({ ...current, preview: collapsed }))
            }
            onSizeChange={setPreview}
            size={preview}
            transition={FOLD}
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 18 }}
            style={{ originX: 0 }}
          >
            <Pane kicker="Preview" size={sizeLabel(preview, fold.preview)}>
              <div className="flex h-full items-center justify-center bg-[var(--preview)] p-6">
                <article className="w-full max-w-[280px] overflow-hidden rounded-2xl border border-white/8 bg-[#141922] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)]">
                  <div className="h-28 bg-[linear-gradient(135deg,#1b2836_0%,#3a4f4a_52%,#d4a574_140%)]" />
                  <div className="space-y-2 p-5">
                    <p className="text-[11px] tracking-[0.18em] text-[var(--sand)] uppercase">
                      Tonight
                    </p>
                    <h1 className="text-[22px] leading-tight font-medium tracking-tight">
                      Calm water, 62°
                    </h1>
                    <p className="text-[13px] text-[var(--muted)]">
                      Fog lifting by 8pm. Low swell off the breakwater.
                    </p>
                    <div className="flex items-center justify-between pt-3 text-[11px] text-[var(--harbor)]">
                      <span>HarborCard</span>
                      <span>live</span>
                    </div>
                  </div>
                </article>
              </div>
            </Pane>
          </Panel>
        </Group>
      </main>

      <footer className="flex h-8 flex-none items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--chrome)] px-3 text-[11px] text-[var(--muted)]">
        <p>
          Files {sizeLabel(files, fold.files)} · Preview{' '}
          {sizeLabel(preview, fold.preview)} · Console{' '}
          {sizeLabel(terminal, fold.terminal)}
        </p>
        <p className="hidden sm:block">
          Drag past min/max to rubber-band · Enter on a separator folds it
        </p>
      </footer>
    </div>
  )
}

function Toggle({
  label,
  on,
  onClick,
}: {
  label: string
  on: boolean
  onClick: () => void
}) {
  return (
    <button
      aria-pressed={on}
      className={`rounded-md border px-2.5 py-1 text-[11px] ${
        on
          ? 'border-[var(--sand)]/40 bg-[var(--sand)]/12 text-[var(--sand)]'
          : 'border-[var(--border)] bg-[var(--pane)] text-[var(--muted)] hover:text-[var(--text)]'
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}

function Pane({
  children,
  kicker,
  size,
}: {
  children: ReactNode
  kicker: string
  size: string
}) {
  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden bg-[var(--pane)]">
      <header className="flex h-9 flex-none items-center justify-between gap-3 border-b border-[var(--border)] px-3">
        <h2 className="truncate text-[11px] tracking-[0.14em] text-[var(--muted)] uppercase">
          {kicker}
        </h2>
        <span className="font-mono text-[10px] tracking-normal text-[var(--muted)]/80">
          {size}
        </span>
      </header>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </section>
  )
}
