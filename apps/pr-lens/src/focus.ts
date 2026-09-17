import type { RenderAtlas } from '@coldtea/pr-lens-renderer'
import { unionBoxes, type Box } from './camera.ts'
import { architectureViews, flattenViews, type Graph } from './samples.ts'

export type LensName = 'architecture' | 'data-flow'

export type StageTarget = {
  lens: LensName
  view: string | undefined
}

export type Step = NonNullable<Graph['walkthrough']>['steps'][number]

export function defaultTarget(doc: Graph, lens: LensName): StageTarget {
  if (lens === 'data-flow') {
    return { lens, view: undefined }
  }
  const overview = architectureViews(doc)[0]
  return { lens: 'architecture', view: overview?.id }
}

export function targetForStep(doc: Graph, step: Step): StageTarget {
  const stage = step.stage
  if (stage === undefined) return defaultTarget(doc, 'architecture')
  if (stage.kind === 'flow') {
    return { lens: 'data-flow', view: undefined }
  }
  const match = flattenViews(doc.views).find((view) => view.id === stage.view)
  if (match?.lens === 'data-flow') {
    return { lens: 'data-flow', view: undefined }
  }
  return { lens: 'architecture', view: stage.view }
}

export function flowIdForStep(step: Step | undefined) {
  if (step?.stage?.kind === 'flow') return step.stage.flow
  return undefined
}

export function focusBoxes(atlas: RenderAtlas, step: Step | undefined): Box[] {
  if (step === undefined || step.focus === undefined || step.focus.kind === 'all') {
    return []
  }

  const boxes: Box[] = []
  const flow = flowIdForStep(step)

  const push = (box: Box | undefined) => {
    if (box) boxes.push(box)
  }

  for (const id of step.focus.lanes ?? []) push(atlas.lanes[id])
  for (const id of step.focus.nodes ?? []) push(atlas.nodes[id])
  for (const id of step.focus.edges ?? []) push(atlas.edges[id])
  for (const id of step.focus.messages ?? []) {
    if (flow !== undefined) {
      push(atlas.messages[flow]?.[id])
      continue
    }
    for (const messages of Object.values(atlas.messages)) {
      push(messages[id])
    }
  }

  return boxes
}

export function frameBox(
  atlas: RenderAtlas,
  picture: { width: number; height: number },
  step: Step | undefined,
): Box {
  const focused = unionBoxes(focusBoxes(atlas, step))
  if (focused) {
    const pad = 28
    return {
      x: focused.x - pad,
      y: focused.y - pad,
      width: focused.width + pad * 2,
      height: focused.height + pad * 2,
    }
  }
  return { x: 0, y: 0, width: picture.width, height: picture.height }
}
