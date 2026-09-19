import { useState, type FormEvent } from 'react'
import { ArrowRight, Flame } from 'lucide-react'
import { TextureButton } from '../components/ui/texture-button'
import {
  TextureCardContent,
  TextureCardFooter,
  TextureCardHeader,
  TextureCardStyled,
  TextureCardTitle,
  TextureSeparator,
} from '../components/ui/texture-card'

export function TextureCardStage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  function submit() {
    setStatus(name.trim() && email.trim() ? `welcome, ${name.trim()}` : 'need a name and email')
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    submit()
  }

  return (
    <TextureCardStyled className="w-[min(100%,380px)]">
      <TextureCardHeader className="flex flex-col items-center justify-center gap-1 p-4">
        <div className="mb-3 rounded-full bg-neutral-950 p-3">
          <Flame className="h-7 w-7 stroke-neutral-200" />
        </div>
        <TextureCardTitle>Join the firing</TextureCardTitle>
        <p className="text-center text-sm">Leave a slip. We will glaze it later.</p>
      </TextureCardHeader>
      <TextureSeparator />
      <TextureCardContent>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <label className="block text-sm">
            Name
            <input
              className="mt-1 w-full rounded-md border border-neutral-300 bg-white/80 px-4 py-2 placeholder-neutral-400 dark:border-neutral-700 dark:bg-neutral-800/80 dark:placeholder-neutral-500"
              onChange={(event) => setName(event.target.value)}
              placeholder="Marco"
              value={name}
            />
          </label>
          <label className="block text-sm">
            Email
            <input
              className="mt-1 w-full rounded-md border border-neutral-300 bg-white/80 px-4 py-2 placeholder-neutral-400 dark:border-neutral-700 dark:bg-neutral-800/80 dark:placeholder-neutral-500"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@kiln.studio"
              type="email"
              value={email}
            />
          </label>
          <p className="mono text-center text-[11px] text-neutral-400">
            {status === 'idle' ? 'form is waiting' : status}
          </p>
        </form>
      </TextureCardContent>
      <TextureSeparator />
      <TextureCardFooter className="rounded-b-sm border-b">
        <TextureButton className="w-full" onClick={submit} variant="accent">
          <div className="flex items-center justify-center gap-1">
            Continue
            <ArrowRight className="mt-[1px] h-4 w-4 text-neutral-50" />
          </div>
        </TextureButton>
      </TextureCardFooter>
    </TextureCardStyled>
  )
}
