import { motion, type Variants } from 'motion/react'

const EASE_OUT = [0.16, 1, 0.3, 1] as const

const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT, delay: 0.05 + i * 0.07 },
  }),
}

const FACTS = ['6 pieces', 'MIT', 'motion', 'React 19', 'Bun · Vite']

export function Hero() {
  return (
    <section className="pt-14 pb-10 sm:pt-20 sm:pb-14">
      <motion.p
        animate="show"
        className="mono text-[11px] tracking-[0.18em] text-ember uppercase"
        custom={0}
        initial="hidden"
        variants={rise}
      >
        Cult UI · six free pieces · one stage
      </motion.p>
      <motion.h1
        animate="show"
        className="display mt-4 max-w-3xl text-[clamp(2.5rem,5.6vw,4rem)] leading-[1] font-normal tracking-[-0.015em] text-balance"
        custom={1}
        initial="hidden"
        variants={rise}
      >
        Cult UI, fired in a kiln.
      </motion.h1>
      <motion.p
        animate="show"
        className="mt-5 max-w-[34rem] text-[15px] leading-[1.6] text-quiet sm:text-[16px]"
        custom={2}
        initial="hidden"
        variants={rise}
      >
        Six MIT components from{' '}
        <a className="link" href="https://cult-ui.com" rel="noreferrer" target="_blank">
          cult-ui.com
        </a>{' '}
        — Shift Card, Texture Button and Card, Expandable, Family Button and Dock — vendored
        as owned source and staged on one dark surface. Not Cult Pro.
      </motion.p>
      <motion.ul
        animate="show"
        className="mt-7 flex flex-wrap gap-2"
        custom={3}
        initial="hidden"
        variants={rise}
      >
        {FACTS.map((fact) => (
          <li
            className="mono rounded-full border border-line bg-white/[0.025] px-2.5 py-1 text-[11px] tracking-[0.02em] text-quiet"
            key={fact}
          >
            {fact}
          </li>
        ))}
      </motion.ul>
    </section>
  )
}
