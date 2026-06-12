'use strict';
/* =========================================================
   SATGURU DMC — Payload CMS Client
   All sections that load dynamic content use this module.
   CMS runs at http://localhost:3002 (npm run dev inside /cms)
   ── After Vercel deployment, set PRODUCTION_CMS_URL below ──
========================================================= */
(function (window) {
  // ▼▼▼ SET THIS after deploying CMS to Vercel ▼▼▼
  var PRODUCTION_CMS_URL = 'https://cms-liard-six.vercel.app';
  // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

  var CMS_URL = 'http://localhost:3002';
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    if (PRODUCTION_CMS_URL) {
      // Explicit override — used for Vercel / any custom deployment
      CMS_URL = PRODUCTION_CMS_URL;
    } else if (/^[0-9.]+$/.test(window.location.hostname)) {
      // Staging/VPS via IP Address
      CMS_URL = window.location.protocol + '//' + window.location.hostname + ':3002';
    } else {
      // Custom domain: yourdomain.com → cms.yourdomain.com
      var host = window.location.hostname;
      if (host.startsWith('www.')) host = host.substring(4);
      CMS_URL = window.location.protocol + '//cms.' + host;
    }
  }

  var satguruCMS = {
    url: CMS_URL,

    /* ── Core fetch ──────────────────────────────────── */
    get: async function (endpoint) {
      try {
        // cache: 'no-store' tells the browser never to use its HTTP cache.
        // Do NOT add Cache-Control/Pragma request headers — they trigger CORS preflight
        // which Payload does not allow, causing the fetch to fail silently.
        var res = await fetch(CMS_URL + endpoint, { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return await res.json();
      } catch (e) {
        console.warn('[Satguru CMS] fetch error:', e.message);
        return null;
      }
    },

    /* ── Home Page ───────────────────────────────────── */
    // GET hero banner slider images
    getHomeBannerSlides: async function () {
      return this.get('/api/home-banner-slides?where[active][equals]=true&sort=order&limit=20');
    },

    /* ── Explore Page ────────────────────────────────── */
    getExploreBannerSlides: async function () {
      return this.get('/api/explore-banner-slides?where[active][equals]=true&sort=order&limit=20');
    },

    // GET explore page destination cards (from dedicated ExploreListings collection)
    getExploreListings: async function (limit) {
      return this.get('/api/explore-listings?where[active][equals]=true&sort=order&limit=' + (limit || 10));
    },

    // GET home page "Top Destination" cards (homeFeature=true only, max 5)
    getHomeExploreListings: async function () {
      return this.get('/api/explore-listings?where[homeFeature][equals]=true&where[active][equals]=true&sort=order&limit=5');
    },

    /* ── Popular Itineraries Page ────────────────────── */
    getItinerariesBannerSlides: async function () {
      return this.get('/api/itineraries-banner-slides?where[active][equals]=true&sort=order&limit=20');
    },

    /* ── Package Detail Pages ────────────────────────── */
    getPackageBannerSlides: async function (packageSlug) {
      return this.get('/api/package-banner-slides?where[packageSlug][equals]=' + encodeURIComponent(packageSlug) + '&where[active][equals]=true&sort=order&limit=20');
    },

    // GET tour-package-section expand cards
    getTourPackages: async function () {
      // Shows only featured cards, max 5, ordered by the 'order' field
      return this.get('/api/tour-packages?where[featured][equals]=true&sort=order&limit=5');
    },

    /* ── Destinations ────────────────────────────────── */
    // GET all destinations (for explore-tours-section grid)
    getDestinations: async function (opts) {
      var qs = 'sort=order&limit=' + (opts && opts.limit ? opts.limit : 20);
      if (opts && opts.homeFeature) qs += '&where[homeFeature][equals]=true';
      if (opts && opts.active !== false) qs += '&where[active][equals]=true';
      return this.get('/api/destinations?' + qs);
    },
    // GET single destination by slug
    getDestination: async function (slug) {
      return this.get('/api/destinations?where[slug][equals]=' + encodeURIComponent(slug) + '&limit=1');
    },

    /* ── Excursions ──────────────────────────────────── */
    // GET the 6 explore-page destination cards (homeFeature=true only)
    getExploreExcursions: async function (limit) {
      return this.get('/api/excursions?where[homeFeature][equals]=true&sort=destinationOrder&limit=' + (limit || 6));
    },
    // GET detail-page excursions for a destination (excludes explore overview cards)
    getExcursions: async function (destinationSlug) {
      return this.get('/api/excursions?where[destinationSlug][equals]=' + encodeURIComponent(destinationSlug) + '&where[homeFeature][not_equals]=true&sort=order&limit=20');
    },

    /* ── Itineraries / Packages ──────────────────────── */
    // GET all itineraries (for packages slider & grid on popular-itineraries.html)
    getItineraries: async function (opts) {
      var qs = 'sort=order&limit=50';
      if (opts && opts.featured) qs += '&where[featured][equals]=true';
      return this.get('/api/itineraries?' + qs);
    },
    // GET single itinerary by slug
    getItinerary: async function (slug) {
      return this.get('/api/itineraries?where[slug][equals]=' + encodeURIComponent(slug) + '&limit=1');
    },

    /* ── Blog Categories ─────────────────────────────── */
    getBlogCategories: async function () {
      return this.get('/api/blog-categories?where[active][equals]=true&sort=order&limit=20');
    },

    /* ── Blog Posts ──────────────────────────────────── */
    // GET blog posts; optional category filter
    getBlogPosts: async function (category, limit) {
      var qs = 'sort=-publishedDate&limit=' + (limit || 20);
      if (category) qs += '&where[category][equals]=' + encodeURIComponent(category);
      return this.get('/api/blog-posts?' + qs);
    },

    /* ── Gallery ─────────────────────────────────────── */
    getGalleryItems: async function (limit) {
      return this.get('/api/gallery-items?sort=order&limit=' + (limit || 20));
    },

    /* ── Testimonials ────────────────────────────────── */
    getTestimonials: async function (limit) {
      return this.get('/api/testimonials?where[featured][equals]=true&sort=order&limit=' + (limit || 20));
    },

    /* ── Bloggers ────────────────────────────────────── */
    getBloggers: async function (limit) {
      return this.get('/api/bloggers?sort=order&limit=' + (limit || 10));
    },

    /* ── Page Banners ────────────────────────────────── */
    getMediaBanner: async function (page) {
      return this.get('/api/media-banners?where[page][equals]=' + encodeURIComponent(page) + '&limit=1');
    },

    /* ── Image URL helper ────────────────────────────── */
    // Resolves an image from a Payload upload relationship or legacy string
    imgUrl: function (imgField) {
      if (!imgField) return '';
      if (typeof imgField === 'string') return imgField;
      // Payload upload object
      if (imgField.url) return CMS_URL + imgField.url;
      if (imgField.sizes && imgField.sizes.card) return CMS_URL + imgField.sizes.card.url;
      return '';
    },
  };

  window.satguruCMS = satguruCMS;
})(window);
