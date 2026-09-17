export type FileId = 'harbor' | 'tokens' | 'readme'

export type TreeRow =
  | { kind: 'folder'; name: string }
  | { kind: 'file'; id: FileId; name: string; nest?: boolean }

export const TREE: TreeRow[] = [
  { kind: 'folder', name: 'src' },
  { kind: 'file', id: 'harbor', name: 'HarborCard.tsx', nest: true },
  { kind: 'file', id: 'tokens', name: 'tokens.css', nest: true },
  { kind: 'file', id: 'readme', name: 'README.md' },
]

export const SOURCE: Record<FileId, { title: string; lines: string[] }> = {
  harbor: {
    title: 'src/HarborCard.tsx',
    lines: [
      "import { dusk } from './tokens'",
      '',
      'export function HarborCard() {',
      '  return (',
      '    <article className="card">',
      '      <p className="kicker">Tonight</p>',
      '      <h1>Calm water, 62°</h1>',
      '      <p>Fog lifting by 8pm. Low swell.</p>',
      '      <span style={{ color: dusk }}>Harbor</span>',
      '    </article>',
      '  )',
      '}',
    ],
  },
  tokens: {
    title: 'src/tokens.css',
    lines: [
      ':root {',
      '  --sand: #d4a574;',
      '  --harbor: #7eb8c9;',
      '  --kelp: #c9d4a0;',
      '  --dusk: #0f1217;',
      '}',
      '',
      '.card {',
      '  padding: 28px;',
      '  border-radius: 18px;',
      '}',
    ],
  },
  readme: {
    title: 'README.md',
    lines: [
      '# Harbor',
      '',
      'A Motion Panels workspace.',
      'Drag a seam. Collapse a pane.',
      'Overshoot rubber-bands at the bound.',
    ],
  },
}

export const CONSOLE = [
  { tone: 'muted' as const, text: '$ bun run preview' },
  { tone: 'ok' as const, text: 'compiled HarborCard in 42ms' },
  { tone: 'muted' as const, text: 'listening on http://localhost:5173' },
  { tone: 'sand' as const, text: 'fold: files 240 → 0 (spring)' },
]
