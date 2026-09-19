import { Calendar, ChevronDown, Clock, MapPin, Users, Video } from 'lucide-react'
import { motion } from 'motion/react'
import {
  Expandable,
  ExpandableCard,
  ExpandableCardContent,
  ExpandableCardFooter,
  ExpandableCardHeader,
  ExpandableContent,
  ExpandableTrigger,
} from '../components/ui/expandable'
import { TextureButton } from '../components/ui/texture-button'

const ATTENDEES = [
  { name: 'Ada', tone: '#e8a45a' },
  { name: 'Nico', tone: '#7ec8c4' },
  { name: 'Jun', tone: '#c45c4a' },
  { name: 'Ivy', tone: '#b7a2d6' },
]

export function ExpandableStage() {
  return (
    <Expandable
      easeType={[0.16, 1, 0.3, 1]}
      expandBehavior="replace"
      expandDirection="both"
      transitionDuration={0.32}
    >
      {({ isExpanded }) => (
        <ExpandableTrigger>
          {/* Upstream draws the visible card at wrapper width − 4rem (md), so the wrapper is
              sized 64px wider than the 320 / 420 card we want; heights match measured content. */}
          <ExpandableCard
            className="relative w-full"
            collapsedSize={{ width: 384, height: 217 }}
            expandedSize={{ width: 484, height: 411 }}
            hoverToExpand={false}
          >
            <ExpandableCardHeader className="px-5 pt-5 pb-3">
              <div className="flex w-full items-start justify-between">
                <div className="flex flex-col items-start">
                  <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-ember/12 px-2 py-0.5 text-[11px] font-medium text-ember">
                    <span className="size-1.5 rounded-full bg-ember" />
                    In 15 mins
                  </span>
                  <h3 className="text-[19px] leading-6 font-semibold tracking-[-0.01em] text-[var(--text)]">
                    Design Sync
                  </h3>
                </div>
                <span className="grid size-8 place-items-center rounded-[9px] border border-white/[0.08] bg-white/[0.04] text-quiet shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                  <Calendar className="size-4" strokeWidth={1.75} />
                </span>
              </div>
            </ExpandableCardHeader>

            <ExpandableCardContent className="px-5 pb-0">
              <div className="mb-2 flex flex-col items-start gap-1.5">
                <div className="flex items-center gap-2 text-[13.5px] text-quiet">
                  <Clock className="size-3.5 text-faint" strokeWidth={1.75} />
                  <span className="tabular-nums">1:30 → 2:30 PM</span>
                </div>
                <ExpandableContent preset="blur-sm">
                  <div className="flex items-center gap-2 text-[13.5px] text-quiet">
                    <MapPin className="size-3.5 text-faint" strokeWidth={1.75} />
                    <span>Conference Room A</span>
                  </div>
                </ExpandableContent>
              </div>

              <ExpandableContent preset="blur-sm" stagger staggerChildren={0.08}>
                <p className="mb-4 text-[13.5px] leading-[1.55] text-pretty text-[var(--text)]/85">
                  Weekly design sync for glaze tests, type ramps, and the Cult pieces on this
                  stage.
                </p>
                <div className="mb-4">
                  <h4 className="mb-2 flex items-center gap-2 text-[12px] font-medium tracking-[0.02em] text-quiet uppercase">
                    <Users className="size-3.5 text-faint" strokeWidth={1.75} />
                    Attendees
                  </h4>
                  <div className="flex -space-x-2">
                    {ATTENDEES.map((person) => (
                      <span
                        className="grid size-8 place-items-center rounded-full border-2 border-[var(--muted)] text-[11px] font-semibold text-ink"
                        key={person.name}
                        style={{ background: person.tone }}
                        title={person.name}
                      >
                        {person.name[0]}
                      </span>
                    ))}
                    <span className="grid size-8 place-items-center rounded-full border-2 border-[var(--muted)] bg-[#302b27] text-[10.5px] font-medium text-quiet">
                      +2
                    </span>
                  </div>
                </div>
                <TextureButton
                  onClick={(event) => event.stopPropagation()}
                  variant="primary"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Video className="size-4" strokeWidth={2} />
                    Join call
                  </span>
                </TextureButton>
              </ExpandableContent>
            </ExpandableCardContent>

            <ExpandableCardFooter className="justify-between px-5 pt-2 pb-4">
              <p className="text-[12px] text-faint">
                {isExpanded ? 'Click again to fold' : 'Click to expand'}
              </p>
              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                className="grid size-6 place-items-center rounded-full bg-white/[0.05] text-quiet"
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <ChevronDown className="size-3.5" strokeWidth={2} />
              </motion.span>
            </ExpandableCardFooter>
          </ExpandableCard>
        </ExpandableTrigger>
      )}
    </Expandable>
  )
}
