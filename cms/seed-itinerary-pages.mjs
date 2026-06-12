/**
 * Seeds the 4 standalone itinerary detail pages into the CMS:
 * kazan, murmansk, saint-petersburg, sochi
 *
 * Run: node --experimental-sqlite seed-itinerary-pages.mjs
 */
import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'crypto';

const db = new DatabaseSync('satguru-cms.db');

function uuid() { return randomUUID(); }

function insertItinerary(rec) {
  const existing = db.prepare('SELECT id FROM itineraries WHERE slug = ?').get(rec.slug);
  if (existing) {
    console.log(`  [SKIP] slug "${rec.slug}" already exists (id=${existing.id})`);
    return existing.id;
  }

  const stmt = db.prepare(`
    INSERT INTO itineraries
      (title, slug, image_url, duration, price, featured, "order",
       hero_badge, hero_title, price_double, price_single, hotel_notes, description)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);
  const result = stmt.run(
    rec.title, rec.slug, rec.imageUrl || null, rec.duration || null, rec.price || null,
    rec.featured ? 1 : 0, rec.order || 99,
    rec.heroBadge || null, rec.heroTitle || null,
    rec.priceDouble || null, rec.priceSingle || null, rec.hotelNotes || null,
    rec.description || null
  );
  const id = result.lastInsertRowid;
  console.log(`  [OK] Inserted itinerary "${rec.title}" id=${id}`);

  // Insert days
  for (const day of (rec.itinerary || [])) {
    const dayId = uuid();
    db.prepare(`
      INSERT INTO itineraries_itinerary (_order, _parent_id, id, day, title, description)
      VALUES (?,?,?,?,?,?)
    `).run(day.day, id, dayId, day.day, day.title, day.description || null);

    for (const [hi, h] of (day.highlights || []).entries()) {
      db.prepare(`
        INSERT INTO itineraries_itinerary_highlights (_order, _parent_id, id, icon, bold_text, "text")
        VALUES (?,?,?,?,?,?)
      `).run(hi + 1, dayId, uuid(), h.icon || null, h.boldText || null, h.text || null);
    }
  }

  // Insert inclusions
  for (const [i, inc] of (rec.inclusions || []).entries()) {
    db.prepare(`
      INSERT INTO itineraries_inclusions (_order, _parent_id, id, "text") VALUES (?,?,?,?)
    `).run(i + 1, id, uuid(), inc);
  }

  // Insert gallery
  for (const [i, g] of (rec.gallery || []).entries()) {
    db.prepare(`
      INSERT INTO itineraries_gallery (_order, _parent_id, id, image_url, alt) VALUES (?,?,?,?,?)
    `).run(i + 1, id, uuid(), g.imageUrl || null, g.alt || null);
  }

  return id;
}

// ── DATA ─────────────────────────────────────────────────────

const data = [
  {
    title: 'Kazan',
    slug: 'kazan',
    imageUrl: './assets/img/city-image-1.webp',
    duration: '4 Days / 3 Nights',
    price: 'From $220',
    featured: false,
    order: 20,
    heroBadge: '4 Days Tour',
    heroTitle: 'Kazan',
    priceDouble: '$220',
    priceSingle: '$340',
    hotelNotes: null,
    description: 'Discover Kazan — where East meets West. Explore the Kazan Kremlin, Kul Sharif Mosque, and rich Tatar culture on a guided tour.',
    itinerary: [
      {
        day: 1, title: 'Arrival in Kazan',
        description: 'Arrival at Kazan International Airport. Meet and greet by our representative.\nIndividual transfer to the city by comfortable coach.\nHotel check-in. Early check-in subject to availability.\nEvening welcome dinner and orientation briefing. Overnight in Kazan.',
        highlights: [],
      },
      {
        day: 2, title: 'Kazan City Tour',
        description: 'Breakfast at the hotel.\n09:30 — Full-day guided city tour. Begin at the Kazan Kremlin — a UNESCO World Heritage Site and one of Russia\'s finest kremlins, where Orthodox cathedrals and Islamic minarets stand side by side. Visit the iconic Kul Sharif Mosque, one of the largest mosques in Russia, and the Annunciation Cathedral dating to the 16th century.\n13:00 — Lunch at a local Tatar restaurant. Try traditional dishes such as echpochmak, chak-chak, and tutyrma.\n14:30 — Afternoon stroll along Bauman Street — Kazan\'s lively pedestrian promenade — and visit the Temple of All Religions, a unique architectural landmark blending symbols of the world\'s faiths. Explore the vibrant Kazan city market for local crafts and souvenirs.\n18:00 — Return to hotel. Overnight in Kazan.',
        highlights: [],
      },
      {
        day: 3, title: 'Free Day in Kazan',
        description: 'Breakfast at the hotel.\nDay free for leisure. Optional activities available at extra cost:\nVisit the National Museum of the Republic of Tatarstan to explore Tatar history and culture spanning over a thousand years. Alternatively, take a boat cruise along the Kazanka River for scenic views of the Kremlin and the city skyline.\nSports enthusiasts may visit the Kazan Arena — one of the venues from the 2018 FIFA World Cup — for a guided stadium tour.\nOvernight in Kazan.',
        highlights: [],
      },
      {
        day: 4, title: 'Departure',
        description: 'Breakfast at the hotel.\nCheck out and transfer to Kazan International Airport. We bid you farewell and hope to welcome you back to the wonders of Russia soon.',
        highlights: [],
      },
    ],
    inclusions: [
      '3 nights accommodation in Kazan BB (Ibis / Mercure or similar 3★)',
      '3 buffet breakfasts at the hotel',
      'Full-day guided city tour of Kazan including Kremlin, Kul Sharif Mosque, and Bauman Street',
      'Professional English speaking guide during all tours',
      'Comfortable air-conditioned transport during tours',
      'Return airport transfer (Russian speaking driver — English speaking guide available at $50 for 2 pax)',
      'Entrance fees to listed sites and monuments',
    ],
    gallery: [
      { imageUrl: './assets/img/city-image-1.webp', alt: 'Kazan — Kremlin' },
      { imageUrl: './assets/img/city-image-2.webp', alt: 'Kazan — Kul Sharif Mosque' },
      { imageUrl: './assets/img/city-image-3.webp', alt: 'Kazan — Bauman Street' },
      { imageUrl: './assets/img/city-image-4.webp', alt: 'Kazan — Temple of All Religions' },
      { imageUrl: './assets/img/city-image-5.webp', alt: 'Kazan — Riverside' },
    ],
  },

  {
    title: 'Murmansk',
    slug: 'murmansk',
    imageUrl: './assets/img/city-image-4.webp',
    duration: '4 Days / 3 Nights',
    price: 'From $344',
    featured: false,
    order: 21,
    heroBadge: '4 Days Tour',
    heroTitle: 'Murmansk',
    priceDouble: '$344',
    priceSingle: null,
    hotelNotes: '3★ Hotel',
    description: 'Experience the Arctic city of Murmansk — city tour, the Lenin icebreaker museum, and an unforgettable Aurora Borealis hunting tour.',
    itinerary: [
      {
        day: 1, title: 'Arrival & Murmansk City Tour',
        description: 'Arrival at the airport. Meet with our representative.\nHotel check in. Early check-in is subject to availability.\nTransfer to the city — Murmansk city tour exploring the monuments, Alyosha Memorial (the famous soldier statue overlooking the bay), the Seamen\'s Memorial, and the Arctic city\'s unique landscapes.\nOvernight at the hotel.',
        highlights: [
          { icon: 'ri-ship-line', boldText: 'Visit the "Lenin" Icebreaker Museum', text: '— board the world\'s first nuclear-powered icebreaker, now a museum ship docked in Murmansk harbour.' },
          { icon: 'ri-flashlight-line', boldText: 'Aurora Hunting Tour', text: '— head out into the Arctic wilderness in search of the spectacular Northern Lights dancing across the polar sky.' },
        ],
      },
      {
        day: 2, title: 'Free Day in Murmansk',
        description: 'Breakfast at the hotel.\nDay free for leisure. Explore the Murmansk Regional Museum, visit the local markets for Arctic delicacies, or take a stroll along the Kola Bay waterfront.',
        highlights: [],
      },
      {
        day: 3, title: 'Free Day in Murmansk',
        description: 'Breakfast at the hotel.\nDay free for leisure. Optional activities include husky sledding, snowmobile tours (seasonal), or a visit to the Sami Village to learn about the indigenous peoples of the Kola Peninsula.',
        highlights: [],
      },
      {
        day: 4, title: 'Departure',
        description: 'Breakfast at the hotel.\nCheck out and transfer to the airport. We bid you farewell and hope to welcome you back to the wonders of Arctic Russia soon.',
        highlights: [],
      },
    ],
    inclusions: [
      '3 nights stay in Murmansk 3★ hotel BB',
      'City tour of Murmansk with guide',
      'Icebreaker "Lenin" museum entry ticket',
      'Aurora Borealis hunting tour',
      'Transportation and guide as per the itinerary',
      'Transfers airport – hotel – airport',
    ],
    gallery: [
      { imageUrl: './assets/img/city-image-4.webp', alt: 'Murmansk — Arctic Landscape' },
      { imageUrl: './assets/img/city-image-5.webp', alt: 'Murmansk — Northern Lights' },
      { imageUrl: './assets/img/city-image-1.webp', alt: 'Murmansk — Lenin Icebreaker' },
      { imageUrl: './assets/img/city-image-2.webp', alt: 'Murmansk — Kola Bay' },
      { imageUrl: './assets/img/city-image-3.webp', alt: 'Murmansk — City View' },
    ],
  },

  {
    title: 'Saint Petersburg',
    slug: 'saint-petersburg',
    imageUrl: './assets/img/city-image-2.webp',
    duration: '5 Days / 4 Nights',
    price: 'From $323',
    featured: false,
    order: 22,
    heroBadge: '5 Days Tour',
    heroTitle: 'Saint Petersburg',
    priceDouble: '$323',
    priceSingle: '$435',
    hotelNotes: null,
    description: 'Discover the cultural capital of Russia — Nevsky Prospect, the Winter Palace, St. Isaac\'s Cathedral, and the stunning metro tour.',
    itinerary: [
      {
        day: 1, title: 'Arrival in St. Petersburg',
        description: 'Morning arrival. Meet with our representative at the airport.\nIndividual transfer to the city by comfortable coach.\nHotel check in. Early check-in is subject to availability.',
        highlights: [],
      },
      {
        day: 2, title: 'Panoramic City Tour',
        description: 'Breakfast at the hotel.\n10:00 — Panoramic city tour which includes the most interesting historical sights of the city: Nevsky Prospect, the Admiralty, the Winter Palace, St. Isaac\'s Cathedral, Church of the Resurrection on Spilled Blood, Fine Arts Square, Smolny Cathedral, the Bronze Horseman, Mars Field, and a visit to Kazan Cathedral.\nMetro tour — explore the stunning architecture of St. Petersburg\'s famous metro stations. During the excursion you will have short stops to enjoy the views and take pictures.\nTransfer to the clinic for PCR test. The exact time will be communicated in advance.\n15:00 — Return to the hotel. Overnight at the hotel.',
        highlights: [],
      },
      {
        day: 3, title: 'Free Day in St. Petersburg',
        description: 'Breakfast at the hotel.\nDay free for leisure. Explore the world-famous Hermitage Museum, stroll along the Neva River embankment, or visit the Peterhof Palace and its spectacular fountains.',
        highlights: [],
      },
      {
        day: 4, title: 'Leisure & PCR Test',
        description: 'Breakfast at the hotel.\nDay free for leisure.\nTransfer to the clinic for PCR test. The exact time will be communicated in advance.',
        highlights: [],
      },
      {
        day: 5, title: 'Departure',
        description: 'Breakfast at the hotel.\nCheck out and transfer to the airport. We bid you farewell and hope to welcome you back to the wonders of Russia soon.',
        highlights: [],
      },
    ],
    inclusions: [
      '4 nights stay in Petersburg BB (Park Inn Radisson Pribaltiyskaya / Hotel Dostoevsky 4★ or similar)',
      '4 buffet breakfasts in the hotel',
      'St. Petersburg city tour with metro ride (5 hours)',
      'Professional English speaking guide during the tours',
      'Comfortable transport with A/C during the tours',
      'Return airport & railway station transfer without guide (Russian speaking driver — English speaking guide available at $60 for 2 pax)',
      'Return PCR test with transfer',
    ],
    gallery: [
      { imageUrl: './assets/img/city-image-2.webp', alt: 'Saint Petersburg — Winter Palace' },
      { imageUrl: './assets/img/city-image-1.webp', alt: 'Saint Petersburg — Nevsky Prospect' },
      { imageUrl: './assets/img/city-image-3.webp', alt: 'Saint Petersburg — St. Isaac\'s Cathedral' },
      { imageUrl: './assets/img/city-image-4.webp', alt: 'Saint Petersburg — Church on Spilled Blood' },
      { imageUrl: './assets/img/city-image-5.webp', alt: 'Saint Petersburg — Neva River' },
    ],
  },

  {
    title: 'Sochi',
    slug: 'sochi',
    imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Sochi-city.jpg',
    duration: '4 Days / 3 Nights',
    price: 'From $370',
    featured: false,
    order: 23,
    heroBadge: '4 Days Tour',
    heroTitle: 'Sochi',
    priceDouble: '$370',
    priceSingle: '$590',
    hotelNotes: null,
    description: 'Explore Sochi — Olympic Park, city sights, Stalin\'s Dacha, and the stunning Black Sea coast.',
    itinerary: [
      {
        day: 1, title: 'Arrival in Sochi',
        description: 'Morning arrival. Meet with our representative at the airport.\nIndividual transfer to the city by comfortable coach.\nHotel check in. Early check-in is subject to availability.',
        highlights: [],
      },
      {
        day: 2, title: 'Panoramic City Tour',
        description: 'Breakfast at the hotel.\n10:00 — Panoramic city tour which includes the most interesting sights of Sochi: the famous Olympic Park and Fisht Olympic Stadium, the Sea Port Embankment, Riviera Park, Stalin\'s Dacha, the Sochi Art Museum, the iconic Sochi Arboretum botanical gardens, and the breathtaking views of the Black Sea coast.\nDuring the tour you will have several stops to enjoy the views and take pictures.\n15:00 — Return to the hotel. Overnight at the hotel.',
        highlights: [],
      },
      {
        day: 3, title: 'Free Day in Sochi',
        description: 'Breakfast at the hotel.\nDay free for leisure. Enjoy the Black Sea beaches, explore the Krasnaya Polyana mountain resort, or take a stroll along the Sochi seafront promenade.',
        highlights: [],
      },
      {
        day: 4, title: 'Departure',
        description: 'Breakfast at the hotel.\nCheck out and transfer to the airport. We bid you farewell and hope to welcome you back to the wonders of Russia soon.',
        highlights: [],
      },
    ],
    inclusions: [
      '3 nights stay in Sochi BB (Park Inn Radisson Sochi / Gorki Grand Hotel 4★ or similar)',
      '3 buffet breakfasts in the hotel',
      'Sochi city tour with guide (4 hours)',
      'Professional English speaking guide during the tours',
      'Comfortable transport with A/C during the tours',
      'Return airport & railway station transfer without guide (Russian speaking driver — English speaking guide available at $60 for 2 pax)',
      'Return PCR test with transfer',
    ],
    gallery: [
      { imageUrl: './assets/img/city-image-3.webp', alt: 'Sochi — Olympic Park' },
      { imageUrl: './assets/img/city-image-4.webp', alt: 'Sochi — Black Sea' },
      { imageUrl: './assets/img/city-image-5.webp', alt: 'Sochi — Riviera Park' },
      { imageUrl: './assets/img/city-image-1.webp', alt: 'Sochi — City View' },
      { imageUrl: './assets/img/city-image-2.webp', alt: 'Sochi — Arboretum' },
    ],
  },
];

// ── RUN ──────────────────────────────────────────────────────
console.log('Seeding itinerary detail pages...\n');
for (const rec of data) {
  console.log(`> ${rec.title} (${rec.slug})`);
  insertItinerary(rec);
}

// Verify
console.log('\nFinal itinerary count:');
const all = db.prepare('SELECT id, slug, title FROM itineraries ORDER BY "order"').all();
all.forEach(r => console.log(' ', r.id, r.slug, '|', r.title));

db.close();
console.log('\nDone.');
