export const STORY = {
  title: 'Expand the skill mention before launch',
  kicker: 'Canned session refactor',
  summary:
    'The composer used to send `/show-me` as raw text. The change expands the slash into the skill body before launchAgent, then the UI subscribes after navigate.',
  skillUrl:
    'https://github.com/humanlayer/skills/blob/main/plugins/show-me/skills/show-me/SKILL.md',
  bookmarkUrl: 'https://x.com/rekram11/status/2095557317483782213',
} as const

export const FORMAT_IDS = [
  'pseudocode',
  'call-tree',
  'component-tree',
  'file-tree',
  'mermaid',
  'diff',
  'artifact',
] as const

export type FormatId = (typeof FORMAT_IDS)[number]

export type FormatMeta = {
  id: FormatId
  n: string
  label: string
  useWhen: string
  prose: string
}

export const FORMATS: FormatMeta[] = [
  {
    id: 'pseudocode',
    n: '01',
    label: 'Pseudocode',
    useWhen: 'Logic or an algorithm',
    prose:
      'Submit always expands first. The agent is launched with the skill body, never the raw slash.',
  },
  {
    id: 'call-tree',
    n: '02',
    label: 'Call tree',
    useWhen: 'Runtime control flow',
    prose:
      'expandSkillMention sits between persist and launch. After navigate, the page subscribes so the stream has somewhere to land.',
  },
  {
    id: 'component-tree',
    n: '03',
    label: 'Component tree',
    useWhen: 'UI structure and ownership',
    prose:
      'The mention field owns expansion (packages/skills). SessionPage only listens — it does not re-parse the slash.',
  },
  {
    id: 'file-tree',
    n: '04',
    label: 'File tree',
    useWhen: 'Responsibility / layout',
    prose:
      'commands/expand.ts is the new owner of slash → skill body. sessions/launch.ts must not run until that returns.',
  },
  {
    id: 'mermaid',
    n: '05',
    label: 'Mermaid',
    useWhen: 'Interaction over time',
    prose:
      'Sequence, not a flowchart: the user never talks to the daemon until the mention has been expanded.',
  },
  {
    id: 'diff',
    n: '06',
    label: 'Shape-matched diff',
    useWhen: 'What changed in a known shape',
    prose:
      'Same refactor, three surrounding shapes. Match the diff to the tree you were already looking at — call, component, or files.',
  },
  {
    id: 'artifact',
    n: '07',
    label: 'HTML artifact',
    useWhen: 'A slide denser than Mermaid',
    prose:
      'A focused infographic for the same pipeline. The skill would write a one-off HTML file and open it; here it is framed in-place.',
  },
]

export type TreeNode = {
  id: string
  label: string
  hint?: string
  mark?: 'new'
  kind?: 'fn' | 'component' | 'hook' | 'dir' | 'file'
  children?: TreeNode[]
}

export const CALL_TREE: TreeNode[] = [
  {
    id: 'submit',
    label: 'submitForm',
    kind: 'fn',
    children: [
      {
        id: 'create',
        label: 'createSession',
        kind: 'fn',
        children: [
          { id: 'persist', label: 'persistPrompt', kind: 'fn' },
          {
            id: 'expand',
            label: 'expandSkillMention',
            hint: 'slash → skill body',
            mark: 'new',
            kind: 'fn',
          },
          { id: 'launch', label: 'launchAgent', kind: 'fn' },
        ],
      },
      {
        id: 'nav',
        label: 'navigateToSession',
        kind: 'fn',
        children: [
          {
            id: 'sub',
            label: 'subscribeToEvents',
            hint: 'stream has a listener',
            mark: 'new',
            kind: 'fn',
          },
        ],
      },
    ],
  },
]

export const COMPONENT_TREE: TreeNode[] = [
  {
    id: 'composer',
    label: '<Composer>',
    hint: 'apps/studio/src/routes/session.tsx',
    kind: 'component',
    children: [
      { id: 'draft', label: 'usePromptDraft()', kind: 'hook' },
      {
        id: 'field',
        label: '<SkillMentionField>',
        kind: 'component',
        children: [
          {
            id: 'expandFn',
            label: 'expandSkillMention()',
            hint: 'packages/skills',
            mark: 'new',
            kind: 'fn',
          },
        ],
      },
      { id: 'launchBtn', label: '<LaunchButton>', kind: 'component' },
    ],
  },
  {
    id: 'page',
    label: '<SessionPage>',
    kind: 'component',
    children: [
      {
        id: 'events',
        label: 'useSessionEvents()',
        hint: 'subscribe after navigate',
        mark: 'new',
        kind: 'hook',
      },
      {
        id: 'toolbar',
        label: '<SessionToolbar>',
        hint: 'packages/ui',
        kind: 'component',
      },
    ],
  },
]

export const FILE_TREE: TreeNode[] = [
  {
    id: 'src',
    label: 'src/',
    kind: 'dir',
    children: [
      {
        id: 'commands',
        label: 'commands/',
        hint: 'parses slash mentions',
        kind: 'dir',
        children: [
          {
            id: 'expand',
            label: 'expand.ts',
            hint: '/show-me → skill body',
            mark: 'new',
            kind: 'file',
          },
        ],
      },
      {
        id: 'sessions',
        label: 'sessions/',
        hint: 'owns session state',
        kind: 'dir',
        children: [
          {
            id: 'launch',
            label: 'launch.ts',
            hint: 'launchAgent after expand',
            kind: 'file',
          },
        ],
      },
      {
        id: 'transport',
        label: 'transport/',
        hint: 'event stream',
        kind: 'dir',
        children: [
          {
            id: 'subfile',
            label: 'subscribe.ts',
            hint: 'UI listens after navigate',
            mark: 'new',
            kind: 'file',
          },
        ],
      },
    ],
  },
]

export type PseudoLine = {
  indent: number
  tokens: { kind: 'kw' | 'id' | 'txt' | 'cmt' | 'str'; value: string }[]
}

export const PSEUDOCODE: PseudoLine[] = [
  {
    indent: 0,
    tokens: [
      { kind: 'kw', value: 'on' },
      { kind: 'txt', value: '(' },
      { kind: 'id', value: 'submit' },
      { kind: 'txt', value: ')' },
    ],
  },
  {
    indent: 1,
    tokens: [
      { kind: 'id', value: 'persistPrompt' },
      { kind: 'txt', value: '(' },
      { kind: 'id', value: 'draft' },
      { kind: 'txt', value: ')' },
    ],
  },
  {
    indent: 1,
    tokens: [
      { kind: 'id', value: 'body' },
      { kind: 'txt', value: ' = ' },
      { kind: 'id', value: 'expandSkillMention' },
      { kind: 'txt', value: '(' },
      { kind: 'id', value: 'draft' },
      { kind: 'txt', value: ')' },
      { kind: 'cmt', value: '  # never send the raw slash' },
    ],
  },
  {
    indent: 1,
    tokens: [
      { kind: 'kw', value: 'if' },
      { kind: 'txt', value: ' ' },
      { kind: 'id', value: 'body' },
      { kind: 'txt', value: ' is empty' },
    ],
  },
  {
    indent: 2,
    tokens: [
      { kind: 'kw', value: 'return' },
      { kind: 'txt', value: ' ' },
      { kind: 'id', value: 'unchanged' },
    ],
  },
  {
    indent: 1,
    tokens: [
      { kind: 'id', value: 'session' },
      { kind: 'txt', value: ' = ' },
      { kind: 'id', value: 'launchAgent' },
      { kind: 'txt', value: '(' },
      { kind: 'id', value: 'body' },
      { kind: 'txt', value: ')' },
    ],
  },
  {
    indent: 1,
    tokens: [
      { kind: 'id', value: 'navigateToSession' },
      { kind: 'txt', value: '(' },
      { kind: 'id', value: 'session' },
      { kind: 'txt', value: ')' },
    ],
  },
  {
    indent: 1,
    tokens: [
      { kind: 'id', value: 'subscribeToEvents' },
      { kind: 'txt', value: '(' },
      { kind: 'id', value: 'session' },
      { kind: 'txt', value: ')' },
    ],
  },
]

export const MERMAID_CHART = `sequenceDiagram
    autonumber
    actor User
    participant Composer
    participant Expand as expandSkillMention
    participant Daemon
    User->>Composer: submit /show-me
    Composer->>Expand: expand mention
    Expand-->>Composer: skill body in prompt
    Composer->>Daemon: launchAgent(body)
    Daemon-->>Composer: stream events
    Composer->>User: navigate + subscribe`

export type DiffOp = 'same' | 'add' | 'del'

export type DiffLine = { op: DiffOp; text: string }

export const DIFF_SHAPES = ['call', 'component', 'file'] as const
export type DiffShape = (typeof DIFF_SHAPES)[number]

export const DIFFS: Record<DiffShape, { label: string; blurb: string; lines: DiffLine[] }> = {
  call: {
    label: 'Call tree',
    blurb: 'Insert expand before launch; keep navigate and add subscribe.',
    lines: [
      { op: 'same', text: 'submitForm' },
      { op: 'same', text: '  createSession' },
      { op: 'same', text: '    persistPrompt' },
      { op: 'add', text: '    expandSkillMention' },
      { op: 'same', text: '    launchAgent' },
      { op: 'del', text: '  navigateToSession' },
      { op: 'add', text: '  navigateToSession' },
      { op: 'add', text: '    subscribeToEvents' },
    ],
  },
  component: {
    label: 'Component',
    blurb: 'Mention field gains the expander; the session page gains an events hook.',
    lines: [
      { op: 'same', text: '<Composer>' },
      { op: 'same', text: '  usePromptDraft()' },
      { op: 'same', text: '  <SkillMentionField>' },
      { op: 'add', text: '    expandSkillMention()' },
      { op: 'same', text: '  <LaunchButton>' },
      { op: 'same', text: '<SessionPage>' },
      { op: 'add', text: '  useSessionEvents()' },
      { op: 'same', text: '  <SessionToolbar>' },
    ],
  },
  file: {
    label: 'File',
    blurb: 'A new expand command; subscribe lives next to the stream client.',
    lines: [
      { op: 'same', text: 'src/' },
      { op: 'same', text: '├── commands/' },
      { op: 'add', text: '│   └── expand.ts       # slash → skill body' },
      { op: 'same', text: '├── sessions/' },
      { op: 'same', text: '│   └── launch.ts' },
      { op: 'del', text: '└── transport.ts' },
      { op: 'add', text: '└── transport/' },
      { op: 'add', text: '    ├── client.ts' },
      { op: 'add', text: '    └── subscribe.ts' },
    ],
  },
}

export function formatById(id: FormatId): FormatMeta {
  const found = FORMATS.find((item) => item.id === id)
  if (!found) throw new Error(`Unknown format ${id}`)
  return found
}

export function nextFormat(id: FormatId, delta: number): FormatId {
  const index = FORMATS.findIndex((item) => item.id === id)
  const next = (index + delta + FORMATS.length) % FORMATS.length
  return FORMATS[next].id
}
