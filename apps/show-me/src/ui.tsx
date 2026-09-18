import type { CSSProperties, ReactNode } from 'react'
import type { DiffLine, TreeNode } from './story.ts'

type FlatLine = {
  id: string
  prefix: string
  label: string
  hint?: string
  mark?: 'new'
  kind?: TreeNode['kind']
}

function flattenTree(nodes: TreeNode[]): FlatLine[] {
  const out: FlatLine[] = []
  const walk = (list: TreeNode[], ancestorsLast: boolean[]) => {
    list.forEach((node, index) => {
      const last = index === list.length - 1
      const gutter = ancestorsLast.map((wasLast) => (wasLast ? '   ' : '│  ')).join('')
      const branch = ancestorsLast.length === 0 ? '' : last ? '└─ ' : '├─ '
      out.push({
        id: node.id,
        prefix: `${gutter}${branch}`,
        label: node.label,
        hint: node.hint,
        mark: node.mark,
        kind: node.kind,
      })
      if (node.children?.length) walk(node.children, [...ancestorsLast, last])
    })
  }
  walk(nodes, [])
  return out
}

const KIND_COLOR: Record<NonNullable<TreeNode['kind']>, string> = {
  fn: 'text-[var(--path)]',
  component: 'text-[var(--kw)]',
  hook: 'text-[var(--gold)]',
  dir: 'text-[var(--id)]',
  file: 'text-[var(--code-text)]',
}

export function OutlineTree({ nodes }: { nodes: TreeNode[] }) {
  const lines = flattenTree(nodes)
  return (
    <ul className="mono m-0 list-none p-0 text-[13px] leading-7">
      {lines.map((line) => (
        <li
          className={`flex flex-wrap items-baseline gap-x-2 rounded-md px-2 ${
            line.mark === 'new' ? 'bg-[var(--added-bg)]' : ''
          }`}
          key={line.id}
        >
          <span className="whitespace-pre text-[var(--code-muted)]">{line.prefix}</span>
          <span className={line.kind ? KIND_COLOR[line.kind] : 'text-[var(--code-text)]'}>
            {line.label}
          </span>
          {line.hint ? (
            <span className="text-[11px] text-[var(--code-muted)]"># {line.hint}</span>
          ) : null}
          {line.mark === 'new' ? (
            <span className="rounded-full bg-[var(--added)]/20 px-1.5 text-[10px] tracking-wide text-[var(--path)] uppercase">
              new
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

export function DiffBlock({ lines }: { lines: DiffLine[] }) {
  return (
    <ol className="mono m-0 list-none p-0 text-[13px] leading-7">
      {lines.map((line, index) => {
        const tone =
          line.op === 'add'
            ? 'bg-[var(--added-bg)] text-[var(--path)]'
            : line.op === 'del'
              ? 'bg-[var(--removed-bg)] text-[#f0a8a0]'
              : 'text-[var(--code-text)]'
        const mark = line.op === 'add' ? '+' : line.op === 'del' ? '−' : ' '
        return (
          <li className={`flex gap-3 rounded-md px-2 ${tone}`} key={`${index}-${line.text}`}>
            <span className="w-3 shrink-0 text-[var(--code-muted)]">{mark}</span>
            <span className="whitespace-pre">{line.text}</span>
          </li>
        )
      })}
    </ol>
  )
}

export function CodeStage({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--code)] shadow-[0_20px_50px_rgba(23,20,16,0.18)]">
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-[#c94b2a]/80" />
          <span className="size-2 rounded-full bg-[#c7921a]/80" />
          <span className="size-2 rounded-full bg-[#2f6d4f]/80" />
        </div>
        <p className="mono text-[10px] tracking-[0.14em] text-[var(--code-muted)] uppercase">
          {label}
        </p>
      </div>
      <div className="overflow-auto px-4 py-4 text-[var(--code-text)]">{children}</div>
    </div>
  )
}

export function PaperStage({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] shadow-[0_18px_40px_rgba(27,23,18,0.08)]"
      style={style}
    >
      {children}
    </div>
  )
}

export function Chip({
  active = false,
  label,
  onClick,
}: {
  active?: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      aria-pressed={active}
      className={`rounded-full border px-2.5 py-1 text-[11px] ${
        active
          ? 'border-[var(--accent)]/55 bg-[var(--accent)]/18 text-[var(--kw)]'
          : 'border-white/12 bg-white/6 text-[var(--code-muted)] hover:border-white/25 hover:text-[var(--code-text)]'
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}
