import { useState } from 'react'
import { ChevronLeft, Trash, X } from 'lucide-react'
import { TextureButton } from '../components/ui/texture-button'

const VARIANTS = ['primary', 'accent', 'destructive', 'secondary', 'minimal'] as const

export function TextureButtonStage() {
  const [last, setLast] = useState('none yet')

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="mono text-[11px] tracking-[0.18em] text-[var(--quiet)] uppercase">
        last press · {last}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {VARIANTS.map((variant) => (
          <TextureButton
            key={variant}
            onClick={() => setLast(variant)}
            variant={variant}
          >
            {variant}
          </TextureButton>
        ))}
      </div>
      <div className="flex gap-3">
        <TextureButton
          onClick={() => setLast('back')}
          size="icon"
          variant="icon"
        >
          <ChevronLeft className="h-6 w-6 p-1" />
        </TextureButton>
        <TextureButton
          onClick={() => setLast('trash')}
          size="icon"
          variant="icon"
        >
          <Trash className="h-5 w-6 p-1" />
        </TextureButton>
        <TextureButton onClick={() => setLast('close')} size="icon" variant="icon">
          <X className="h-6 w-6 p-1" />
        </TextureButton>
      </div>
    </div>
  )
}
