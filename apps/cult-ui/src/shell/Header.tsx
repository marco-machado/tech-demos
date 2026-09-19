import { ArrowUpRight } from 'lucide-react'

function KilnMark() {
  return (
    <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 32 32">
      <rect fill="#1a1816" height="32" rx="9" width="32" />
      <rect height="31" rx="8.5" stroke="rgba(243,238,230,0.1)" width="31" x="0.5" y="0.5" />
      <path
        d="M8 22c2-7 5.5-12 8-12s6 5 8 12"
        stroke="#e8a45a"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <circle cx="16" cy="22" fill="#7ec8c4" r="2.2" />
    </svg>
  )
}

const LINKS = [
  { label: 'cult-ui.com', href: 'https://cult-ui.com' },
  { label: 'Source', href: 'https://github.com/nolly-studio/cult-ui' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-[color-mix(in_srgb,var(--bg)_78%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 sm:px-6">
        <a className="flex items-center gap-2.5 rounded-md" href="#top">
          <KilnMark />
          <span className="flex items-baseline gap-2">
            <span className="text-[14px] font-medium tracking-[-0.01em]">Kiln</span>
            <span aria-hidden="true" className="text-faint">
              /
            </span>
            <span className="mono text-[12px] text-quiet">cult-ui</span>
          </span>
        </a>
        <nav aria-label="External" className="flex items-center gap-1">
          {LINKS.map((link) => (
            <a
              className="group flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[13px] text-quiet transition-colors duration-150 ease-out hover:bg-white/[0.04] hover:text-[var(--text)]"
              href={link.href}
              key={link.href}
              rel="noreferrer"
              target="_blank"
            >
              {link.label}
              <ArrowUpRight
                className="size-3.5 text-faint transition-[color,transform] duration-150 ease-out group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-[var(--text)]"
                strokeWidth={2}
              />
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
