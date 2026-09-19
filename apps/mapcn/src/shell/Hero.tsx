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

const FACTS = ['5 scenes', 'MIT', 'MapLibre 6', 'React 19', 'Bun · Vite']

export function Hero() {
  return (
    <section className="pt-12 pb-8 sm:pt-16 sm:pb-10">
      <motion.p
        animate="show"
        className="mono text-[11px] tracking-[0.18em] text-signal uppercase"
        custom={0}
        initial="hidden"
        variants={rise}
      >
        MapCN · markers · routes · controls · tiles
      </motion.p>
      <motion.h1
        animate="show"
        className="display mt-4 max-w-3xl text-[clamp(2.4rem,5.2vw,3.8rem)] leading-[1] font-normal tracking-[-0.015em] text-balance"
        custom={1}
        initial="hidden"
        variants={rise}
      >
        MapCN, plotted on a meridian.
      </motion.h1>
      <motion.p
        animate="show"
        className="mt-5 max-w-[36rem] text-[15px] leading-[1.6] text-quiet sm:text-[16px]"
        custom={2}
        initial="hidden"
        variants={rise}
      >
        Official{' '}
        <a className="link" href="https://mapcn.dev" rel="noreferrer" target="_blank">
          mapcn.dev
        </a>{' '}
        components — not a wrapper we invented — on a dark stage. Click pins, scrub a route,
        drive the control stack, and flip Carto tiles with the theme.
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
