export type Box = { x: number; y: number; width: number; height: number }

export type Camera = { x: number; y: number; scale: number }

export const MIN_SCALE = 0.18
export const MAX_SCALE = 3.6

export function clampScale(scale: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale))
}

export function unionBoxes(boxes: readonly Box[]): Box | undefined {
  if (boxes.length === 0) return undefined
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const box of boxes) {
    minX = Math.min(minX, box.x)
    minY = Math.min(minY, box.y)
    maxX = Math.max(maxX, box.x + box.width)
    maxY = Math.max(maxY, box.y + box.height)
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
}

export function fitCamera(
  viewport: { width: number; height: number },
  box: Box,
  padding = 56,
): Camera {
  const availableW = Math.max(80, viewport.width - padding * 2)
  const availableH = Math.max(80, viewport.height - padding * 2)
  const scale = clampScale(
    Math.min(availableW / Math.max(box.width, 1), availableH / Math.max(box.height, 1)),
  )
  return {
    x: (viewport.width - box.width * scale) / 2 - box.x * scale,
    y: (viewport.height - box.height * scale) / 2 - box.y * scale,
    scale,
  }
}

export function zoomAt(
  camera: Camera,
  point: { x: number; y: number },
  factor: number,
): Camera {
  const worldX = (point.x - camera.x) / camera.scale
  const worldY = (point.y - camera.y) / camera.scale
  const scale = clampScale(camera.scale * factor)
  return {
    x: point.x - worldX * scale,
    y: point.y - worldY * scale,
    scale,
  }
}
