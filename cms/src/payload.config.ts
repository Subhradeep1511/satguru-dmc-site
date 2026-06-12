import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { up as migration0Up, down as migration0Down } from './migrations/20240101_initial.js'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { TourPackages } from './collections/TourPackages'
import { Destinations } from './collections/Destinations'
import { Excursions } from './collections/Excursions'
import { Itineraries } from './collections/Itineraries'
import { BlogPosts } from './collections/BlogPosts'
import { GalleryItems } from './collections/GalleryItems'
import { Testimonials } from './collections/Testimonials'
import { Bloggers } from './collections/Bloggers'
import { MediaBanners } from './collections/MediaBanners'
import { HomeBannerSlides } from './collections/HomeBannerSlides'
import { BlogCategories } from './collections/BlogCategories'
import { ExploreBannerSlides } from './collections/ExploreBannerSlides'
import { ExploreListings } from './collections/ExploreListings'
import { ItinerariesBannerSlides } from './collections/ItinerariesBannerSlides'
import { PackageBannerSlides } from './collections/PackageBannerSlides'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// ── Seed data — 6 tour packages from satgurutravel.ru/dmc/ ───────────────────
const SEED_TOUR_PACKAGES = [
  { title: 'Murmansk',         order: 1, featured: true, link: 'murmansk.html',         imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/aerial-view-of-murmansk-in-the-summer-2021-10-13-17-03-10-utc.jpg', description: 'Above the Arctic Circle, Murmansk delivers breathtaking Northern Lights spectacles, polar day adventures and authentic Russian Arctic culture.' },
  { title: 'Moscow',           order: 2, featured: true, link: 'moscow.html',           imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/siberian-winter-inspiration_t20_z2x4J4-scaled.jpg',            description: "Russia's dynamic capital — Red Square, the Kremlin, Tretyakov Gallery and a thriving modern arts scene." },
  { title: 'Golden Ring',      order: 3, featured: true, link: 'golden-ring.html',      imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/golden-ring-3.jpg',                                              description: 'Ancient Russian towns — Sergiev Posad, Vladimir, Suzdal and Yaroslavl — preserving medieval kremlin walls and Orthodox heritage.' },
  { title: 'Kazan',            order: 4, featured: true, link: 'kazan.html',            imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Winter.jpg',                                                      description: 'The multicultural capital of Tatarstan — UNESCO Kazan Kremlin, the grand Qolsharif Mosque and a unique blend of Russian and Eastern cultures.' },
  { title: 'Sochi',            order: 5, featured: true, link: 'sochi.html',            imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Sochi-city.jpg',                                                 description: "The 'Russian Riviera' — golden Black Sea beaches, alpine mountain resorts and the 2014 Winter Olympics venues." },
  { title: 'Saint Petersburg', order: 6, featured: true, link: 'saint-petersburg.html', imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/St.-Petersburg.jpg',                                            description: "Russia's cultural heart — baroque palaces, the Hermitage, romantic canals and the legendary White Nights." },
]

// ── Seed data — 8 itinerary packages from satgurutravel.ru/dmc/packages/ ──────
const SEED_ITINERARIES = [
  { title: 'Sochi',                         order: 1, featured: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Sochi-beach.jpg',                         slug: 'sochi-tour',           duration: '4 Days / 3 Nights', price: 'From $370' },
  { title: 'Saint Petersburg & Moscow',     order: 2, featured: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/petersburg-St.Isaak-cathedral.jpg',        slug: 'spb-moscow-tour',      duration: '5 Days / 4 Nights', price: 'From $323' },
  { title: 'Murmansk & Moscow',             order: 3, featured: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/package-1.png',                            slug: 'murmansk-moscow-tour', duration: '4 Days / 3 Nights', price: 'From $344' },
  { title: 'Moscow',                        order: 4, featured: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Moscow-GUM-mall.jpg',                      slug: 'moscow-tour',          duration: '5 Days / 4 Nights', price: 'From $280' },
  { title: 'Moscow & Sochi',                order: 5, featured: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Moscow-VDNH.jpg',                          slug: 'moscow-sochi-tour',    duration: '8 Days / 7 Nights', price: 'From $665' },
  { title: 'Golden Ring Tour',              order: 6, featured: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Petersburg-Hermitage.jpg',                 slug: 'golden-ring-tour',     duration: '13 Days / 12 Nights', price: 'From $2,680' },
  { title: 'Moscow & Saint Petersburg',     order: 7, featured: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Moscow-Ukraine-hotel.jpg',                 slug: 'moscow-spb-tour',      duration: '7 Days / 6 Nights', price: 'From $587' },
  { title: 'Moscow, St. Petersburg & Sochi', order: 8, featured: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/banner-inner.jpg',                       slug: 'moscow-spb-sochi-tour', duration: '11 Days / 10 Nights', price: 'From $977' },
]

export default buildConfig({
  onInit: async (payload) => {
    // ── Admin user (re-seeded on every cold start since /tmp DB is ephemeral) ─
    try {
      const existingUsers = await payload.find({ collection: 'users', limit: 1 })
      if (existingUsers.totalDocs === 0 && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
        await payload.create({
          collection: 'users',
          data: {
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            name: process.env.ADMIN_NAME || 'Admin',
            role: 'admin',
          },
        })
        payload.logger.info('✅ Admin user seeded')
      }
    } catch (_) {}

    // ── Package Banner Slides (detail page banners) ───────────────────────────
    try {
      // Check per-slug so new pages get seeded even if collection already has data
      const checkSlug = await payload.find({ collection: 'package-banner-slides', where: { packageSlug: { equals: 'golden-ring' } }, limit: 1, depth: 0 })
      if (checkSlug.totalDocs === 0) {
        payload.logger.info('🖼️  Seeding Package Banner Slides…')
        const SEED_PKG_BANNERS = [
          // Moscow & Saint Petersburg
          { title: 'Moscow Ukraine Hotel',      packageSlug: 'moscow-spb',       order: 1, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Moscow-Ukraine-hotel.jpg' },
          { title: 'Saint Petersburg',          packageSlug: 'moscow-spb',       order: 2, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Petersburg.jpg' },
          { title: 'Moscow Kremlin',            packageSlug: 'moscow-spb',       order: 3, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Moscow-Kremlin.png' },
          { title: 'Petersburg Bridge',         packageSlug: 'moscow-spb',       order: 4, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Petersburg-bridge.jpg' },
          // Sochi
          { title: 'Sochi Beach',              packageSlug: 'sochi',            order: 1, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Sochi-beach.jpg' },
          { title: 'Sochi City',               packageSlug: 'sochi',            order: 2, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Sochi-city.jpg' },
          { title: 'Sochi Roza Khutor',        packageSlug: 'sochi',            order: 3, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Sochi-Roza-Khutor.jpg' },
          // Saint Petersburg
          { title: 'Saint Petersburg View',    packageSlug: 'spb-moscow',       order: 1, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Petersburg.jpg' },
          { title: 'St Isaak Cathedral',       packageSlug: 'spb-moscow',       order: 2, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/petersburg-St.Isaak-cathedral.jpg' },
          { title: 'Hermitage',                packageSlug: 'spb-moscow',       order: 3, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Petersburg-Hermitage.jpg' },
          // Murmansk
          { title: 'Murmansk Aerial',          packageSlug: 'murmansk-moscow',  order: 1, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/aerial-view-of-murmansk-in-the-summer-2021-10-13-17-03-10-utc.jpg' },
          { title: 'Northern Lights',          packageSlug: 'murmansk-moscow',  order: 2, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/8-Northern-lights.jpg' },
          { title: 'Murmansk Port',            packageSlug: 'murmansk-moscow',  order: 3, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/murmansk-port.jpg' },
          // Moscow
          { title: 'Moscow Red Square',        packageSlug: 'moscow',           order: 1, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Moscow-Red_square-1.jpg' },
          { title: 'Moscow City',              packageSlug: 'moscow',           order: 2, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Moscow-city-1.jpg' },
          { title: 'Moscow GUM',               packageSlug: 'moscow',           order: 3, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Moscow-GUM-mall.jpg' },
          // Moscow & Sochi
          { title: 'Moscow VDNH',              packageSlug: 'moscow-sochi',     order: 1, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Moscow-VDNH.jpg' },
          { title: 'Sochi Beach',              packageSlug: 'moscow-sochi',     order: 2, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Sochi-beach.jpg' },
          { title: 'Moscow Kremlin',           packageSlug: 'moscow-sochi',     order: 3, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Moscow-Kremlin.jpg' },
          // Moscow, St. Petersburg & Sochi
          { title: 'Multi City 1',             packageSlug: 'moscow-spb-sochi', order: 1, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/img1.jpg' },
          { title: 'Multi City 2',             packageSlug: 'moscow-spb-sochi', order: 2, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/img-7.jpg' },
          { title: 'Multi City 3',             packageSlug: 'moscow-spb-sochi', order: 3, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/img-5.jpg' },
          // Golden Ring Tour
          { title: 'Yaroslavl',                packageSlug: 'golden-ring',      order: 1, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Yaroslavl.jpg' },
          { title: 'Suzdal',                   packageSlug: 'golden-ring',      order: 2, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Suzdal.jpg' },
          { title: 'Sergiev Posad',            packageSlug: 'golden-ring',      order: 3, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Sergiev-Posad.jpg' },
        ]
        for (const s of SEED_PKG_BANNERS) {
          await payload.create({ collection: 'package-banner-slides', data: s })
        }
        payload.logger.info('✅ Package Banner Slides seeded')
      }
    } catch (_) {}

    // ── Itineraries Banner Slides (Popular Itineraries page hero) ─────────────
    try {
      const existingItinBanner = await payload.find({ collection: 'itineraries-banner-slides', limit: 1, depth: 0 })
      if (existingItinBanner.totalDocs === 0) {
        payload.logger.info('🖼️  Seeding Itineraries Banner Slides…')
        const SEED_ITIN_BANNER = [
          { title: 'Sochi Beach',            order: 1, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Sochi-beach.jpg' },
          { title: 'Saint Petersburg',       order: 2, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Petersburg.jpg' },
          { title: 'Moscow City',            order: 3, active: true, imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/Moscow-Ukraine-hotel.jpg' },
        ]
        for (const s of SEED_ITIN_BANNER) {
          await payload.create({ collection: 'itineraries-banner-slides', data: s })
        }
        payload.logger.info('✅ Itineraries Banner Slides seeded')
      }
    } catch (_) {}

    // ── Itineraries (Popular Itineraries page packages) ───────────────────────
    try {
      const existingItin = await payload.find({ collection: 'itineraries', limit: 1, depth: 0 })
      if (existingItin.totalDocs === 0) {
        payload.logger.info('📦 Seeding Itineraries…')
        for (const itin of SEED_ITINERARIES) {
          await payload.create({ collection: 'itineraries', data: itin })
        }
        payload.logger.info(`✅ ${SEED_ITINERARIES.length} Itineraries seeded`)
      }
    } catch (_) {}

    // ── Tour Packages ─────────────────────────────────────────────────────────
    try {
      const existing = await payload.find({ collection: 'tour-packages', limit: 1, depth: 0 })
      if (existing.totalDocs === 0) {
        payload.logger.info('🌍 Seeding Tour Packages…')
        for (const pkg of SEED_TOUR_PACKAGES) {
          await payload.create({ collection: 'tour-packages', data: pkg })
        }
        payload.logger.info(`✅ ${SEED_TOUR_PACKAGES.length} Tour Packages seeded`)
      }
    } catch (_) {}

    // ── Destinations (Explore Page) ────────────────────────────────────────────
    try {
      const existingDests = await payload.find({ collection: 'destinations', limit: 1, depth: 0 })
      if (existingDests.totalDocs === 0) {
        payload.logger.info('🗺️  Seeding Destinations…')
        const SEED_DESTINATIONS = [
          { title: 'Murmansk',         slug: 'murmansk',         heroImage: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/aerial-view-of-murmansk-in-the-summer-2021-10-13-17-03-10-utc.jpg', order: 1, active: true },
          { title: 'Moscow',           slug: 'moscow',           heroImage: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/siberian-winter-inspiration_t20_z2x4J4-scaled.jpg',            order: 2, active: true },
          { title: 'Golden Ring',      slug: 'golden-ring',      heroImage: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/golden-ring-3.jpg',                                              order: 3, active: true },
          { title: 'Kazan',            slug: 'kazan',            heroImage: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Winter.jpg',                                                      order: 4, active: true },
          { title: 'Sochi',            slug: 'sochi',            heroImage: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Sochi-city.jpg',                                                 order: 5, active: true },
          { title: 'Saint Petersburg', slug: 'saint-petersburg', heroImage: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/St.-Petersburg.jpg',                                            order: 6, active: true },
        ]
        for (const dest of SEED_DESTINATIONS) {
          await payload.create({ collection: 'destinations', data: dest })
        }
        payload.logger.info(`✅ ${SEED_DESTINATIONS.length} Destinations seeded`)
      }
    } catch (_) {}

    // ── Explore Listings (6 destination cards on Explore page) ──────────────────
    try {
      const existingListings = await payload.find({ collection: 'explore-listings', limit: 1, depth: 0 })
      if (existingListings.totalDocs === 0) {
        payload.logger.info('🗺️  Seeding Explore Listings from existing excursion home-feature records…')
        const homeCards = await payload.find({ collection: 'excursions', where: { homeFeature: { equals: true } }, sort: 'destinationOrder', limit: 20, depth: 0 })
        for (const exc of homeCards.docs) {
          await payload.create({
            collection: 'explore-listings',
            data: {
              destinationName: exc.title || (exc as any).destinationTitle || '',
              destinationSlug: (exc as any).destinationSlug || '',
              imageUrl: (exc as any).imageUrl || (exc as any).destinationHeroImage || '',
              order: (exc as any).destinationOrder ?? (exc as any).order ?? 0,
              active: true,
            },
          })
        }
        payload.logger.info(`✅ ${homeCards.docs.length} Explore Listings seeded`)
      }
    } catch (_) {}

    // ── Explore Banner Slides ───────────────────────────────────────────────────
    try {
      const existingExploreBanner = await payload.find({ collection: 'explore-banner-slides', limit: 1, depth: 0 })
      if (existingExploreBanner.totalDocs === 0) {
        payload.logger.info('🖼️  Seeding Explore Banner Slides…')
        const SEED_EXPLORE_SLIDES = [
          { title: 'Murmansk Banner',         imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/aerial-view-of-murmansk-in-the-summer-2021-10-13-17-03-10-utc.jpg', order: 1, active: true },
          { title: 'Moscow Banner',           imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/siberian-winter-inspiration_t20_z2x4J4-scaled.jpg',            order: 2, active: true },
          { title: 'Golden Ring Banner',      imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/golden-ring-3.jpg',                                              order: 3, active: true },
          { title: 'Kazan Banner',            imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Winter.jpg',                                                      order: 4, active: true },
          { title: 'Sochi Banner',            imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Sochi-city.jpg',                                                 order: 5, active: true },
          { title: 'Saint Petersburg Banner', imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/St.-Petersburg.jpg',                                            order: 6, active: true },
        ]
        for (const slide of SEED_EXPLORE_SLIDES) {
          await payload.create({ collection: 'explore-banner-slides', data: slide })
        }
        payload.logger.info(`✅ ${SEED_EXPLORE_SLIDES.length} Explore Banner Slides seeded`)
      }
    } catch (_) {}

    // ── Blog Categories ────────────────────────────────────────────────────────
    try {
      const existingCats = await payload.find({ collection: 'blog-categories', limit: 1, depth: 0 })
      if (existingCats.totalDocs === 0) {
        payload.logger.info('🏷️  Seeding Blog Categories…')
        const SEED_CATS = [
          { name: 'About New Packages',    slug: 'packages',    order: 1, active: true },
          { name: 'Promotion',             slug: 'promotion',   order: 2, active: true },
          { name: 'Destination Information', slug: 'destination', order: 3, active: true },
          { name: 'Attractions',           slug: 'attractions', order: 4, active: true },
        ]
        for (const cat of SEED_CATS) {
          await payload.create({ collection: 'blog-categories', data: cat })
        }
        payload.logger.info(`✅ ${SEED_CATS.length} Blog Categories seeded`)
      }
    } catch (_) {}

    // ── Blog Posts ─────────────────────────────────────────────────────────────
    try {
      const existingBlogs = await payload.find({ collection: 'blog-posts', limit: 1, depth: 0 })
      if (existingBlogs.totalDocs === 0) {
        payload.logger.info('📝 Seeding Blog Posts…')
        const BLOG_TITLE = 'Modern Corporate Travel: Key Benefits, Challenges And Future'
        const BLOG_EXCERPT = 'Explore curated insights on travel trends, destinations, and corporate solutions tailored to simplify every journey.'
        const PROMO_IMG = 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=700'
        const SEED_BLOGS = [
          // Packages — 8 cards (blog-1 to blog-8)
          ...Array.from({ length: 8 }, (_, i) => ({
            title: BLOG_TITLE, excerpt: BLOG_EXCERPT,
            category: 'packages', featured: false,
          })),
          // Promotion — 8 cards
          ...Array.from({ length: 8 }, () => ({
            title: BLOG_TITLE, excerpt: BLOG_EXCERPT,
            category: 'promotion', featured: false,
          })),
          // Destination — 4 cards
          ...Array.from({ length: 4 }, () => ({
            title: BLOG_TITLE, excerpt: BLOG_EXCERPT,
            category: 'destination', featured: false,
          })),
          // Attractions — 4 cards
          ...Array.from({ length: 4 }, () => ({
            title: BLOG_TITLE, excerpt: BLOG_EXCERPT,
            category: 'attractions', featured: false,
          })),
        ]
        for (const post of SEED_BLOGS) {
          await payload.create({ collection: 'blog-posts', data: post })
        }
        payload.logger.info(`✅ ${SEED_BLOGS.length} Blog Posts seeded`)
      }
    } catch (_) {}

    // ── Gallery Items ──────────────────────────────────────────────────────────
    try {
      const existingGallery = await payload.find({ collection: 'gallery-items', limit: 1, depth: 0 })
      if (existingGallery.totalDocs === 0) {
        payload.logger.info('🖼️  Seeding Gallery Items…')
        const GALLERY_DESC = 'Satguru DMC Russia as an elaborate country-wide network.'
        const SEED_GALLERY = [
          { title: 'Where every journey turns into a lifetime memory.', description: GALLERY_DESC, order: 1 },
          { title: 'Where every journey turns into a lifetime memory.', description: GALLERY_DESC, order: 2 },
          { title: 'Where every journey turns into a lifetime memory.', description: GALLERY_DESC, order: 3 },
        ]
        for (const item of SEED_GALLERY) {
          await payload.create({ collection: 'gallery-items', data: item })
        }
        payload.logger.info(`✅ ${SEED_GALLERY.length} Gallery Items seeded`)
      }
    } catch (_) {}

    // ── Testimonials ───────────────────────────────────────────────────────────
    try {
      const existingTesti = await payload.find({ collection: 'testimonials', limit: 1, depth: 0 })
      if (existingTesti.totalDocs === 0) {
        payload.logger.info('💬 Seeding Testimonials…')
        const TESTI_QUOTE = 'The memories made on our trip will last a lifetime. Thank you for an incredible journey'
        const TESTI_IMG = 'assets/img/testimonial-img.webp'
        const SEED_TESTIMONIALS = [
          { quote: TESTI_QUOTE, author: 'Olivia Turner',  role: 'Traveler',   rating: 5, featured: true, order: 1 },
          { quote: TESTI_QUOTE, author: 'Sophia Bennett', role: 'Tourist',   rating: 5, featured: true, order: 2 },
          { quote: TESTI_QUOTE, author: 'Daniel Carter',  role: 'Explorer',  rating: 5, featured: true, order: 3 },
          { quote: TESTI_QUOTE, author: 'James Mitchell', role: 'Adventurer',rating: 5, featured: true, order: 4 },
        ]
        for (const t of SEED_TESTIMONIALS) {
          await payload.create({ collection: 'testimonials', data: t })
        }
        payload.logger.info(`✅ ${SEED_TESTIMONIALS.length} Testimonials seeded`)
      }
    } catch (_) {}

    // ── Bloggers ───────────────────────────────────────────────────────────────
    try {
      const existingBloggers = await payload.find({ collection: 'bloggers', limit: 1, depth: 0 })
      if (existingBloggers.totalDocs === 0) {
        payload.logger.info('🎥 Seeding Bloggers…')
        const SEED_BLOGGERS = [
          { name: 'Raghunath Subramanian', role: 'GLOBAL CEO & EXECUTIVE CHAIRMAN', order: 1 },
          { name: 'Raghunath Subramanian', role: 'GLOBAL CEO & EXECUTIVE CHAIRMAN', order: 2 },
          { name: 'Raghunath Subramanian', role: 'GLOBAL CEO & EXECUTIVE CHAIRMAN', order: 3 },
          { name: 'Raghunath Subramanian', role: 'GLOBAL CEO & EXECUTIVE CHAIRMAN', order: 4 },
        ]
        for (const b of SEED_BLOGGERS) {
          await payload.create({ collection: 'bloggers', data: b })
        }
        payload.logger.info(`✅ ${SEED_BLOGGERS.length} Bloggers seeded`)
      }
    } catch (_) {}

    // ── Explore Page Cards (6 destination overview cards) ────────────────────
    try {
      const existingExc = await payload.find({ collection: 'excursions', limit: 1, depth: 0 })
      if (existingExc.totalDocs === 0) {
        payload.logger.info('🗺️  Seeding Explore Page cards…')
        const SEED_EXCURSIONS = [
          { title: 'Murmansk',         order: 1, homeFeature: true, destinationOrder: 1, destinationTitle: 'Murmansk',         destinationSlug: 'murmansk',         destinationHeroImage: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/aerial-view-of-murmansk-in-the-summer-2021-10-13-17-03-10-utc.jpg', imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/02/aerial-view-of-murmansk-in-the-summer-2021-10-13-17-03-10-utc.jpg', location: 'Murmansk, Russia',         active: true },
          { title: 'Moscow',           order: 2, homeFeature: true, destinationOrder: 2, destinationTitle: 'Moscow',           destinationSlug: 'moscow',           destinationHeroImage: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/siberian-winter-inspiration_t20_z2x4J4-scaled.jpg',            imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2022/01/siberian-winter-inspiration_t20_z2x4J4-scaled.jpg',            location: 'Moscow, Russia',           active: true },
          { title: 'Golden Ring',      order: 3, homeFeature: true, destinationOrder: 3, destinationTitle: 'Golden Ring',      destinationSlug: 'golden-ring',      destinationHeroImage: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/golden-ring-3.jpg',                                              imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/golden-ring-3.jpg',                                              location: 'Vladimir & Suzdal, Russia', active: true },
          { title: 'Kazan',            order: 4, homeFeature: true, destinationOrder: 4, destinationTitle: 'Kazan',            destinationSlug: 'kazan',            destinationHeroImage: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Winter.jpg',                                                      imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Winter.jpg',                                                      location: 'Kazan, Russia',            active: true },
          { title: 'Sochi',            order: 5, homeFeature: true, destinationOrder: 5, destinationTitle: 'Sochi',            destinationSlug: 'sochi',            destinationHeroImage: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Sochi-city.jpg',                                                 imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/Sochi-city.jpg',                                                 location: 'Sochi, Russia',            active: true },
          { title: 'Saint Petersburg', order: 6, homeFeature: true, destinationOrder: 6, destinationTitle: 'Saint Petersburg', destinationSlug: 'saint-petersburg', destinationHeroImage: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/St.-Petersburg.jpg',                                            imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/St.-Petersburg.jpg',                                            location: 'Saint Petersburg, Russia', active: true },
        ]
        for (const exc of SEED_EXCURSIONS) {
        await payload.create({ collection: 'excursions', data: exc })
      }
        payload.logger.info(`✅ ${SEED_EXCURSIONS.length} Explore cards seeded`)
      }
    } catch (_) {}

    // ── Golden Ring detail page excursions ────────────────────────────────────
    try {
      const existingGR = await payload.find({ collection: 'excursions', where: { destinationSlug: { equals: 'golden-ring' }, homeFeature: { equals: false } }, limit: 1, depth: 0 })
      if (existingGR.totalDocs === 0) {
        payload.logger.info('🏰  Seeding Golden Ring excursions…')
        const GR_EXCURSIONS = [
          {
            title: 'Master-class in Matryoshka factory. Sergiev Posad', order: 1, homeFeature: false,
            imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/GR-Master-class-Matryoshka.jpg',
            location: 'Sergiev Posad, Golden Ring, Russia', duration: '1.5 Hours', startTour: 'Your Hotel', transportation: 'By Cab',
            destinationTitle: 'Golden Ring', destinationSlug: 'golden-ring', active: true,
            description: "If you visit Sergiev Posad – the Motherland of Matryoshka wooden toy, you can't miss a chance to visit the Matryoshka factory where professional artisans will show you the whole process of creating the toys. After the excursion you will become an artist and paint your own Matryoshka.",
          },
          {
            title: 'Saint Trinity Sergius Lavra. Sergiev Posad', order: 2, homeFeature: false,
            imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/GR-St-Trinity-Sergius-Lavra.jpg',
            location: 'Sergiev Posad, Golden Ring, Russia', duration: '5 Hours', startTour: 'Your Hotel', transportation: 'By Cab',
            destinationTitle: 'Golden Ring', destinationSlug: 'golden-ring', active: true,
            description: 'One of the oldest monasteries in Russia (founded in 1337) and the most revered one. You will be impressed by the medieval Russian architecture: gorgeous cathedrals with gold-covered domes and the most beautiful 88-metre-high belfry in Russia.',
          },
          {
            title: 'Vladimir City Tour', order: 3, homeFeature: false,
            imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/GR-Vladimir-city-tour.jpg',
            location: 'Golden Ring, Russia', duration: '8 Hours', startTour: 'Your Hotel', transportation: 'By Cab',
            destinationTitle: 'Golden Ring', destinationSlug: 'golden-ring', active: true,
            description: 'Tour begins at the iconic Golden Gates (1158), continues to the Cathedral of St. Demetrius (pre-Mongol period, now a museum), and concludes at the Assumption Cathedral — a magnificent 12th-century Orthodox temple.',
          },
          {
            title: 'Suzdal Town Tour', order: 4, homeFeature: false,
            imageUrl: 'https://satgurutravel.ru/dmc/wp-content/uploads/2021/12/GR-Suzdal.jpg',
            location: 'Golden Ring, Russia', duration: '3 Hours', startTour: 'Your Hotel', transportation: 'By Cab',
            destinationTitle: 'Golden Ring', destinationSlug: 'golden-ring', active: true,
            description: "Visit the Kremlin of Suzdal (12th century) and the Museum of Wooden Architecture, featuring wooden houses, a windmill, and even a functioning Orthodox church from the 18–19th centuries — Russia's best-preserved medieval town.",
          },
        ]
        for (const exc of GR_EXCURSIONS) {
          await payload.create({ collection: 'excursions', data: exc })
        }
        payload.logger.info(`✅ ${GR_EXCURSIONS.length} Golden Ring excursions seeded`)
      }
    } catch (_) {}

  },
  admin: {
    user: Users.slug,
    theme: 'light',
    meta: {
      titleSuffix: '– Satguru DMC CMS',
      icons: '/favicon.ico',
    },
    components: {
      providers: ['@/components/ThemeProvider'],
      afterLogin: ['@/components/AfterLogin'],
      graphics: {
        Logo: '@/components/AdminLogo',
        Icon: '@/components/AdminLogo',
      },
      views: {
        dashboard: {
          Component: '@/components/Dashboard',
        },
      },
    },
  },
  collections: [
    Users,
    Media,
    // Home Page
    HomeBannerSlides,
    TourPackages,
    // Explore Page
    ExploreBannerSlides,
    ExploreListings,
    // Popular Itineraries Page
    ItinerariesBannerSlides,
    // Package Detail Pages
    PackageBannerSlides,
    // Blog Categories
    BlogCategories,
    // Destination Pages
    Destinations,
    Excursions,
    // Itineraries / Packages
    Itineraries,
    // Media Page
    BlogPosts,
    GalleryItems,
    Testimonials,
    Bloggers,
    // Page Banners
    MediaBanners,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'satguru-dmc-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: process.env.TURSO_DATABASE_URL
      ? { url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN }
      : { url: process.env.DATABASE_URI || `file:${path.resolve(dirname, '../satguru-cms.db')}` },
    push: true,
    prodMigrations: [{ name: '20240101_initial', up: migration0Up, down: migration0Down }],
  }),
  sharp: sharp as any,
  upload: {
    limits: {
      fileSize: 10_000_000, // 10MB
    },
  },
  cors: [
    'http://localhost:3002',
    'http://localhost:5500',
    'http://localhost:5000',
    'http://localhost:3001',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5000',
    process.env.FRONTEND_URL || '',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  ].filter(Boolean),
  csrf: [
    'http://localhost:3002',
    'http://localhost:5500',
    'http://localhost:5000',
    'http://localhost:3001',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5000',
    process.env.FRONTEND_URL || '',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  ].filter(Boolean),
})
