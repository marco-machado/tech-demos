import { useEffect, useState } from 'react'
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
  MarkerTooltip,
  useMap,
} from '../components/ui/map'
import { formatLngLat } from '../lib/utils'
import { OverlayButton, OverlayPanel } from './overlay'

const PLACES = [
  {
    id: 'city-hall',
    name: 'City Hall',
    category: 'Civic',
    lng: -74.006,
    lat: 40.7128,
    note: 'Downtown start of the official MapCN route demo.',
    color: '#7aa2ff',
  },
  {
    id: 'empire',
    name: 'Empire State',
    category: 'Landmark',
    lng: -73.9857,
    lat: 40.7484,
    note: '1,454 ft of Art Deco steel.',
    color: '#ef6b6b',
  },
  {
    id: 'grand-central',
    name: 'Grand Central',
    category: 'Transit',
    lng: -73.9772,
    lat: 40.7527,
    note: 'Terminal, not station.',
    color: '#e4b86a',
  },
  {
    id: 'central-park',
    name: 'Central Park',
    category: 'Park',
    lng: -73.9654,
    lat: 40.7829,
    note: '843 acres of designed wilderness.',
    color: '#5eead4',
  },
] as const

type PlaceId = (typeof PLACES)[number]['id']

export function PinsScene() {
  const [selected, setSelected] = useState<PlaceId>('empire')
  const place = PLACES.find((item) => item.id === selected) ?? PLACES[1]

  return (
    <Map center={[-73.985, 40.758]} zoom={12.2}>
      <MapControls position="top-right" showZoom />
      <FlyTo latitude={place.lat} longitude={place.lng} />
      {PLACES.map((item) => (
        <MapMarker
          key={item.id}
          latitude={item.lat}
          longitude={item.lng}
          onClick={() => setSelected(item.id)}
        >
          <MarkerContent>
            <div
              className="size-4 rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110"
              style={{ backgroundColor: item.color }}
            />
            <MarkerLabel position="bottom">{item.category}</MarkerLabel>
          </MarkerContent>
          <MarkerTooltip>{item.name}</MarkerTooltip>
          <MarkerPopup closeButton>
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              {item.category}
            </p>
            <h3 className="text-foreground mt-0.5 font-semibold">{item.name}</h3>
            <p className="text-muted-foreground mt-1 text-sm">{item.note}</p>
            <p className="mono text-faint mt-2 text-[11px]">{formatLngLat(item.lng, item.lat)}</p>
          </MarkerPopup>
        </MapMarker>
      ))}
      <OverlayPanel>
        <p className="mono text-[10px] tracking-[0.16em] text-faint uppercase">Manhattan pins</p>
        <div className="mt-2 space-y-0.5">
          {PLACES.map((item) => (
            <OverlayButton
              active={item.id === selected}
              key={item.id}
              onClick={() => setSelected(item.id)}
            >
              <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="min-w-0 flex-1 truncate">{item.name}</span>
              <span className="mono text-[10px] text-faint">{item.category}</span>
            </OverlayButton>
          ))}
        </div>
      </OverlayPanel>
    </Map>
  )
}

function FlyTo({ longitude, latitude }: { longitude: number; latitude: number }) {
  const { map, isLoaded } = useMap()

  useEffect(() => {
    if (!map || !isLoaded) return
    map.flyTo({ center: [longitude, latitude], zoom: Math.max(map.getZoom(), 12.4), duration: 900 })
  }, [map, isLoaded, longitude, latitude])

  return null
}
