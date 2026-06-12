/**
 * pre-init.mjs
 * Runs before `next dev` / `next start`.
 *
 * 1. Drops payload_locked_documents_rels so PayloadCMS rebuilds it fresh
 *    with all current collections (avoids CREATE INDEX conflicts on restart).
 *
 * 2. Pre-creates any new columns added to existing tables so that
 *    Payload's schema-push runs silently without interactive prompts.
 */
import { createClient } from '@libsql/client'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath  = path.resolve(dirname, '../satguru-cms.db')

const client = createClient({ url: `file:${dbPath}` })

/* ── 1. Reset locked-docs table ─────────────────────────── */
const RESET = [
  'DROP INDEX IF EXISTS payload_locked_documents_rels_order_idx',
  'DROP INDEX IF EXISTS payload_locked_documents_rels_locale_idx',
  'DROP INDEX IF EXISTS payload_locked_documents_rels_path_idx',
  'DROP INDEX IF EXISTS payload_locked_documents_rels_parent_idx',
  'DROP INDEX IF EXISTS payload_locked_documents_rels_parent_id_idx',
  'DROP TABLE IF EXISTS payload_locked_documents_rels',
]
for (const sql of RESET) {
  try { await client.execute(sql) } catch (_) {}
}
console.log('[pre-init] payload_locked_documents_rels reset ✓')

/* ── 2. Pre-create new Excursions columns (destination info) ── */
const ADD_COLS = [
  // Destination info tab fields added to excursions table
  `ALTER TABLE excursions ADD COLUMN destination_title text`,
  `ALTER TABLE excursions ADD COLUMN destination_slug  text`,
  `ALTER TABLE excursions ADD COLUMN destination_description text`,
  `ALTER TABLE excursions ADD COLUMN destination_image_id integer REFERENCES media(id)`,
  `ALTER TABLE excursions ADD COLUMN destination_hero_image text`,
  `ALTER TABLE excursions ADD COLUMN home_feature integer DEFAULT 0`,
  `ALTER TABLE excursions ADD COLUMN active integer DEFAULT 1`,
  `ALTER TABLE excursions ADD COLUMN destination_order integer DEFAULT 0`,
  `ALTER TABLE excursions ADD COLUMN description text`,
  // Remove old destination relationship column if it still exists
  // (SQLite doesn't support DROP COLUMN in older versions — we leave it, just stop using it)
]
for (const sql of ADD_COLS) {
  try { await client.execute(sql) } catch (_) { /* column already exists — fine */ }
}
console.log('[pre-init] excursions columns pre-created ✓')

client.close()
