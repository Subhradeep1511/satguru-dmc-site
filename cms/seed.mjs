/**
 * Satguru DMC — Payload CMS Seed Script
 * Populates the CMS with real data fetched from https://satgurutravel.ru/dmc/
 *
 * Usage:
 *   node seed.mjs <email> <password>
 *   e.g.  node seed.mjs admin@satgurudmc.com yourpassword
 */

const CMS = 'http://localhost:3002'
const [,, EMAIL, PASSWORD] = process.argv

if (!EMAIL || !PASSWORD) {
  console.error('Usage: node seed.mjs <email> <password>')
  process.exit(1)
}

// ── helpers ──────────────────────────────────────────────────────────────────
async function login() {
  const r = await fetch(`${CMS}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const d = await r.json()
  if (!d.token) { console.error('Login failed:', JSON.stringify(d)); process.exit(1) }
  console.log('✅ Logged in as', d.user.email)
  return d.token
}

async function post(token, endpoint, data) {
  const r = await fetch(`${CMS}/api/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  const d = await r.json()
  if (!r.ok) { console.error(`  ❌ POST /${endpoint}:`, d.errors?.[0]?.message || JSON.stringify(d)); return null }
  return d.doc || d
}

async function getAll(token, endpoint) {
  const r = await fetch(`${CMS}/api/${endpoint}?limit=100`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const d = await r.json()
  return d.docs || []
}

async function clearCollection(token, slug) {
  const docs = await getAll(token, slug)
  for (const doc of docs) {
    await fetch(`${CMS}/api/${slug}/${doc.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
  }
  console.log(`  🗑  Cleared ${docs.length} existing ${slug}`)
}

// ── DATA ─────────────────────────────────────────────────────────────────────

const TOUR_PACKAGES = [
  {
    title: 'Sochi',
    description: "Known as the 'Russian Riviera', Sochi blends golden Black Sea beaches with alpine mountain resorts, the lush Sochi National Park, and year-round outdoor adventures.",
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Sochi-beach.jpg',
    link: 'sochi.html',
    featured: true, order: 1,
  },
  {
    title: 'Saint Petersburg',
    description: "Russia's cultural heart dazzles with baroque palaces, the world-renowned Hermitage Museum, romantic canals, and the legendary White Nights.",
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/petersburg-St.Isaak-cathedral.jpg',
    link: 'saint-petersburg.html',
    featured: true, order: 2,
  },
  {
    title: 'Murmansk',
    description: 'Above the Arctic Circle, Murmansk delivers breathtaking Northern Lights spectacles, polar day adventures, and authentic Russian Arctic culture.',
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/aerial-view-of-murmansk-in-the-summer-2021-10-13-17-03-10-utc.jpg',
    link: 'murmansk.html',
    featured: true, order: 3,
  },
  {
    title: 'Moscow',
    description: "Russia's dynamic capital blends Soviet grandeur with modern energy — from the iconic Red Square and the Kremlin to world-class galleries and a thriving arts scene.",
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Moscow-GUM-mall.jpg',
    link: 'moscow.html',
    featured: true, order: 4,
  },
  {
    title: 'Moscow & Sochi',
    description: "A perfect dual-city journey pairing Moscow's iconic landmarks with Sochi's stunning coastal scenery — Russia's full spectrum from cultural heart to sun-kissed shores.",
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Moscow-VDNH.jpg',
    link: 'popular-itineraries.html',
    featured: true, order: 5,
  },
]

const DESTINATIONS = [
  {
    title: 'Sochi', slug: 'sochi',
    description: "Russia's premier Black Sea resort city, with golden beaches, Alpine mountain resorts, the 2014 Winter Olympics venues, and the lush Sochi National Park.",
    heroImage: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Sochi-city.jpg',
    homeFeature: true, active: true, order: 1,
  },
  {
    title: 'Saint Petersburg', slug: 'saint-petersburg',
    description: "Russia's cultural capital — baroque palaces, the Hermitage, romantic canals, White Nights, Peter & Paul Fortress, and Peterhof Palace.",
    heroImage: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/St.-Petersburg.jpg',
    homeFeature: true, active: true, order: 2,
  },
  {
    title: 'Murmansk', slug: 'murmansk',
    description: "The world's largest city above the Arctic Circle — Northern Lights safaris, the Lenin nuclear icebreaker, husky rides, and Sami reindeer farms.",
    heroImage: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/aerial-view-of-murmansk-in-the-summer-2021-10-13-17-03-10-utc.jpg',
    homeFeature: true, active: true, order: 3,
  },
  {
    title: 'Moscow', slug: 'moscow',
    description: "Russia's dynamic capital — Red Square, the Kremlin, Tretyakov Gallery, the Moscow Metro, Sparrow Hills, and a vibrant modern city scene.",
    heroImage: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Moscow-GUM-mall.jpg',
    homeFeature: true, active: true, order: 4,
  },
  {
    title: 'Golden Ring', slug: 'golden-ring',
    description: "A circle of ancient Russian towns — Sergiev Posad, Vladimir, Suzdal, Kostroma, Yaroslavl, and Rostov — preserving medieval architecture and Orthodox heritage.",
    heroImage: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/golden-ring-3.jpg',
    homeFeature: false, active: true, order: 5,
  },
  {
    title: 'Kazan', slug: 'kazan',
    description: "The multicultural capital of Tatarstan — UNESCO Kazan Kremlin, the Qolsharif Mosque, Tatar culinary traditions, and the unique East-meets-West cultural identity.",
    heroImage: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Winter.jpg',
    homeFeature: false, active: true, order: 6,
  },
  {
    title: 'Lake Baikal', slug: 'lake-baikal',
    description: "The world's deepest lake — Listvyanka village, Circum-Baikal Railway, Olkhon Island, Shaman Rock, and spectacular winter ice formations.",
    heroImage: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/siberian-winter-inspiration_t20_z2x4J4-scaled.jpg',
    homeFeature: false, active: true, order: 7,
  },
  {
    title: 'Kamchatka', slug: 'kamchatka',
    description: "Russia's wild Far East — Valley of Geysers, active volcanoes, brown bear safaris, helicopter adventures, and Pacific coastline kayaking.",
    heroImage: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Sochi-beach.jpg',
    homeFeature: false, active: true, order: 8,
  },
]

const ITINERARIES = [
  {
    title: 'Sochi 4 Days Tour',
    slug: 'sochi-4-days',
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Sochi-beach.jpg',
    duration: '4 Days / 3 Nights',
    price: 'From $370 per person',
    description: "A short getaway to Russia's premier Black Sea resort city featuring airport transfers, hotel accommodation, guided city exploration, and leisure time on the coast.",
    highlights: [
      { text: '3 nights stay in Sochi (Park Inn Radisson / Gorki Grand hotel)' },
      { text: '3 buffet breakfasts included' },
      { text: 'Sochi panoramic city tour — 4 hours with English-speaking guide' },
      { text: 'Airport & railway station transfers' },
      { text: 'Air-conditioned transport throughout' },
      { text: 'Olympic Park visit & Riviera Park stroll' },
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Sochi', description: 'Airport arrival, meet representative, transfer to hotel and check-in. Evening at leisure.' },
      { day: 2, title: 'Sochi City Tour', description: 'Breakfast. 10:00 AM panoramic city tour covering promenade, Riviera Park, Olympic venues, sea port and observation platforms. Return to hotel by 15:00.' },
      { day: 3, title: 'Day at Leisure', description: 'Breakfast included. Full day free to explore the Black Sea coast, beaches, or optional mountain excursions.' },
      { day: 4, title: 'Departure', description: 'Breakfast, hotel checkout and transfer to Sochi airport.' },
    ],
    featured: true, order: 1,
  },
  {
    title: 'Saint Petersburg 5 Days Tour',
    slug: 'saint-petersburg-5-days',
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/petersburg-St.Isaak-cathedral.jpg',
    duration: '5 Days / 4 Nights',
    price: 'From $323 per person',
    description: "A comprehensive exploration of Russia's cultural capital featuring historical landmarks, metro art tours, and imperial palaces.",
    highlights: [
      { text: '4 nights stay in Saint Petersburg (Park Inn Radisson / Hotel Dostoevsky 4★)' },
      { text: '4 buffet breakfasts included' },
      { text: 'City panoramic tour with metro ride — 5 hours' },
      { text: 'Nevsky Prospect, Winter Palace, St. Isaac\'s Cathedral, Bronze Horseman' },
      { text: 'Professional English-speaking guide' },
      { text: 'Airport/railway station transfers' },
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Saint Petersburg', description: 'Airport arrival, representative meet, hotel transfer and check-in.' },
      { day: 2, title: 'City Panoramic Tour', description: 'Breakfast. 10:00 AM panoramic city tour covering Nevsky Prospect, Winter Palace, St. Isaac\'s Cathedral, Bronze Horseman, and metro tour. Return by 15:00.' },
      { day: 3, title: 'Day at Leisure', description: 'Breakfast included. Full day free to explore the city independently.' },
      { day: 4, title: 'Day at Leisure', description: 'Breakfast included. Optional excursions to Peterhof or Catherine\'s Palace available.' },
      { day: 5, title: 'Departure', description: 'Breakfast, hotel checkout and transfer to airport.' },
    ],
    featured: true, order: 2,
  },
  {
    title: 'Murmansk 4 Days Tour',
    slug: 'murmansk-4-days',
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/package-1.png',
    duration: '4 Days / 3 Nights',
    price: 'From $344 per person',
    description: "An Arctic adventure featuring Murmansk's unique northern attractions including the Lenin nuclear icebreaker, aurora hunting, and authentic Sami culture.",
    highlights: [
      { text: '3 nights stay in Murmansk 3★ hotel with breakfast' },
      { text: 'Murmansk city tour including Lenin Icebreaker' },
      { text: 'Aurora Borealis hunting tour (Oct–Mar)' },
      { text: 'Lenin Icebreaker museum entry ticket included' },
      { text: 'Airport-to-hotel transfers' },
      { text: 'English-speaking guide throughout' },
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Murmansk', description: 'Airport arrival, representative meet, hotel check-in. Afternoon city tour including the Lenin nuclear icebreaker museum. Evening Aurora hunting tour (weather permitting).' },
      { day: 2, title: 'Day at Leisure', description: 'Breakfast included. Day free — optional husky rides, reindeer farm visits, or Sami cultural experiences.' },
      { day: 3, title: 'Day at Leisure', description: 'Breakfast included. Full free day to explore the Arctic capital.' },
      { day: 4, title: 'Departure', description: 'Breakfast, hotel checkout and transfer to Murmansk airport.' },
    ],
    featured: true, order: 3,
  },
  {
    title: 'Moscow 5 Days Tour',
    slug: 'moscow-5-days',
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Moscow-GUM-mall.jpg',
    duration: '5 Days / 4 Nights',
    price: 'From $280 per person',
    description: "A comprehensive Moscow city experience covering iconic landmarks, Soviet-era architecture, underground palaces, and Russia's most celebrated boulevard.",
    highlights: [
      { text: '4 nights stay in Moscow (Cosmos / Maxima Slavia 3★ or similar)' },
      { text: '3 buffet breakfasts included' },
      { text: 'Moscow panoramic city tour with metro ride — 5 hours' },
      { text: 'Red Square, Kremlin exterior, GUM, Christ the Savior Cathedral, Sparrow Hills' },
      { text: 'Old Arbat Street walk' },
      { text: 'Professional English-speaking guide' },
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Moscow', description: 'Airport arrival, comfortable coach transfer to hotel, check-in.' },
      { day: 2, title: 'Moscow City Tour', description: 'Breakfast. 10:00 AM panoramic tour: Red Square, Kremlin, GUM, Christ the Savior Cathedral, Victory Park, Sparrow Hills observation platform, metro tour, Arbat street walk. Return by 15:00.' },
      { day: 3, title: 'Day at Leisure', description: 'Breakfast included. Day free to explore Moscow independently.' },
      { day: 4, title: 'Day at Leisure', description: 'Breakfast included. Optional Tretyakov Gallery, Gorky Park, or day trips available.' },
      { day: 5, title: 'Departure', description: 'Breakfast, hotel checkout and airport transfer.' },
    ],
    featured: true, order: 4,
  },
  {
    title: 'Moscow & Sochi 8 Days Tour',
    slug: 'moscow-sochi-8-days',
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Moscow-VDNH.jpg',
    duration: '8 Days / 7 Nights',
    price: 'From $665 per person',
    description: "Russia's ultimate dual-city experience — explore Moscow's imperial grandeur then fly south to Sochi's Black Sea coast for mountain resorts and coastal leisure.",
    highlights: [
      { text: '4 nights in Moscow (Holiday Inn / Novotel 4★)' },
      { text: '3 nights in Sochi (Park Inn Radisson / Gorki Grand 4★)' },
      { text: '7 buffet breakfasts included' },
      { text: 'Moscow city tour with metro ride (5 hours)' },
      { text: 'Sochi city orientation tour (4 hours)' },
      { text: 'Internal flight Moscow–Sochi included' },
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Moscow', description: 'Airport arrival and hotel check-in.' },
      { day: 2, title: 'Moscow City Tour', description: 'Breakfast. Panoramic tour: Red Square, Kremlin, GUM, Sparrow Hills, metro ride, Arbat street walk.' },
      { day: 3, title: 'Moscow — Day at Leisure', description: 'Breakfast. Free day to explore Moscow.' },
      { day: 4, title: 'Moscow — Day at Leisure', description: 'Breakfast. Another free day in the capital.' },
      { day: 5, title: 'Fly to Sochi', description: 'Breakfast. Transfer to airport, flight to Sochi, hotel check-in.' },
      { day: 6, title: 'Sochi City Tour', description: 'Breakfast. City orientation: Riviera Park, Olympic venues, promenade, sea port.' },
      { day: 7, title: 'Sochi — Day at Leisure', description: 'Breakfast. Free day on the Black Sea coast.' },
      { day: 8, title: 'Departure from Sochi', description: 'Breakfast, checkout and transfer to Sochi airport.' },
    ],
    featured: true, order: 5,
  },
  {
    title: 'Moscow & Saint Petersburg 7 Days Tour',
    slug: 'moscow-saint-petersburg-7-days',
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Moscow-Ukraine-hotel.jpg',
    duration: '7 Days / 6 Nights',
    price: 'From $587 per person',
    description: "Russia's two great capitals in one unforgettable journey — imperial palaces, world-class museums, Soviet monuments, and high-speed Sapsan train travel.",
    highlights: [
      { text: '3 nights in Moscow (Holiday Inn / Novotel 4★)' },
      { text: '3 nights in Saint Petersburg (Park Inn / Hotel Dostoevsky 4★)' },
      { text: '6 buffet breakfasts included' },
      { text: 'Moscow and Saint Petersburg panoramic city tours (5 hours each)' },
      { text: 'Sapsan/Nevski Express train ticket (economy) included' },
      { text: 'Professional English-speaking guides' },
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Moscow', description: 'Airport arrival, transfer to hotel, check-in.' },
      { day: 2, title: 'Moscow City Tour', description: 'Breakfast. Panoramic Moscow tour: Red Square, Kremlin, Sparrow Hills, metro ride, Arbat walk.' },
      { day: 3, title: 'Moscow — Day at Leisure', description: 'Breakfast. Free day in Moscow.' },
      { day: 4, title: 'Train to Saint Petersburg', description: 'Breakfast. Transfer to station, Sapsan train to Saint Petersburg, hotel check-in.' },
      { day: 5, title: 'Saint Petersburg City Tour', description: 'Breakfast. Panoramic tour: Nevsky Prospect, Winter Palace, St. Isaac\'s Cathedral, Bronze Horseman.' },
      { day: 6, title: 'Saint Petersburg — Day at Leisure', description: 'Breakfast. Free day to explore the city.' },
      { day: 7, title: 'Departure', description: 'Breakfast, checkout and transfer to airport.' },
    ],
    featured: false, order: 6,
  },
  {
    title: 'Golden Ring Tour — 13 Days',
    slug: 'golden-ring-13-days',
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Petersburg-Hermitage.jpg',
    duration: '13 Days / 12 Nights',
    price: 'From $2,680 per person',
    description: "Russia's ultimate heritage journey — Moscow, the ancient Golden Ring cities, and Saint Petersburg, covering medieval kremlin walls, UNESCO monasteries, and imperial palaces.",
    highlights: [
      { text: '12 hotel nights with breakfast (4★ major cities, 3★ regional towns)' },
      { text: 'Moscow panoramic tour with metro + Kremlin' },
      { text: 'Saint Trinity Sergius Lavra, Sergiev Posad' },
      { text: 'Vladimir, Suzdal, Kostroma, Yaroslavl, Rostov Veliky' },
      { text: 'Hermitage Museum, Peterhof Palace, Neva River boat ride' },
      { text: 'Sapsan train Moscow–Saint Petersburg included' },
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Moscow', description: 'Airport transfer and hotel check-in.' },
      { day: 2, title: 'Moscow Highlights', description: 'Red Square, GUM, Alexander\'s Garden, Christ the Savior Cathedral, Kremlin tour.' },
      { day: 3, title: 'Sergiev Posad', description: 'Excursion to Saint Trinity Sergius Lavra monastery (UNESCO), 69 km from Moscow.' },
      { day: 4, title: 'Moscow → Vladimir → Suzdal', description: 'Golden Gates of Vladimir, Cathedral of St. Demetrius, Assumption Cathedral.' },
      { day: 5, title: 'Suzdal → Kostroma', description: 'Kremlin of Suzdal, Open-Air Museum of Wooden Architecture, Ivanovo textile city.' },
      { day: 6, title: 'Kostroma → Yaroslavl', description: 'Assumption Cathedral, Volzhskaya embankment, UNESCO historic centre.' },
      { day: 7, title: 'Yaroslavl → Rostov Veliky', description: 'Lake Nero, Rostov Kremlin, ancient monasteries.' },
      { day: 8, title: 'Rostov → Moscow', description: 'Return to Moscow.' },
      { day: 9, title: 'Moscow → Saint Petersburg', description: 'Sapsan high-speed train to Saint Petersburg.' },
      { day: 10, title: 'Saint Petersburg — Hermitage', description: 'Panoramic tour, Nevsky Prospect, Winter Palace, Hermitage Museum.' },
      { day: 11, title: 'Peterhof & Neva Cruise', description: 'Peterhof Palace and gardens, Neva River boat ride.' },
      { day: 12, title: 'Saint Petersburg — Day at Leisure', description: 'Free day to explore the city.' },
      { day: 13, title: 'Departure', description: 'Checkout and airport transfer.' },
    ],
    featured: false, order: 7,
  },
  {
    title: 'Moscow, Saint Petersburg & Sochi — 11 Days',
    slug: 'moscow-spb-sochi-11-days',
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/banner-inner.jpg',
    duration: '11 Days / 10 Nights',
    price: 'From $977 per person',
    description: "Russia's three iconic destinations in one grand tour — the capital's grandeur, the cultural splendour of Saint Petersburg, and the Black Sea warmth of Sochi.",
    highlights: [
      { text: '4 nights in Moscow, 3 nights in Saint Petersburg, 3 nights in Sochi' },
      { text: '10 buffet breakfasts included' },
      { text: 'City tours in all three destinations' },
      { text: 'Train Saint Petersburg–Moscow included' },
      { text: 'Internal flights Moscow–Sochi and Sochi–Saint Petersburg' },
      { text: 'Professional English-speaking guides throughout' },
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Moscow', description: 'Airport arrival and hotel check-in.' },
      { day: 2, title: 'Moscow City Tour', description: 'Panoramic tour: Red Square, Kremlin, Sparrow Hills, metro ride, Arbat walk.' },
      { day: 3, title: 'Moscow — Day at Leisure', description: 'Free day in Moscow.' },
      { day: 4, title: 'Moscow → Sochi', description: 'Flight to Sochi, hotel check-in.' },
      { day: 5, title: 'Sochi City Tour', description: 'Riviera Park, Olympic Park, Black Sea promenade.' },
      { day: 6, title: 'Sochi — Day at Leisure', description: 'Free day on the coast.' },
      { day: 7, title: 'Sochi → Saint Petersburg', description: 'Flight to Saint Petersburg, hotel check-in.' },
      { day: 8, title: 'Saint Petersburg City Tour', description: 'Nevsky Prospect, Winter Palace, St. Isaac\'s Cathedral, Bronze Horseman.' },
      { day: 9, title: 'Saint Petersburg — Day at Leisure', description: 'Free day.' },
      { day: 10, title: 'Saint Petersburg → Moscow', description: 'Train to Moscow, hotel check-in.' },
      { day: 11, title: 'Departure from Moscow', description: 'Breakfast and airport transfer.' },
    ],
    featured: false, order: 8,
  },
]

const TESTIMONIALS = [
  {
    author: 'Ishant Ray',
    role: 'Traveler',
    quote: 'The packages offered were simply amazing! You get to do everything on your bucket list. The trip was wonderfully planned with all key attractions covered.',
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/ishant.png',
    featured: true, order: 1,
  },
  {
    author: 'Md. Amir Hassan',
    role: 'Corporate Traveler',
    quote: 'The local guide was extremely friendly and helped navigate the city without any trouble. Satguru\'s attention to detail made our Russia trip truly memorable.',
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/amir.png',
    featured: true, order: 2,
  },
  {
    author: 'Sarah Trevor',
    role: 'Leisure Traveler',
    quote: 'The service at Satguru is outstanding! The manager scheduled our tickets immediately after booking. Everything was organised to perfection — highly recommended!',
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/testi1.png',
    featured: true, order: 3,
  },
]

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🌍 Satguru DMC — CMS Seed Script')
  console.log('='.repeat(45))

  const token = await login()

  // ── Tour Packages (home page expand cards) ──
  console.log('\n📦 Seeding Tour Packages (home page)…')
  await clearCollection(token, 'tour-packages')
  for (const pkg of TOUR_PACKAGES) {
    const doc = await post(token, 'tour-packages', pkg)
    if (doc) console.log(`  ✅ ${pkg.title}`)
  }

  // ── Destinations ──
  console.log('\n🗺  Seeding Destinations…')
  await clearCollection(token, 'destinations')
  for (const dest of DESTINATIONS) {
    const doc = await post(token, 'destinations', dest)
    if (doc) console.log(`  ✅ ${dest.title}`)
  }

  // ── Itineraries ──
  console.log('\n✈️  Seeding Itineraries (tour packages)…')
  await clearCollection(token, 'itineraries')
  for (const itin of ITINERARIES) {
    const doc = await post(token, 'itineraries', itin)
    if (doc) console.log(`  ✅ ${itin.title}`)
  }

  // ── Testimonials ──
  console.log('\n💬 Seeding Testimonials…')
  await clearCollection(token, 'testimonials')
  for (const t of TESTIMONIALS) {
    const doc = await post(token, 'testimonials', t)
    if (doc) console.log(`  ✅ ${t.author}`)
  }

  console.log('\n🎉 Seed complete! Open http://localhost:3002/admin to verify.')
  console.log('   Home page expand cards will load from the CMS automatically.')
}

main().catch(err => { console.error(err); process.exit(1) })
