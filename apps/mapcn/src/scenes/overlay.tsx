import { cn } from '../lib/utils'
import type { ReactNode } from 'react'

export function OverlayPanel({
  children,
  className,
  position = 'left',
}: {
  children: ReactNode
  className?: string
  position?: 'left' | 'right' | 'bottom'
}) {
  const pos =
    position === 'left'
      ? 'top-3 left-3'
      : position === 'right'
        ? 'top-3 right-3'
        : 'bottom-3 left-3 right-3 sm:right-auto'

  return (
    <div
      className={cn(
        'absolute z-10 max-w-[min(100%-1.5rem,20rem)] rounded-xl border border-border bg-background/90 p-3 shadow-lg backdrop-blur-md',
        pos,
        className,
      )}
    >
      {children}
    </div>
  )
}

export function OverlayButton({
  active,
  children,
  onClick,
}: {
  active?: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] transition-colors',
        active ? 'bg-muted text-foreground' : 'text-quiet hover:bg-muted/60 hover:text-foreground',
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}
