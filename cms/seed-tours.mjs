/**
 * Satguru DMC — Tour Packages Seed (Home Page Accordion Cards)
 * Fetched from: https://satgurutravel.ru/dmc/ → "Explore our tours" section
 *
 * Usage:  node seed-tours.mjs <email> <password>
 */

const CMS = 'http://localhost:3002'
const [,, EMAIL, PASSWORD] = process.argv

if (!EMAIL || !PASSWORD) {
  console.error('\n❌  Usage: node seed-tours.mjs <email> <password>\n')
  process.exit(1)
}

// ── 6 Tour Packages from live site ─────────────────────────────────────────
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
    description: "Russia's dynamic capital blends Soviet grandeur with modern energy — from the iconic Red Square and the Kremlin to world-class restaurants, galleries and a thriving arts scene.",
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/siberian-winter-inspiration_t20_z2x4J4-scaled.jpg',
    link: 'moscow.html',
    featured: true,
    order: 2,
  },
  {
    title: 'Golden Ring',
    description: 'A circle of ancient Russian towns — Sergiev Posad, Vladimir, Suzdal, Kostroma and Yaroslavl — preserving medieval kremlin walls, UNESCO monasteries and Orthodox heritage.',
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/golden-ring-3.jpg',
    link: 'golden-ring.html',
    featured: true,
    order: 3,
  },
  {
    title: 'Kazan',
    description: 'The multicultural capital of Tatarstan — UNESCO Kazan Kremlin, the grand Qolsharif Mosque, unique Tatar cuisine and a fascinating blend of Russian and Eastern cultures.',
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Winter.jpg',
    link: 'kazan.html',
    featured: true,
    order: 4,
  },
  {
    title: 'Sochi',
    description: "Known as the 'Russian Riviera', Sochi blends golden Black Sea beaches with alpine mountain resorts, the lush Sochi National Park and year-round outdoor adventures.",
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Sochi-city.jpg',
    link: 'sochi.html',
    featured: true,
    order: 5,
  },
  {
    title: 'Saint Petersburg',
    description: "Russia's cultural heart dazzles with baroque palaces, the world-renowned Hermitage Museum, romantic canals and the legendary White Nights of summer.",
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/St.-Petersburg.jpg',
    link: 'saint-petersburg.html',
    featured: true,
    order: 6,
  },
]

// ── Helpers ─────────────────────────────────────────────────────────────────
async function login() {
  const r = await fetch(`${CMS}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const d = await r.json()
  if (!d.token) {
    console.error('❌  Login failed:', d.message || JSON.stringify(d))
    process.exit(1)
  }
  console.log(`✅  Logged in as ${d.user.email}`)
  return d.token
}

async function deleteAll(token) {
  const r = await fetch(`${CMS}/api/tour-packages?limit=100`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const d = await r.json()
  const docs = d.docs || []
  for (const doc of docs) {
    await fetch(`${CMS}/api/tour-packages/${doc.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
  }
  if (docs.length) console.log(`🗑   Cleared ${docs.length} existing tour package(s)`)
}

async function create(token, data) {
  const r = await fetch(`${CMS}/api/tour-packages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  const d = await r.json()
  if (!r.ok) {
    console.error(`  ❌  ${data.title}:`, d.errors?.[0]?.message || JSON.stringify(d))
    return false
  }
  return true
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🌍  Satguru DMC — Seeding Tour Packages (Home Page)\n' + '─'.repeat(48))
  const token = await login()
  await deleteAll(token)

  console.log('\n📦  Adding 6 tour packages from satgurutravel.ru/dmc/…')
  for (const pkg of TOUR_PACKAGES) {
    const ok = await create(token, pkg)
    console.log(`  ${ok ? '✅' : '❌'}  ${pkg.title}`)
  }

  console.log('\n🎉  Done! Open http://localhost:3002/admin → Tour Packages to verify.')
  console.log('    Home page will now show all 6 accordion cards from the CMS.\n')
}

main().catch(err => { console.error('\n❌  Unexpected error:', err.message); process.exit(1) })
