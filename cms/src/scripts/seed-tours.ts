/**
 * Satguru DMC — Tour Packages Local Seed
 * Uses Payload local API (no login needed — direct DB access)
 *
 * Run with:  npx payload run src/scripts/seed-tours.ts
 */
import { getPayload } from 'payload'
import config from '../../src/payload.config'

const TOUR_PACKAGES = [
  {
    title: 'Murmansk',
    description: 'Above the Arctic Circle, Murmansk delivers breathtaking Northern Lights spectacles, polar day adventures, dramatic tundra landscapes and authentic Russian Arctic culture.',
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/aerial-view-of-murmansk-in-the-summer-2021-10-13-17-03-10-utc.jpg',
    link: 'murmansk.html',
    featured: true,
    order: 1,
  },
  {
    title: 'Moscow',
    description: "Russia's dynamic capital — Red Square, the Kremlin, Tretyakov Gallery, the Moscow Metro and a thriving modern arts scene.",
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/siberian-winter-inspiration_t20_z2x4J4-scaled.jpg',
    link: 'moscow.html',
    featured: true,
    order: 2,
  },
  {
    title: 'Golden Ring',
    description: 'A circle of ancient Russian towns — Sergiev Posad, Vladimir, Suzdal and Yaroslavl — preserving medieval kremlin walls and Orthodox heritage.',
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/golden-ring-3.jpg',
    link: 'golden-ring.html',
    featured: true,
    order: 3,
  },
  {
    title: 'Kazan',
    description: 'The multicultural capital of Tatarstan — UNESCO Kazan Kremlin, the grand Qolsharif Mosque and a unique blend of Russian and Eastern cultures.',
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Winter.jpg',
    link: 'kazan.html',
    featured: true,
    order: 4,
  },
  {
    title: 'Sochi',
    description: "The 'Russian Riviera' — golden Black Sea beaches, alpine mountain resorts, the 2014 Winter Olympics venues and lush Sochi National Park.",
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Sochi-city.jpg',
    link: 'sochi.html',
    featured: true,
    order: 5,
  },
  {
    title: 'Saint Petersburg',
    description: "Russia's cultural heart — baroque palaces, the Hermitage, romantic canals, the legendary White Nights and Peter & Paul Fortress.",
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/St.-Petersburg.jpg',
    link: 'saint-petersburg.html',
    featured: true,
    order: 6,
  },
]

async function seed() {
  console.log('\n🌍  Satguru DMC — Seeding Tour Packages\n' + '─'.repeat(42))

  const payload = await getPayload({ config })

  // Clear existing
  const existing = await payload.find({ collection: 'tour-packages', limit: 100 })
  for (const doc of existing.docs) {
    await payload.delete({ collection: 'tour-packages', id: doc.id })
  }
  if (existing.docs.length) console.log(`🗑   Cleared ${existing.docs.length} existing record(s)`)

  // Insert new
  console.log('\n📦  Inserting 6 tour packages…')
  for (const pkg of TOUR_PACKAGES) {
    try {
      await payload.create({ collection: 'tour-packages', data: pkg as any })
      console.log(`  ✅  ${pkg.title}`)
    } catch (e: any) {
      console.error(`  ❌  ${pkg.title}: ${e.message}`)
    }
  }

  console.log('\n🎉  Done! Refresh http://localhost:3002/admin/collections/tour-packages\n')
  process.exit(0)
}

seed().catch(err => { console.error('❌', err.message); process.exit(1) })
