export type InteractionMode = 'click' | 'drag' | 'toggle' | 'sweep'

export const PIECES = [
  {
    id: 'pins',
    label: 'Pins',
    title: 'Markers with labels, tooltips, and popups.',
    hint: 'Click a pin or a row',
    mode: 'click',
    source: 'MapMarker',
    built: 'MarkerContent · MarkerPopup',
  },
  {
    id: 'route',
    label: 'Route',
    title: 'A polyline that reports how far you have gone.',
    hint: 'Scrub or play the run',
    mode: 'drag',
    source: 'MapRoute',
    built: 'RouteProgress · RouteMarker',
  },
  {
    id: 'controls',
    label: 'Controls',
    title: 'Zoom, compass, locate, fullscreen.',
    hint: 'Use the control stack',
    mode: 'click',
    source: 'MapControls',
    built: 'viewport · onLocate',
  },
  {
    id: 'tiles',
    label: 'Tiles',
    title: 'Theme-aware Carto, or swap the style.',
    hint: 'Flip theme or tiles',
    mode: 'toggle',
    source: 'Map styles',
    built: 'theme · styles',
  },
  {
    id: 'arcs',
    label: 'Arcs',
    title: 'Curved hops between cities.',
    hint: 'Hover or click an arc',
    mode: 'sweep',
    source: 'MapArc',
    built: 'hoverPaint · onClick',
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
