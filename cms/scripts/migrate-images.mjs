/**
 * migrate-images.mjs
 *
 * Downloads all external image URLs from the database, saves originals +
 * 3 resized variants to assets/uploads/, creates media records, then clears
 * image_url and sets image_id on every affected row.
 *
 * Run from the cms/ directory:
 *   node scripts/migrate-images.mjs
 */

import { createClient } from '@libsql/client'
import https from 'https'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const dirname    = path.dirname(fileURLToPath(import.meta.url))
const dbPath     = path.resolve(dirname, '../satguru-cms.db')
const uploadsDir = path.resolve(dirname, '../../assets/uploads')

const client = createClient({ url: `file:${dbPath}` })

// ─── helpers ────────────────────────────────────────────────────────────────

async function download(url, hops = 5) {
  return new Promise((resolve, reject) => {
    if (hops === 0) return reject(new Error('Too many redirects'))
    const mod = url.startsWith('https') ? https : http
    const req = mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if ([301, 302, 307, 308].includes(res.statusCode))
        return download(res.headers.location, hops - 1).then(resolve).catch(reject)
      if (res.statusCode !== 200)
        return reject(new Error(`HTTP ${res.statusCode}`))
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end',  () => resolve({
        buffer:   Buffer.concat(chunks),
        mimetype: (res.headers['content-type'] || 'image/jpeg').split(';')[0].trim(),
      }))
      res.on('error', reject)
    })
    req.on('error', reject)
    req.setTimeout(30_000, () => { req.destroy(); reject(new Error('Timeout')) })
  })
}

function mimeExt(mime, fallbackPath) {
  const map = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' }
  if (map[mime]) return map[mime]
  const m = (fallbackPath || '').match(/\.(jpe?g|png|webp|gif)$/i)
  return m ? '.' + m[1].toLowerCase() : '.jpg'
}

function safeName(s) {
  return s.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '').slice(0, 100)
}

/** Coerce to finite number or null — prevents NaN/Infinity from reaching SQLite */
const safeNum = v => {
  const n = Number(v)
  return isFinite(n) ? n : null
}

/** Return a filename that doesn't collide with the given set, then add it to the set. */
function uniqueFilename(base, ext, used) {
  let name = base + ext
  let i = 1
  while (used.has(name)) name = `${base}-${i++}${ext}`
  used.add(name)
  return name
}

// ─── tables to migrate ──────────────────────────────────────────────────────
const TABLES = [
  'excursions',
  'home_banner_slides',
  'explore_banner_slides',
  'explore_listings',
  'itineraries',
  'itineraries_gallery',
  'itineraries_banner_slides',
  'package_banner_slides',
  'media_banners_slides',
  'tour_packages',
]

// Seed the "used filenames" set from disk so we never overwrite existing files
const usedFilenames = new Set(fs.readdirSync(uploadsDir))

// Cache: externalUrl → media.id  (avoids re-downloading the same image)
const urlToMediaId = new Map()

let migrated = 0, reused = 0, failed = 0

// ─── main loop ──────────────────────────────────────────────────────────────
for (const table of TABLES) {
  let rows
  try {
    // Try title first, fall back to alt, then to empty string
    const tryQuery = q => client.execute(q)
    const res = await tryQuery(`SELECT id, image_url, COALESCE(title,'') AS label FROM ${table} WHERE image_url LIKE 'http%'`)
      .catch(() => tryQuery(`SELECT id, image_url, COALESCE(alt,'') AS label FROM ${table} WHERE image_url LIKE 'http%'`))
      .catch(() => tryQuery(`SELECT id, image_url, '' AS label FROM ${table} WHERE image_url LIKE 'http%'`))
    rows = res.rows
  } catch (_) {
    continue  // table has no image_url column — skip
  }

  if (!rows.length) continue
  console.log(`\n── ${table}: ${rows.length} rows with external URLs ──`)

  for (const row of rows) {
    const id  = row.id          // may be integer or UUID string — pass as-is to SQLite
    const url = String(row.image_url)
    const alt = String(row.label || path.basename(new URL(url).pathname))

    // ── Reuse already-migrated URL ────────────────────────────────────────
    if (urlToMediaId.has(url)) {
      const mediaId = urlToMediaId.get(url)
      await client.execute({
        sql:  `UPDATE ${table} SET image_url = NULL, image_id = ? WHERE id = ?`,
        args: [mediaId, id],
      })
      console.log(`  [reuse]  ${table}/${id} → media/${mediaId}`)
      reused++
      continue
    }

    // ── Download ──────────────────────────────────────────────────────────
    let buffer, mimetype
    try {
      ;({ buffer, mimetype } = await download(url))
    } catch (e) {
      console.error(`  [error]  ${table}/${id}: ${e.message}`)
      failed++
      continue
    }

    // ── Determine unique filename ─────────────────────────────────────────
    const urlPath  = new URL(url).pathname
    const rawBase  = safeName(path.basename(urlPath, path.extname(urlPath))) || 'image'
    const fileExt  = mimeExt(mimetype, urlPath)
    const filename = uniqueFilename(rawBase, fileExt, usedFilenames)
    const origPath = path.join(uploadsDir, filename)

    // ── Write original file ───────────────────────────────────────────────
    fs.writeFileSync(origPath, buffer)

    // ── Measure dimensions ────────────────────────────────────────────────
    let origW = 0, origH = 0
    try {
      const meta = await sharp(buffer).metadata()
      origW = meta.width  || 0
      origH = meta.height || 0
    } catch (_) {}

    // ── Generate resized variants ─────────────────────────────────────────
    const nameBase = path.basename(filename, fileExt)   // e.g. "snowbus" or "snowbus-1"
    const sizes    = {}
    for (const { key, w, h } of [
      { key: 'thumbnail', w: 400,  h: 300  },
      { key: 'card',      w: 768,  h: 512  },
      { key: 'hero',      w: 1280, h: 720  },
    ]) {
      const sizeFile = uniqueFilename(`${nameBase}-${w}x${h}`, fileExt, usedFilenames)
      const sizePath = path.join(uploadsDir, sizeFile)
      try {
        const info = await sharp(buffer)
          .resize(w, h, { fit: 'cover', position: 'centre' })
          .toFile(sizePath)
        sizes[key] = { filename: sizeFile, width: safeNum(info.width), height: safeNum(info.height), filesize: safeNum(info.size) }
      } catch (e) {
        console.warn(`    [warn] ${key} size failed: ${e.message}`)
      }
    }

    // ── Insert media record ───────────────────────────────────────────────
    const now = new Date().toISOString()
    const ins = await client.execute({
      sql: `INSERT INTO media (
        alt, updated_at, created_at, url, filename, mime_type, filesize, width, height,
        sizes_thumbnail_url, sizes_thumbnail_width, sizes_thumbnail_height,
        sizes_thumbnail_mime_type, sizes_thumbnail_filesize, sizes_thumbnail_filename,
        sizes_card_url, sizes_card_width, sizes_card_height,
        sizes_card_mime_type, sizes_card_filesize, sizes_card_filename,
        sizes_hero_url, sizes_hero_width, sizes_hero_height,
        sizes_hero_mime_type, sizes_hero_filesize, sizes_hero_filename
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [
        alt, now, now,
        `/api/media/file/${filename}`, filename, mimetype, safeNum(buffer.length), safeNum(origW), safeNum(origH),
        sizes.thumbnail ? `/api/media/file/${sizes.thumbnail.filename}` : null,
        sizes.thumbnail?.width  || null, sizes.thumbnail?.height   || null,
        mimetype, sizes.thumbnail?.filesize || null, sizes.thumbnail?.filename || null,
        sizes.card ? `/api/media/file/${sizes.card.filename}` : null,
        sizes.card?.width  || null, sizes.card?.height   || null,
        mimetype, sizes.card?.filesize || null, sizes.card?.filename || null,
        sizes.hero ? `/api/media/file/${sizes.hero.filename}` : null,
        sizes.hero?.width  || null, sizes.hero?.height   || null,
        mimetype, sizes.hero?.filesize || null, sizes.hero?.filename || null,
      ],
    })
    const rawRowid = ins.lastInsertRowid
    const mediaId = typeof rawRowid === 'bigint' ? Number(rawRowid) : Number(rawRowid)
    if (!isFinite(mediaId) || mediaId === 0) {
      console.error(`  [error]  INSERT returned bad rowid: ${rawRowid} (${typeof rawRowid})`)
      failed++
      continue
    }
    urlToMediaId.set(url, mediaId)

    // ── Update source record ──────────────────────────────────────────────
    await client.execute({
      sql:  `UPDATE ${table} SET image_url = NULL, image_id = ? WHERE id = ?`,
      args: [mediaId, id],
    })

    console.log(`  [ok]     ${table}/${id} → media/${mediaId}  (${filename})`)
    migrated++
  }
}

client.close()
console.log(`\n✓ Finished.  Migrated: ${migrated}  Reused: ${reused}  Failed: ${failed}`)
