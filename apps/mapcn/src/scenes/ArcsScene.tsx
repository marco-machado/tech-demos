import { useMemo, useState } from 'react'
import { Map, MapArc, MapMarker, MarkerContent, MarkerLabel, type MapArcDatum } from '../components/ui/map'
import { OverlayPanel } from './overlay'

const CITIES = [
  { id: 'nyc', name: 'New York', lng: -74.006, lat: 40.7128 },
  { id: 'lon', name: 'London', lng: -0.1278, lat: 51.5074 },
  { id: 'tok', name: 'Tokyo', lng: 139.6917, lat: 35.6895 },
  { id: 'syd', name: 'Sydney', lng: 151.2093, lat: -33.8688 },
  { id: 'sao', name: 'São Paulo', lng: -46.6333, lat: -23.5505 },
] as const

const HOPS: { id: string; from: (typeof CITIES)[number]['id']; to: (typeof CITIES)[number]['id'] }[] = [
  { id: 'nyc-lon', from: 'nyc', to: 'lon' },
  { id: 'lon-tok', from: 'lon', to: 'tok' },
  { id: 'nyc-syd', from: 'nyc', to: 'syd' },
  { id: 'tok-syd', from: 'tok', to: 'syd' },
  { id: 'nyc-sao', from: 'nyc', to: 'sao' },
  { id: 'lon-sao', from: 'lon', to: 'sao' },
]

function city(id: (typeof CITIES)[number]['id']) {
  return CITIES.find((item) => item.id === id) ?? CITIES[0]
}

export function ArcsScene() {
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string>('nyc-lon')

  const data = useMemo<MapArcDatum[]>(
    () =>
      HOPS.map((hop) => {
        const from = city(hop.from)
        const to = city(hop.to)
        return { id: hop.id, from: [from.lng, from.lat], to: [to.lng, to.lat] }
      }),
    [],
  )

  const focusId = hoverId ?? selectedId
  const active = HOPS.find((hop) => hop.id === focusId) ?? HOPS[0]

  return (
    <Map blank center={[10, 16]} maxPitch={0} minZoom={1.1} zoom={1.45}>
      <MapArc
        curvature={0.22}
        data={data}
        hoverPaint={{ 'line-width': 3.6, 'line-opacity': 1 }}
        onClick={(event) => setSelectedId(String(event.arc.id))}
        onHover={(event) => setHoverId(event ? String(event.arc.id) : null)}
        paint={{
          'line-color': ['case', ['==', ['get', 'id'], focusId], '#5eead4', '#7aa2ff'],
          'line-opacity': 0.9,
          'line-width': ['case', ['==', ['get', 'id'], focusId], 3.2, 2],
        }}
      />
      {CITIES.map((item) => (
        <MapMarker key={item.id} latitude={item.lat} longitude={item.lng}>
          <MarkerContent>
            <div className="size-3 rounded-full border-2 border-white bg-[#5eead4] shadow-md" />
            <MarkerLabel className="bg-background/80 rounded px-1.5 py-0.5 text-[10px] text-foreground shadow-sm">
              {item.name}
            </MarkerLabel>
          </MarkerContent>
        </MapMarker>
      ))}
      <OverlayPanel>
        <p className="mono text-[10px] tracking-[0.16em] text-faint uppercase">World hops</p>
        <p className="mt-2 text-sm font-medium">
          {city(active.from).name} → {city(active.to).name}
        </p>
        <p className="mt-1 text-[12px] text-quiet">
          Hover a curve or click it. MapArc bows a quadratic in lng/lat space.
        </p>
        <ul className="mt-2 space-y-1">
          {HOPS.map((hop) => (
            <li key={hop.id}>
              <button
                className={`w-full rounded-md px-2 py-1 text-left text-[12px] ${
                  hop.id === selectedId ? 'bg-muted' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedId(hop.id)}
                type="button"
              >
                {city(hop.from).name} → {city(hop.to).name}
              </button>
            </li>
          ))}
        </ul>
      </OverlayPanel>
    </Map>
  )
}
