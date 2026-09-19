import { copyFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'node_modules/maplibre-gl/dist')
const dest = join(root, 'public')

await mkdir(dest, { recursive: true })
await copyFile(join(src, 'maplibre-gl-worker.mjs'), join(dest, 'maplibre-gl-worker.mjs'))
await copyFile(join(src, 'maplibre-gl-shared.mjs'), join(dest, 'maplibre-gl-shared.mjs'))
console.log('Copied MapLibre worker + shared modules into public/')
