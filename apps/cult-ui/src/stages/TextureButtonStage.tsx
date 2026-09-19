import { ChevronLeft, Trash2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { TextureButton } from '../components/ui/texture-button'

const VARIANTS = ['primary', 'accent', 'destructive', 'secondary', 'minimal'] as const
const SIZES = ['sm', 'default', 'lg'] as const
const ICONS = [
  { id: 'back', label: 'Back', Icon: ChevronLeft },
  { id: 'trash', label: 'Trash', Icon: Trash2 },
  { id: 'close', label: 'Close', Icon: X },
] as const

export function TextureButtonStage() {
  const [presses, setPresses] = useState<{ id: string; count: number }>({
    id: 'nothing yet',
    count: 0,
  })
  const press = (id: string) => setPresses((prev) => ({ id, count: prev.count + 1 }))

  return (
    <div className="w-full max-w-[720px]">
      <div className="rounded-[18px] border border-line bg-white/[0.02] px-5 py-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)] sm:px-6">
        <Row label="variant">
          {VARIANTS.map((variant) => (
            <div className="w-[6.75rem]" key={variant}>
              <TextureButton onClick={() => press(variant)} variant={variant}>
                <span className="capitalize">{variant}</span>
              </TextureButton>
            </div>
          ))}
        </Row>
        <Row label="size">
          {SIZES.map((size) => (
            <div
              className={size === 'sm' ? 'w-[6rem]' : size === 'lg' ? 'w-[9rem]' : 'w-[7.5rem]'}
              key={size}
            >
              <TextureButton onClick={() => press(`size ${size}`)} size={size} variant="primary">
                {size === 'default' ? 'Default' : size === 'sm' ? 'Small' : 'Large'}
              </TextureButton>
            </div>
          ))}
        </Row>
        <Row label="icon">
          {ICONS.map(({ id, label, Icon }) => (
            <TextureButton
              aria-label={label}
              key={id}
              onClick={() => press(id)}
              size="icon"
              variant="icon"
            >
              <Icon className="size-7 p-1.5 text-neutral-200" strokeWidth={1.75} />
            </TextureButton>
          ))}
        </Row>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="mono inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] py-1.5 pr-3.5 pl-3 text-[11px] tracking-[0.04em] text-quiet">
          <span className="relative flex size-1.5">
            <AnimatePresence>
              {presses.count > 0 ? (
                <motion.span
                  animate={{ scale: 2.8, opacity: 0 }}
                  className="absolute inset-0 rounded-full bg-ember"
                  exit={{ opacity: 0 }}
                  initial={{ scale: 1, opacity: 0.7 }}
                  key={presses.count}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              ) : null}
            </AnimatePresence>
            <span
              className={`relative size-1.5 rounded-full transition-colors duration-300 ${
                presses.count > 0 ? 'bg-ember' : 'bg-faint'
              }`}
            />
          </span>
          <span className="uppercase">last press</span>
          <span className="text-faint">·</span>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              animate={{ opacity: 1, y: 0 }}
              className="text-[var(--text)]"
              exit={{ opacity: 0, y: -6 }}
              initial={{ opacity: 0, y: 6 }}
              key={`${presses.id}-${presses.count}`}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {presses.id}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[4rem_1fr] items-center gap-4 border-b border-line py-4 last:border-b-0">
      <span className="mono text-[10.5px] tracking-[0.16em] text-faint uppercase">{label}</span>
      <div className="flex flex-wrap items-center gap-2.5">{children}</div>
    </div>
  )
}
