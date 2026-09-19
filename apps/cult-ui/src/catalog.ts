export const PIECES = [
  {
    id: 'shift',
    label: 'Shift Card',
    hint: 'Hover to reveal the share sheet',
    blurb: 'A card that lifts its middle still and unfolds extra detail on hover.',
  },
  {
    id: 'texture-button',
    label: 'Texture Button',
    hint: 'Press any glaze to hear the bevel',
    blurb: 'Beveled, layered buttons with primary, accent, destructive, and icon finishes.',
  },
  {
    id: 'texture-card',
    label: 'Texture Card',
    hint: 'Fill the slip and continue',
    blurb: 'Nested stone borders that catch light like fired clay.',
  },
  {
    id: 'expandable',
    label: 'Expandable',
    hint: 'Click the meeting to expand',
    blurb: 'A hover-or-click card that grows and fades in hidden rows.',
  },
  {
    id: 'family',
    label: 'Family Button',
    hint: 'Open the plus, then pick a glaze',
    blurb: 'A plus control that springs into a compact family panel.',
  },
  {
    id: 'dock',
    label: 'Dock',
    hint: 'Sweep the icons, click to bounce',
    blurb: 'A magnification dock with bounce-on-open tiles.',
  },
] as const

export type PieceId = (typeof PIECES)[number]['id']
