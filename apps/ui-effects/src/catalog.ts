export const SECTIONS = [
  { id: 'beam', label: 'Beam', pkg: 'border-beam' },
  { id: 'orbs', label: 'Orbs', pkg: 'thinking-orbs' },
  { id: 'gooey', label: 'Gooey', pkg: 'liquid-gooey' },
  { id: 'metal', label: 'Metal', pkg: 'metal-fx' },
  { id: 'image', label: 'Image', pkg: 'img-fx' },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

export function asset(path: string) {
  const base = import.meta.env.BASE_URL
  return `${base.endsWith('/') ? base : `${base}/`}${path.replace(/^\//, '')}`
}

export const REVEAL_IMAGES = [
  asset('images/canyon.png'),
  asset('images/tide.png'),
  asset('images/nebula.png'),
]
