import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const Itineraries: CollectionConfig = {
  slug: 'itineraries',
  lockDocuments: false,
  admin: {
    useAsTitle: 'title',
    group: 'Popular Itineraries Page',
    defaultColumns: ['title', 'duration', 'priceDouble', 'featured', 'order', 'updatedAt'],
    description: 'Tour packages — controls both the Popular Itineraries listing cards AND the full detail pages.',
  },
  access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdminOrEditor },
  fields: [
    // ── Card listing fields (popular-itineraries page) ──
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Package Title',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      label: 'Page Slug (filename without .html, e.g. "moscow-spb-tour")',
      admin: { description: 'Must match the HTML filename. e.g. slug "moscow-spb-tour" → moscow-spb-tour.html' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Card Image (upload)',
    },
    {
      name: 'imageUrl',
      type: 'text',
      label: 'Card Image URL (external)',
      admin: { description: 'Use if not uploading. Shows on the Popular Itineraries listing cards.' },
    },
    {
      name: 'duration',
      type: 'text',
      label: 'Duration (e.g. "7 Days / 6 Nights")',
    },
    {
      name: 'price',
      type: 'text',
      label: 'Starting Price (e.g. "From $587") — shown on listing card',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured Package',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Display Order (lower = first)',
    },

    // ── Detail page fields ──
    {
      name: 'heroBadge',
      type: 'text',
      label: 'Hero Badge Text (e.g. "7 Days Tour")',
    },
    {
      name: 'heroTitle',
      type: 'text',
      label: 'Hero Page Title (e.g. "Moscow & Saint Petersburg")',
      admin: { description: 'Shown as the large H1 on the detail page banner.' },
    },
    {
      name: 'priceDouble',
      type: 'text',
      label: 'Double Room Price (e.g. "$587")',
    },
    {
      name: 'priceSingle',
      type: 'text',
      label: 'Single Supplement (e.g. "+$210")',
      admin: { description: 'Leave blank if not applicable.' },
    },
    {
      name: 'hotelNotes',
      type: 'textarea',
      label: 'Hotel Information (shown below pricing table)',
      admin: { description: 'e.g. "Moscow: Holiday Inn 4★ | Saint Petersburg: Park Inn Radisson 4★"' },
    },
    {
      name: 'itinerary',
      type: 'array',
      label: 'Day-by-Day Itinerary',
      admin: { description: 'Add one entry per day. Each day can have a description and optional highlight callouts.' },
      fields: [
        {
          name: 'day',
          type: 'number',
          required: true,
          label: 'Day Number',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Day Title (e.g. "Moscow City Tour")',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Day Description',
          admin: { description: 'Main paragraph text for the day.' },
        },
        {
          name: 'highlights',
          type: 'array',
          label: 'Highlight Callouts (optional)',
          admin: { description: 'Special callout boxes within the day (e.g. museum visits, transport info).' },
          fields: [
            {
              name: 'icon',
              type: 'text',
              label: 'Remix Icon class (e.g. ri-map-pin-2-fill)',
              admin: { description: 'Browse icons at remixicon.com' },
            },
            {
              name: 'boldText',
              type: 'text',
              label: 'Bold Heading (e.g. "10:00 — Panoramic City Tour")',
            },
            {
              name: 'text',
              type: 'textarea',
              label: 'Callout Body Text',
            },
          ],
        },
      ],
    },
    {
      name: 'inclusions',
      type: 'array',
      label: 'Package Inclusions',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Inclusion Item',
        },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Gallery Images',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Upload Image',
        },
        {
          name: 'imageUrl',
          type: 'text',
          label: 'Image URL (external)',
          admin: { description: 'Use if not uploading.' },
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt Text',
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Short Description (shown on listing card hover)',
    },
  ],
}
