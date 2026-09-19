import { useEffect, useRef, useState } from 'react'
import { Map, MapControls, type MapRef } from '../components/ui/map'
import { useTheme } from '../lib/theme'
import { OverlayButton, OverlayPanel } from './overlay'

const STYLES = {
  carto: undefined,
  bright: 'https://tiles.openfreemap.org/styles/bright',
  liberty: 'https://tiles.openfreemap.org/styles/liberty',
} as const

type StyleKey = keyof typeof STYLES

export function TilesScene() {
  const { theme, setTheme } = useTheme()
  const [style, setStyle] = useState<StyleKey>('carto')
  const mapRef = useRef<MapRef>(null)
  const selected = STYLES[style]
  const is3d = style === 'liberty'

  useEffect(() => {
    mapRef.current?.easeTo({ pitch: is3d ? 58 : 0, duration: 500 })
  }, [is3d])

  return (
    <Map
      center={[-0.1276, 51.5074]}
      ref={mapRef}
      styles={selected ? { light: selected, dark: selected } : undefined}
      theme={theme}
      zoom={13.4}
    >
      <MapControls position="top-right" showCompass showZoom />
      <OverlayPanel>
        <p className="mono text-[10px] tracking-[0.16em] text-faint uppercase">Basemap</p>
        <div className="mt-2 space-y-0.5">
          <OverlayButton active={style === 'carto'} onClick={() => setStyle('carto')}>
            Carto {theme === 'dark' ? 'Dark Matter' : 'Positron'}
          </OverlayButton>
          <OverlayButton active={style === 'bright'} onClick={() => setStyle('bright')}>
            OpenFreeMap Bright
          </OverlayButton>
          <OverlayButton active={style === 'liberty'} onClick={() => setStyle('liberty')}>
            OpenFreeMap Liberty 3D
          </OverlayButton>
        </div>
        <div className="mt-3 flex gap-1 rounded-lg bg-muted p-1">
          <button
            className={`flex-1 rounded-md px-2 py-1 text-[12px] ${theme === 'dark' ? 'bg-background shadow-sm' : ''}`}
            onClick={() => setTheme('dark')}
            type="button"
          >
            Dark
          </button>
          <button
            className={`flex-1 rounded-md px-2 py-1 text-[12px] ${theme === 'light' ? 'bg-background shadow-sm' : ''}`}
            onClick={() => setTheme('light')}
            type="button"
          >
            Light
          </button>
        </div>
        <p className="mt-2 text-[11px] leading-snug text-faint">
          Carto tiles follow MapCN’s document theme. OpenFreeMap is a custom <code>styles</code> prop.
        </p>
      </OverlayPanel>
    </Map>
  )
}
