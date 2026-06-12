import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

function toSlug(str: string): string {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  lockDocuments: false,
  admin: {
    useAsTitle: 'title',
    group: 'Explore Page',
    defaultColumns: ['title', 'slug', 'excursionPageSlug', 'order', 'updatedAt'],
    description: 'Cities / destinations. Adding a city here makes it available in the Explore Details "City Page" dropdown.',
    hidden: true,
  },
  access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdminOrEditor },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate slug and excursionPageSlug from title if not provided
        if (data.title) {
          if (!data.slug) {
            data.slug = toSlug(data.title)
          }
          if (!data.excursionPageSlug) {
            data.excursionPageSlug = toSlug(data.title) + '-excursions'
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'City Name',
      admin: { description: 'e.g. "Kamchatka", "Yekaterinburg" — slug and excursion slug are auto-generated.' },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: { hidden: true },
    },
    {
      name: 'excursionPageSlug',
      type: 'text',
      label: 'Excursion Page Slug',
      admin: {
        description: 'Auto-generated as "{city}-excursions". Only edit if your HTML page uses a different slug.',
      },
    },
    { name: 'heroImage',      type: 'text',     admin: { hidden: true } },
    { name: 'description',    type: 'textarea', admin: { hidden: true } },
    { name: 'image',          type: 'upload',   relationTo: 'media', admin: { hidden: true } },
    { name: 'thumbnailImage', type: 'upload',   relationTo: 'media', admin: { hidden: true } },
    { name: 'homeFeature',    type: 'checkbox', defaultValue: false,  admin: { hidden: true } },
    { name: 'order',          type: 'number',   defaultValue: 0,      admin: { hidden: true } },
    { name: 'active',         type: 'checkbox', defaultValue: true,   admin: { hidden: true } },
  ],
}
