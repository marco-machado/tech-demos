import { useState } from 'react'
import artifactHtml from './artifact.html?raw'
import { MermaidPane } from './MermaidPane.tsx'
import {
  CALL_TREE,
  COMPONENT_TREE,
  DIFFS,
  DIFF_SHAPES,
  FILE_TREE,
  MERMAID_CHART,
  PSEUDOCODE,
  type DiffShape,
  type FormatId,
  type PseudoLine,
} from './story.ts'
import { Chip, CodeStage, DiffBlock, OutlineTree, PaperStage } from './ui.tsx'

const TOKEN_CLASS = {
  kw: 'text-[var(--kw)]',
  id: 'text-[var(--id)]',
  txt: 'text-[var(--code-text)]',
  cmt: 'italic text-[var(--cmt)]',
  str: 'text-[var(--gold)]',
} as const

function PseudoView({ lines }: { lines: PseudoLine[] }) {
  return (
    <ol className="mono m-0 list-none p-0 text-[13px] leading-7">
      {lines.map((line, index) => (
        <li className="flex gap-4 rounded-md px-1" key={index}>
          <span className="w-5 shrink-0 text-right text-[11px] text-[var(--code-muted)]">
            {index + 1}
          </span>
          <span className="whitespace-pre">
            {'  '.repeat(line.indent)}
            {line.tokens.map((token, tokenIndex) => (
              <span className={TOKEN_CLASS[token.kind]} key={tokenIndex}>
                {token.value}
              </span>
            ))}
          </span>
        </li>
      ))}
    </ol>
  )
}

function DiffView() {
  const [shape, setShape] = useState<DiffShape>('call')
  const current = DIFFS[shape]
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {DIFF_SHAPES.map((id) => (
          <Chip
            active={id === shape}
            key={id}
            label={DIFFS[id].label}
            onClick={() => setShape(id)}
          />
        ))}
      </div>
      <p className="mb-3 text-[12px] text-[var(--code-muted)]">{current.blurb}</p>
      <DiffBlock lines={current.lines} />
    </div>
  )
}

function ArtifactView() {
  return (
    <div className="artifact-frame overflow-hidden rounded-2xl border border-[var(--line)] shadow-[0_20px_50px_rgba(23,20,16,0.18)]">
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-2.5">
        <p className="mono text-[11px] text-[var(--code-muted)]">
          show-me-expand-before-launch.html
        </p>
        <p className="mono text-[10px] tracking-[0.14em] text-[var(--code-muted)] uppercase">
          focused artifact
        </p>
      </div>
      <iframe sandbox="" srcDoc={artifactHtml} title="Focused HTML artifact" />
    </div>
  )
}

export function Stage({ format }: { format: FormatId }) {
  if (format === 'pseudocode') {
    return (
      <CodeStage label="pseudocode">
        <PseudoView lines={PSEUDOCODE} />
      </CodeStage>
    )
  }
  if (format === 'call-tree') {
    return (
      <CodeStage label="call tree">
        <OutlineTree nodes={CALL_TREE} />
      </CodeStage>
    )
  }
  if (format === 'component-tree') {
    return (
      <CodeStage label="component tree">
        <OutlineTree nodes={COMPONENT_TREE} />
      </CodeStage>
    )
  }
  if (format === 'file-tree') {
    return (
      <CodeStage label="file tree">
        <OutlineTree nodes={FILE_TREE} />
      </CodeStage>
    )
  }
  if (format === 'mermaid') {
    return (
      <PaperStage>
        <div className="px-4 py-3">
          <p className="mono text-[10px] tracking-[0.14em] text-[var(--muted)] uppercase">
            sequence
          </p>
        </div>
        <div className="px-3 pb-6 pt-1">
          <MermaidPane chart={MERMAID_CHART} />
        </div>
      </PaperStage>
    )
  }
  if (format === 'diff') {
    return (
      <CodeStage label="shape-matched diff">
        <DiffView />
      </CodeStage>
    )
  }
  return <ArtifactView />
}
