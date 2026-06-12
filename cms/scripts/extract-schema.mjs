import { createClient } from '@libsql/client'
import path from 'path'
import { fileURLToPath } from 'url'
import { writeFileSync } from 'fs'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.resolve(dirname, '../satguru-cms.db')

const client = createClient({ url: `file:${dbPath}` })

const result = await client.execute(
  "SELECT sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
)
const indexResult = await client.execute(
  "SELECT sql FROM sqlite_master WHERE type='index' AND sql IS NOT NULL ORDER BY name"
)

await client.close()

const tableCount = result.rows.length
const tables = result.rows.map(r => r[0])
const indexes = indexResult.rows.map(r => r[0])

console.log(`Found ${tableCount} tables and ${indexes.length} indexes`)

// Write as a JS migration module
const migrationContent = `// Auto-generated initial schema migration
export async function up({ payload }) {
  const db = payload.db
  const statements = ${JSON.stringify([...tables, ...indexes], null, 2)}
  for (const sql of statements) {
    if (sql) {
      try {
        await db.execute({ drizzle: db.drizzle, raw: sql })
      } catch (e) {
        // Ignore "already exists" errors
        if (!e.message?.includes('already exists')) throw e
      }
    }
  }
}

export async function down({ payload }) {}
`

writeFileSync(path.resolve(dirname, '../src/migrations/20240101_initial.js'), migrationContent)
console.log('Migration file written to src/migrations/20240101_initial.js')
