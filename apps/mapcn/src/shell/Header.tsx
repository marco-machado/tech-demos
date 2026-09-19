import { ArrowUpRight, Moon, Sun } from 'lucide-react'
import { useTheme } from '../lib/theme'

function MeridianMark() {
  return (
    <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 32 32">
      <rect fill="#0c1016" height="32" rx="9" width="32" />
      <rect height="31" rx="8.5" stroke="rgba(232,238,246,0.1)" width="31" x="0.5" y="0.5" />
      <circle cx="16" cy="16" r="9" stroke="#5eead4" strokeWidth="1.5" />
      <path d="M16 7v18M7 16h18" stroke="#e4b86a" strokeLinecap="round" strokeWidth="1.25" />
      <circle cx="16" cy="16" fill="#7aa2ff" r="2" />
    </svg>
  )
}

const LINKS = [
  { label: 'mapcn.dev', href: 'https://mapcn.dev' },
  { label: 'Source', href: 'https://github.com/AnmolSaini16/mapcn' },
]

export function Header() {
  const { theme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-[color-mix(in_srgb,var(--bg)_78%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-6">
        <a className="flex items-center gap-2.5 rounded-md" href="#top">
          <MeridianMark />
          <span className="flex items-baseline gap-2">
            <span className="text-[14px] font-medium tracking-[-0.01em]">Meridian</span>
            <span aria-hidden="true" className="text-faint">
              /
            </span>
            <span className="mono text-[12px] text-quiet">mapcn</span>
          </span>
        </a>
        <div className="flex items-center gap-1">
          <nav aria-label="External" className="hidden items-center gap-1 sm:flex">
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
          <button
            aria-label={theme === 'dark' ? 'Switch to light tiles' : 'Switch to dark tiles'}
            className="ml-1 inline-flex size-9 items-center justify-center rounded-md border border-line bg-white/[0.03] text-quiet transition-colors hover:text-[var(--text)]"
            onClick={toggle}
            type="button"
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}
