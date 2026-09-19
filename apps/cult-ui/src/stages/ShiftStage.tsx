import { Flame, Share2 } from 'lucide-react'
import { motion } from 'motion/react'
import { ShiftCard } from '../components/ui/shift-card'
import { TextureButton } from '../components/ui/texture-button'
import { asset } from '../lib/utils'

// Thumbnail geometry: the still shrinks into the header's top-right corner and a
// dashed "drop frame" sits 4px outside it on every side, so both stay concentric.
const THUMB = { width: 62, height: 80, top: 6, right: 8 }
const FRAME = {
  width: THUMB.width + 8,
  height: THUMB.height + 8,
  top: THUMB.top - 4,
  right: THUMB.right - 4,
}

export function ShiftStage() {
  const capture = asset('capture.svg')

  const topContent = (
    <div className="flex h-11 items-center gap-2.5 rounded-lg bg-[#231c17] pr-3.5 pl-3 text-[var(--text)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(0,0,0,0.35)]">
      <span className="grid size-6 place-items-center rounded-md bg-ember/15 text-ember">
        <Flame className="size-3.5" strokeWidth={2} />
      </span>
      <span className="text-[14px] font-medium tracking-[-0.005em]">Kiln still</span>
      <span className="mono ml-auto text-[10.5px] text-quiet">№ 07</span>
    </div>
  )

  const topAnimateContent = (
    <>
      <motion.img
        alt="Still"
        className="absolute rounded-[5px] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.7)]"
        height={THUMB.height}
        layoutId="kiln-still"
        src={capture}
        style={{ top: THUMB.top, right: THUMB.right }}
        transition={{ duration: 0.3, ease: 'circIn' }}
        width={THUMB.width}
      />
      <motion.div
        animate={{
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          transition: { delay: 0.32, duration: 0.18, ease: [0.16, 1, 0.3, 1] },
        }}
        className="absolute rounded-[8px] border-2 border-dashed border-paper/70"
        exit={{ opacity: 0, transition: { duration: 0 } }}
        initial={{ opacity: 0, scale: 1.25, filter: 'blur(4px)' }}
        style={{
          top: FRAME.top,
          right: FRAME.right,
          width: FRAME.width,
          height: FRAME.height,
        }}
      />
    </>
  )

  const middleContent = (
    <motion.img
      alt="Still"
      className="rounded-lg shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_16px_40px_-16px_rgba(0,0,0,0.8)]"
      height={200}
      layoutId="kiln-still"
      src={capture}
      width={150}
    />
  )

  const bottomContent = (
    <div className="flex w-full flex-col rounded-t-[12px] bg-paper px-4 pb-4 text-ink shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7)]">
      <p className="flex items-center gap-1.5 pt-2.5 text-[14px] leading-5 font-medium">
        <Share2 className="size-3.5 text-[#8a4e2a]" strokeWidth={2.25} />
        Share the firing
      </p>
      <p className="mt-1 mb-3 text-[13px] leading-[1.4] text-pretty text-[#6a6259]">
        The still lifts into the corner and this sheet slides up — the Cult Shift Card move.
      </p>
      <div className="flex flex-col gap-1.5 rounded-[12px] bg-black/[0.06] p-1.5">
        <TextureButton size="sm" variant="minimal">
          <span className="text-neutral-100">Post the still</span>
        </TextureButton>
        <TextureButton size="sm" variant="minimal">
          <span className="text-neutral-100">Keep in kiln</span>
        </TextureButton>
      </div>
    </div>
  )

  return (
    <ShiftCard
      bottomContent={bottomContent}
      className="bg-[linear-gradient(180deg,#1c1917_0%,#161311_100%)]"
      middleContent={middleContent}
      topAnimateContent={topAnimateContent}
      topContent={topContent}
    />
  )
}
