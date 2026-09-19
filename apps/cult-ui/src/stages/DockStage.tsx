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
  { src: 'dock-mint.svg', icon: CircleIcon },
  { src: 'dock-hop.svg', icon: SquareIcon },
  { src: 'dock-wisteria.svg', icon: PentagonIcon },
  { src: 'dock-sky.svg', icon: HexagonIcon },
  { src: 'dock-tumble.svg', icon: OctagonIcon },
  null,
  { src: 'dock-perfume.svg', icon: BlocksIcon },
] as const

export function DockStage() {
  return (
    <div className="flex min-h-[180px] w-full items-end justify-center pb-4">
      <Dock>
        {TILES.map((tile, index) =>
          tile ? (
            <DockCard id={`${index}`} key={tile.src}>
              <DockCardInner id={`${index}`} src={asset(tile.src)}>
                <tile.icon className="h-8 w-8 rounded-full fill-black stroke-black" />
              </DockCardInner>
            </DockCard>
          ) : (
            <DockDivider key="divider" />
          ),
        )}
      </Dock>
    </div>
  )
}
