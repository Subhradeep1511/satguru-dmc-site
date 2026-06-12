# Satguru DMC — Payload CMS

Headless CMS backend powering the dynamic sections of the Satguru DMC Russia website.

## Quick Start

```bash
cd cms
npm install
npm run dev          # starts on http://localhost:3001
```

On first run, visit **http://localhost:3001/admin** to create the first admin user.

After creating the user, visit **http://localhost:5000/admin-dashboard.html** to use the custom dashboard.

## Collections & Dynamic Sections

| Collection | Slug | Used In |
|---|---|---|
| Tour Packages | `tour-packages` | Home page — expand cards |
| Destinations | `destinations` | Explore Tours grid |
| Excursions | `excursions` | Destination detail pages |
| Itineraries | `itineraries` | Packages slider (popular-itineraries) |
| Blog Posts | `blog-posts` | Media page — 4-tab blog section |
| Gallery Items | `gallery-items` | Media page — gallery swiper |
| Testimonials | `testimonials` | Media page — testimonial swiper |
| Bloggers | `bloggers` | Media page — blogger cards |
| Media Banners | `media-banners` | Inner page hero banners |
| Media | `media` | File uploads (images/video) |
| Users | `users` | Admin authentication |

## REST API Endpoints

All collections are accessible at:
```
GET http://localhost:3001/api/{collection-slug}
GET http://localhost:3001/api/{collection-slug}/{id}
POST http://localhost:3001/api/{collection-slug}
PATCH http://localhost:3001/api/{collection-slug}/{id}
DELETE http://localhost:3001/api/{collection-slug}/{id}
```

### Common Query Examples

```
# Blog posts by category
GET /api/blog-posts?where[category][equals]=packages&sort=-publishedDate

# Destinations featured on home page
GET /api/destinations?where[homeFeature][equals]=true&sort=order

# Excursions for a specific destination
GET /api/excursions?where[destination][equals]={destinationId}&sort=order

# Banner for a specific page
GET /api/media-banners?where[page][equals]=media
```

## After Install

Run the import map generator after install (required for Payload admin UI):

```bash
npm run generate:importmap
npm run generate:types
```

## Environment Variables

Copy `.env` and update for production:

```env
DATABASE_URI=file:./satguru-cms.db
PAYLOAD_SECRET=your-long-random-secret-here
NEXT_PUBLIC_SERVER_URL=https://your-cms-domain.com
FRONTEND_URL=https://your-website-domain.com
```

## Database

Uses SQLite (file-based) for zero-setup local development.  
For production, switch to PostgreSQL using `@payloadcms/db-postgres`.
