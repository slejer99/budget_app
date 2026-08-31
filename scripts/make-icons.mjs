// Draws the app's icons and writes them into public/ as PNGs.
//
// The icons are committed to the repository, so nothing here runs during a
// normal build — this script exists so the mark can be changed later without
// needing an image editor, or anything installed beyond Node itself.
//
//   node scripts/make-icons.mjs
//
// Everything below is plain arithmetic over pixels plus Node's own zlib. There
// is no image library, because a dependency that draws three rectangles is a
// dependency that can break a rebuild in two years' time.

import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const INK = [27, 42, 74] // deep indigo, the background
const BAR = [245, 185, 68] // warm gold, the plan

// --- PNG encoding -----------------------------------------------------------

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})

function crc32(buffer) {
  let c = 0xffffffff
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([length, body, crc])
}

function encodePng(size, rgba) {
  const stride = size * 4
  const raw = Buffer.alloc((stride + 1) * size)
  for (let y = 0; y < size; y += 1) {
    raw[y * (stride + 1)] = 0 // filter: none
    Buffer.from(rgba.buffer, y * stride, stride).copy(raw, y * (stride + 1) + 1)
  }
  const header = Buffer.alloc(13)
  header.writeUInt32BE(size, 0)
  header.writeUInt32BE(size, 4)
  header[8] = 8 // bit depth
  header[9] = 6 // colour type: RGBA
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// --- The mark ---------------------------------------------------------------

/** True where a point falls inside a rectangle with rounded corners. Exact, so
 *  supersampling is the only thing smoothing the edges. */
function insideRoundedRect(px, py, left, top, right, bottom, radius) {
  const cx = Math.min(Math.max(px, left + radius), right - radius)
  const cy = Math.min(Math.max(py, top + radius), bottom - radius)
  const dx = px - cx
  const dy = py - cy
  return dx * dx + dy * dy <= radius * radius
}

/** Three bars of falling length: a plan, read top to bottom. */
function barsAt(px, py, inset) {
  const span = 1 - 2 * inset
  const height = span / (3 + 2 * 0.38)
  const gap = height * 0.38
  const widths = [1, 0.72, 0.45]
  for (let i = 0; i < 3; i += 1) {
    const top = inset + i * (height + gap)
    const right = inset + span * widths[i]
    if (insideRoundedRect(px, py, inset, top, right, top + height, height / 2)) return true
  }
  return false
}

function drawIcon(size, { maskable }) {
  // A maskable icon may be cropped to a circle by the launcher, so its mark
  // sits well inside the safe zone and the background bleeds to the edge.
  const inset = maskable ? 0.29 : 0.22
  const cornerRadius = maskable ? 0 : 0.22
  const samples = 3
  const rgba = new Uint8Array(size * size * 4)

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let r = 0
      let g = 0
      let b = 0
      let a = 0
      for (let sy = 0; sy < samples; sy += 1) {
        for (let sx = 0; sx < samples; sx += 1) {
          const px = (x + (sx + 0.5) / samples) / size
          const py = (y + (sy + 0.5) / samples) / size
          const onBackground =
            cornerRadius === 0 || insideRoundedRect(px, py, 0, 0, 1, 1, cornerRadius)
          if (!onBackground) continue
          const colour = barsAt(px, py, inset) ? BAR : INK
          r += colour[0]
          g += colour[1]
          b += colour[2]
          a += 255
        }
      }
      const taken = samples * samples
      const offset = (y * size + x) * 4
      // Averaged premultiplied, then divided back out, so edges do not fringe.
      rgba[offset] = a === 0 ? 0 : Math.round(r / (a / 255))
      rgba[offset + 1] = a === 0 ? 0 : Math.round(g / (a / 255))
      rgba[offset + 2] = a === 0 ? 0 : Math.round(b / (a / 255))
      rgba[offset + 3] = Math.round(a / taken)
    }
  }
  return rgba
}

const publicDir = fileURLToPath(new URL('../public/', import.meta.url))

for (const [name, size, options] of [
  ['favicon-32.png', 32, { maskable: false }],
  ['icon-192.png', 192, { maskable: false }],
  ['icon-512.png', 512, { maskable: false }],
  ['icon-maskable-512.png', 512, { maskable: true }],
]) {
  writeFileSync(publicDir + name, encodePng(size, drawIcon(size, options)))
  console.log(`wrote public/${name}`)
}
