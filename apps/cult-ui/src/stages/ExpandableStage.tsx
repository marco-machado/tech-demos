import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import {
  Expandable,
  ExpandableCard,
  ExpandableCardContent,
  ExpandableCardFooter,
  ExpandableCardHeader,
  ExpandableContent,
  ExpandableTrigger,
} from '../components/ui/expandable'

const ATTENDEES = ['Ada', 'Nico', 'Jun', 'Ivy']

export function ExpandableStage() {
  return (
    <Expandable expandBehavior="replace" expandDirection="both" initialDelay={0.1}>
      {({ isExpanded }) => (
        <ExpandableTrigger>
          <ExpandableCard
            className="relative w-full"
            collapseDelay={200}
            collapsedSize={{ width: 320, height: 232 }}
            expandDelay={80}
            expandedSize={{ width: 420, height: 430 }}
            hoverToExpand={false}
          >
            <ExpandableCardHeader>
              <div className="flex w-full items-start justify-between">
                <div className="flex flex-col items-start">
                  <span className="mb-2 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-600 dark:bg-red-900 dark:text-red-100">
                    In 15 mins
                  </span>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Design Sync
                  </h3>
                </div>
                <span className="grid size-8 place-items-center rounded-md border border-border">
                  <Calendar className="h-4 w-4" />
                </span>
              </div>
            </ExpandableCardHeader>
            <ExpandableCardContent>
              <div className="mb-4 flex flex-col items-start justify-between">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>1:30PM → 2:30PM</span>
                </div>
                <ExpandableContent preset="blur-md">
                  <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>Conference Room A</span>
                  </div>
                </ExpandableContent>
              </div>
              <ExpandableContent preset="blur-md" stagger staggerChildren={0.16}>
                <p className="mb-4 text-sm text-gray-700 dark:text-gray-200">
                  Weekly design sync for glaze tests, type ramps, and the Cult
                  pieces on this stage.
                </p>
                <div>
                  <h4 className="mb-2 flex items-center text-sm font-medium text-gray-800 dark:text-gray-100">
                    <Users className="mr-2 h-4 w-4" />
                    Attendees
                  </h4>
                  <div className="flex -space-x-2 overflow-hidden">
                    {ATTENDEES.map((name) => (
                      <span
                        className="grid size-8 place-items-center rounded-full border-2 border-white bg-neutral-800 text-[11px] text-white dark:border-gray-800"
                        key={name}
                      >
                        {name[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </ExpandableContent>
            </ExpandableCardContent>
            <ExpandableCardFooter>
              <p className="text-[12px] text-muted-foreground">
                {isExpanded ? 'Click again to fold' : 'Click to expand'}
              </p>
            </ExpandableCardFooter>
          </ExpandableCard>
        </ExpandableTrigger>
      )}
    </Expandable>
  )
}
