import {
  minimalGraph,
  postmarkRefactorGraph,
} from '@coldtea/pr-lens-schema/examples'

export type SampleId = 'postmark' | 'minimal'

export type Graph = typeof postmarkRefactorGraph
export type GraphView = Graph['views'][number]

export type Sample = {
  id: SampleId
  label: string
  kicker: string
  doc: Graph
}

export const SAMPLES: readonly Sample[] = [
  {
    id: 'postmark',
    label: 'Batch broadcasts',
    kicker: 'Postmark refactor',
    doc: postmarkRefactorGraph,
  },
  {
    id: 'minimal',
    label: 'Health check',
    kicker: 'Smallest valid graph',
    doc: minimalGraph as Graph,
  },
]

export function sampleById(id: SampleId): Sample {
  return SAMPLES.find((sample) => sample.id === id) ?? SAMPLES[0]
}

export function flattenViews(views: readonly GraphView[]): GraphView[] {
  return views.flatMap((view) => [view, ...flattenViews(view.children)])
}

export function architectureViews(doc: Graph) {
  return flattenViews(doc.views).filter((view) => view.lens === 'architecture')
}

export function hasLens(doc: Graph, lens: 'architecture' | 'data-flow') {
  return doc.lenses.includes(lens)
}
