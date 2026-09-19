import { useState } from 'react'
import { Map, MapControls, MapMarker, MarkerContent, MarkerLabel, type MapViewport } from '../components/ui/map'
import { formatLngLat } from '../lib/utils'
import { OverlayButton, OverlayPanel } from './overlay'

const PARIS: MapViewport = {
  center: [2.3522, 48.8566],
  zoom: 12,
  bearing: 0,
  pitch: 0,
}

const LOOKS = [
  { id: 'reset', label: 'Reset north', viewport: PARIS },
  {
    id: 'eiffel',
    label: 'Tour Eiffel',
    viewport: { center: [2.2945, 48.8584] as [number, number], zoom: 15.2, bearing: -18, pitch: 52 },
  },
  {
    id: 'louvre',
    label: 'Louvre',
    viewport: { center: [2.3376, 48.8606] as [number, number], zoom: 15, bearing: 12, pitch: 45 },
  },
  {
    id: 'notre',
    label: 'Notre-Dame',
    viewport: { center: [2.35, 48.853] as [number, number], zoom: 15.4, bearing: 40, pitch: 48 },
  },
] as const

export function ControlsScene() {
  const [viewport, setViewport] = useState<MapViewport>(PARIS)
  const [located, setLocated] = useState<{ longitude: number; latitude: number } | null>(null)

  return (
    <Map onViewportChange={setViewport} viewport={viewport}>
      <MapControls
        onLocate={(coords) => setLocated(coords)}
        position="top-right"
        showCompass
        showFullscreen
        showLocate
        showZoom
      />
      <MapMarker latitude={48.8566} longitude={2.3522}>
        <MarkerContent>
          <div className="size-3.5 rounded-full border-2 border-white bg-[#7aa2ff] shadow-md" />
          <MarkerLabel>Île de la Cité</MarkerLabel>
        </MarkerContent>
      </MapMarker>

      <OverlayPanel>
        <p className="mono text-[10px] tracking-[0.16em] text-faint uppercase">Lookats</p>
        <div className="mt-2 space-y-0.5">
          {LOOKS.map((look) => (
            <OverlayButton key={look.id} onClick={() => setViewport({ ...PARIS, ...look.viewport })}>
              {look.label}
            </OverlayButton>
          ))}
        </div>
        <dl className="mono mt-3 grid grid-cols-2 gap-x-3 gap-y-1 border-t border-line pt-2 text-[10px] text-quiet">
          <div>
            <dt className="text-faint">center</dt>
            <dd>{formatLngLat(viewport.center[0], viewport.center[1], 3)}</dd>
          </div>
          <div>
            <dt className="text-faint">zoom</dt>
            <dd>{viewport.zoom.toFixed(1)}</dd>
          </div>
          <div>
            <dt className="text-faint">bearing</dt>
            <dd>{viewport.bearing.toFixed(0)}°</dd>
          </div>
          <div>
            <dt className="text-faint">pitch</dt>
            <dd>{viewport.pitch.toFixed(0)}°</dd>
          </div>
        </dl>
        {located ? (
          <p className="mono mt-2 text-[10px] text-signal">
            located {formatLngLat(located.longitude, located.latitude)}
          </p>
        ) : (
          <p className="mt-2 text-[11px] text-faint">Locate uses the browser geolocation prompt.</p>
        )}
      </OverlayPanel>
    </Map>
  )
}
