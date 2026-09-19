export type InteractionMode = 'hover' | 'click' | 'type' | 'sweep'

export const PIECES = [
  {
    id: 'shift',
    label: 'Shift Card',
    title: 'Lift the still, unfold the share sheet.',
    hint: 'Hover the card',
    mode: 'hover',
    source: 'shift-card.tsx',
    built: 'AnimatePresence · shared layoutId',
  },
  {
    id: 'texture-button',
    label: 'Texture Button',
    title: 'Beveled buttons in six finishes.',
    hint: 'Press any button',
    mode: 'click',
    source: 'texture-button.tsx',
    built: 'cva variants · layered gradients',
  },
  {
    id: 'texture-card',
    label: 'Texture Card',
    title: 'Five nested hairlines, one card.',
    hint: 'Fill in the slip',
    mode: 'type',
    source: 'texture-card.tsx',
    built: 'concentric borders 24 → 20',
  },
  {
    id: 'expandable',
    label: 'Expandable',
    title: 'A meeting card that grows on demand.',
    hint: 'Click to expand',
    mode: 'click',
    source: 'expandable.tsx',
    built: 'useSpring · useMeasure',
  },
  {
    id: 'family',
    label: 'Family Button',
    title: 'A plus that springs into a panel.',
    hint: 'Open the plus, pick a glaze',
    mode: 'click',
    source: 'family-button.tsx',
    built: 'layout spring · layoutId toggle',
  },
  {
    id: 'dock',
    label: 'Dock',
    title: 'Magnify on sweep, bounce on launch.',
    hint: 'Sweep, then click a tile',
    mode: 'sweep',
    source: 'dock.tsx',
    built: 'useTransform · springs',
  },
] as const satisfies readonly {
  id: string
  label: string
  title: string
  hint: string
  mode: InteractionMode
  source: string
  built: string
}[]

export type PieceId = (typeof PIECES)[number]['id']
export type Piece = (typeof PIECES)[number]

export function isPieceId(value: string): value is PieceId {
  return PIECES.some((piece) => piece.id === value)
}
