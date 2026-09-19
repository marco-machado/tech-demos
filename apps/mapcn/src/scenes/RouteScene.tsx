import { Car, Pause, Play, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Map,
  MapControls,
  MapRoute,
  MarkerContent,
  MarkerLabel,
  RouteMarker,
  RouteProgress,
} from '../components/ui/map'
import { OverlayPanel } from './overlay'

// Official MapCN route-progress demo coordinates (San Francisco Embarcadero).
const ROUTE: [number, number][] = [
  [-122.394, 37.7953],
  [-122.3952, 37.7967],
  [-122.397, 37.7986],
  [-122.3975, 37.7992],
  [-122.3976, 37.7993],
  [-122.3981, 37.799],
  [-122.3984, 37.7989],
  [-122.4066, 37.7979],
  [-122.4071, 37.7981],
  [-122.4072, 37.7982],
  [-122.4072, 37.7984],
  [-122.4082, 37.8034],
  [-122.4064, 37.8037],
  [-122.4063, 37.8036],
  [-122.4063, 37.8034],
  [-122.4067, 37.8032],
  [-122.4067, 37.803],
  [-122.4067, 37.8028],
  [-122.4064, 37.8025],
  [-122.4062, 37.802],
  [-122.406, 37.8019],
  [-122.4058, 37.8018],
  [-122.4056, 37.8018],
  [-122.4055, 37.8019],
  [-122.4054, 37.8021],
  [-122.4056, 37.8025],
]

export function RouteScene() {
  const [progress, setProgress] = useState(0.28)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      const delta = (now - last) / 1000
      last = now
      setProgress((value) => {
        const next = value + delta * 0.12
        if (next >= 1) {
          setPlaying(false)
          return 1
        }
        return next
      })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing])

  return (
    <Map center={[-122.4008, 37.7996]} zoom={14.2}>
      <MapControls position="top-right" showZoom />
      <MapRoute
        color="#475569"
        coordinates={ROUTE}
        dashArray={[0.8, 1.4]}
        opacity={1}
        progress={progress}
        width={6}
      >
        <RouteProgress color="#7aa2ff" opacity={1} width={6} />
        <RouteMarker at="start">
          <MarkerContent>
            <div className="border-foreground bg-background size-3.5 rounded-full border-2 shadow-md" />
          </MarkerContent>
        </RouteMarker>
        <RouteMarker at="progress">
          <MarkerContent>
            <div className="ring-background grid size-6 place-items-center rounded-full bg-[#7aa2ff] shadow-md ring-2">
              <Car className="size-3 text-white" />
            </div>
            <MarkerLabel
              className="bg-background/90 border-border/50 rounded-md border px-1.5 py-0.5 tabular-nums shadow-sm"
              position="top"
            >
              {Math.round(progress * 100)}%
            </MarkerLabel>
          </MarkerContent>
        </RouteMarker>
        <RouteMarker at="end">
          <MarkerContent>
            <div className="bg-foreground ring-background size-3.5 rounded-full shadow-md ring-2" />
          </MarkerContent>
        </RouteMarker>
      </MapRoute>

      <OverlayPanel className="w-64" position="bottom">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium">Embarcadero run</span>
          <span className="mono text-muted-foreground tabular-nums">{Math.round(progress * 100)}%</span>
        </div>
        <input
          aria-label="Route progress"
          max={1}
          min={0}
          onChange={(event) => {
            setPlaying(false)
            setProgress(Number(event.target.value))
          }}
          step={0.01}
          type="range"
          value={progress}
        />
        <div className="mt-3 flex gap-2">
          <button
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-muted px-2 py-1.5 text-[12px] font-medium"
            onClick={() => setPlaying((value) => !value)}
            type="button"
          >
            {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            {playing ? 'Pause' : 'Play'}
          </button>
          <button
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[12px]"
            onClick={() => {
              setPlaying(false)
              setProgress(0)
            }}
            type="button"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </button>
        </div>
      </OverlayPanel>
    </Map>
  )
}
