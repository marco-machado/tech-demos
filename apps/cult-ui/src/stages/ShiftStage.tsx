import { motion } from 'motion/react'
import { ShiftCard } from '../components/ui/shift-card'
import { TextureButton } from '../components/ui/texture-button'
import { asset } from '../lib/utils'

export function ShiftStage() {
  const capture = asset('capture.svg')

  const topContent = (
    <div className="rounded-md bg-accent/90 text-primary shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)]">
      <h3 className="p-4 text-lg">Kiln still</h3>
    </div>
  )

  const topAnimateContent = (
    <>
      <motion.img
        alt="Still"
        className="absolute top-1.5 right-2 rounded-sm shadow-lg"
        height={100}
        layoutId="kiln-still"
        src={capture}
        transition={{ duration: 0.3, ease: 'circIn' }}
        width={78}
      />
      <motion.div
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          transition: { delay: 0.35, duration: 0.15 },
        }}
        className="absolute top-[4px] right-[6px] mb-[6px] ml-auto h-[70px] w-[82px] rounded-sm border-[2px] border-dashed border-neutral-800/80 bg-transparent dark:mb-[3px] dark:border-neutral-200/80"
        exit={{
          opacity: 0,
          y: 100,
          filter: 'blur(4px)',
          transition: { delay: 0.0, duration: 0 },
        }}
        initial={{ opacity: 0, scale: 1.6, y: 0, filter: 'blur(4px)' }}
      />
    </>
  )

  const middleContent = (
    <motion.img
      alt="Still"
      className="rounded-lg border-2 border-white dark:border-black"
      height={200}
      layoutId="kiln-still"
      src={capture}
      width={150}
    />
  )

  const bottomContent = (
    <div className="flex w-full flex-col gap-1 rounded-t-xs border-t border-t-black/10 bg-primary/90 px-4 pb-6">
      <p className="flex items-center gap-1 pt-1.5 font-sans text-[14px] font-medium text-white dark:text-[#171717]">
        Share the firing
      </p>
      <p className="w-full pb-2 text-pretty font-sans text-[13px] leading-4 text-neutral-200 dark:text-[#171717]">
        Hover lifts the still and opens a share tray — the Cult Shift Card move.
      </p>
      <div className="flex flex-col gap-1 rounded-xl bg-accent/80 px-1 py-1 dark:bg-accent">
        <TextureButton variant="primary">Post the still</TextureButton>
        <TextureButton variant="primary">Keep in kiln</TextureButton>
      </div>
    </div>
  )

  return (
    <ShiftCard
      className="bg-card dark:bg-[#1A1A1A]"
      bottomContent={bottomContent}
      middleContent={middleContent}
      topAnimateContent={topAnimateContent}
      topContent={topContent}
    />
  )
}
