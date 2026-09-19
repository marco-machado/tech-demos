import { ArrowRight, Check, Flame } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useId, useState, type FormEvent } from 'react'
import { TextureButton } from '../components/ui/texture-button'
import {
  TextureCardContent,
  TextureCardDescription,
  TextureCardFooter,
  TextureCardHeader,
  TextureCardStyled,
  TextureCardTitle,
  TextureSeparator,
} from '../components/ui/texture-card'

const INPUT =
  'mt-1.5 w-full rounded-[10px] border border-white/[0.08] bg-black/30 px-3.5 py-2.5 text-[14px] text-[var(--text)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.45)] outline-none transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-faint focus:border-ember/60 focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.45),0_0_0_3px_rgba(232,164,90,0.16)]'

type Status = { kind: 'idle' } | { kind: 'error'; text: string } | { kind: 'ok'; text: string }

export function TextureCardStage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const nameId = useId()
  const emailId = useId()

  function submit() {
    const trimmed = name.trim()
    if (trimmed && email.trim()) {
      setStatus({ kind: 'ok', text: `Welcome, ${trimmed} — your slip is in the kiln.` })
    } else {
      setStatus({ kind: 'error', text: 'A name and an email, please.' })
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    submit()
  }

  return (
    <TextureCardStyled className="w-[min(100%,360px)]">
      <TextureCardHeader className="flex flex-col items-center px-6 pt-7 pb-5 text-center">
        <span className="mb-4 grid size-12 place-items-center rounded-full bg-neutral-950 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_0_0_1px_rgba(255,255,255,0.05)]">
          <Flame className="size-5 text-ember" strokeWidth={1.75} />
        </span>
        <TextureCardTitle className="pl-0 text-[18px] tracking-[-0.01em]">
          Join the firing
        </TextureCardTitle>
        <TextureCardDescription className="mt-1 pl-0 text-[13.5px] text-quiet">
          Leave a slip. We glaze it later.
        </TextureCardDescription>
      </TextureCardHeader>
      <TextureSeparator />
      <TextureCardContent className="px-6 py-5">
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <label className="block text-[12.5px] font-medium text-quiet" htmlFor={nameId}>
            Name
            <input
              autoComplete="name"
              className={INPUT}
              id={nameId}
              onChange={(event) => setName(event.target.value)}
              placeholder="Marco"
              value={name}
            />
          </label>
          <label className="block text-[12.5px] font-medium text-quiet" htmlFor={emailId}>
            Email
            <input
              autoComplete="email"
              className={INPUT}
              id={emailId}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@kiln.studio"
              type="email"
              value={email}
            />
          </label>
          <button className="hidden" type="submit" />
        </form>
      </TextureCardContent>
      <TextureSeparator />
      <TextureCardFooter className="flex-col items-stretch gap-3 px-6 pt-4 pb-5">
        <TextureButton onClick={submit} variant="primary">
          <span className="flex items-center justify-center gap-1.5 font-medium">
            Continue
            <ArrowRight className="size-4" strokeWidth={2} />
          </span>
        </TextureButton>
        <div className="flex min-h-[18px] items-center justify-center">
          <AnimatePresence initial={false} mode="wait">
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className={`mono flex items-center gap-1.5 text-[11px] ${
                status.kind === 'ok'
                  ? 'text-glaze'
                  : status.kind === 'error'
                    ? 'text-clay'
                    : 'text-faint'
              }`}
              exit={{ opacity: 0, y: -4 }}
              initial={{ opacity: 0, y: 4 }}
              key={status.kind === 'idle' ? 'idle' : status.text}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {status.kind === 'ok' ? <Check className="size-3" strokeWidth={2.5} /> : null}
              {status.kind === 'idle' ? 'form is waiting' : status.text}
            </motion.p>
          </AnimatePresence>
        </div>
      </TextureCardFooter>
    </TextureCardStyled>
  )
}
