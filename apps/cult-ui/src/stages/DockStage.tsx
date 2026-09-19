import {
  BlocksIcon,
  CircleIcon,
  HexagonIcon,
  OctagonIcon,
  PentagonIcon,
  SquareIcon,
} from 'lucide-react'
import { Dock, DockCard, DockCardInner, DockDivider } from '../components/ui/dock'
import { asset } from '../lib/utils'

const TILES = [
  { src: 'dock-mint.svg', name: 'Mint', icon: CircleIcon },
  { src: 'dock-hop.svg', name: 'Hop', icon: SquareIcon },
  { src: 'dock-wisteria.svg', name: 'Wisteria', icon: PentagonIcon },
  { src: 'dock-sky.svg', name: 'Sky', icon: HexagonIcon },
  { src: 'dock-tumble.svg', name: 'Tumble', icon: OctagonIcon },
  null,
  { src: 'dock-perfume.svg', name: 'Perfume', icon: BlocksIcon },
] as const

export function DockStage() {
  return (
    <div className="relative h-[320px] w-full max-w-[620px] overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#151210] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_30px_80px_-40px_rgba(0,0,0,0.9)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_0%,rgba(232,164,90,0.22),transparent_60%),radial-gradient(60%_50%_at_90%_20%,rgba(126,200,196,0.14),transparent_60%),radial-gradient(80%_60%_at_50%_110%,rgba(183,162,214,0.16),transparent_60%),linear-gradient(180deg,#1a1614_0%,#100e0d_100%)]" />
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.09]" />

      <div className="mono relative flex items-center justify-between px-4 py-2.5 text-[10.5px] tracking-[0.04em] text-white/45">
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-ember/80" />
          Kiln OS
        </span>
        <span className="tabular-nums">Sat 9:41</span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[38%] flex justify-center">
        <p className="mono text-[10.5px] tracking-[0.16em] text-white/25 uppercase">
          sweep · click a tile to launch · click again to quit
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-4 flex justify-center">
        <Dock className="rounded-2xl border border-white/[0.08] bg-neutral-900/70 backdrop-blur-md dark:bg-neutral-900/70 dark:hover:bg-neutral-900/80">
          {TILES.map((tile, index) =>
            tile ? (
              <DockCard id={`${index}`} key={tile.src}>
                <DockCardInner id={`${index}`} src={asset(tile.src)}>
                  <tile.icon className="size-7 fill-black/80 stroke-black/80" strokeWidth={1.5} />
                </DockCardInner>
              </DockCard>
            ) : (
              <DockDivider key="divider" />
            ),
          )}
        </Dock>
      </div>
    </div>
  )
}
