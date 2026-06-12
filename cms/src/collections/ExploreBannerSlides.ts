import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const ExploreBannerSlides: CollectionConfig = {
  slug: 'explore-banner-slides',
  lockDocuments: false,
  admin: {
    useAsTitle: 'title',
    group: 'Explore Page',
    defaultColumns: ['title', 'active', 'order', 'updatedAt'],
    description: 'Background slider images for the Explore page hero banner. Add, remove or reorder slides here.',
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Slide Label (internal reference)',
      admin: { description: 'e.g. "Moscow Winter", "Sochi Beach"' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Slide Image (upload)',
    },
    {
      name: 'imageUrl',
      type: 'text',
      label: 'Image URL (external)',
      admin: { description: 'Paste an external URL if not uploading. Takes priority over uploaded image.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Display order — lower numbers appear first.' },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active (show this slide)',
    },
  ],
}
