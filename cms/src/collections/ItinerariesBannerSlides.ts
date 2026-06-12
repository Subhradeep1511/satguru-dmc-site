import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const ItinerariesBannerSlides: CollectionConfig = {
  slug: 'itineraries-banner-slides',
  lockDocuments: false,
  admin: {
    useAsTitle: 'title',
    group: 'Popular Itineraries Page',
    defaultColumns: ['title', 'active', 'order', 'updatedAt'],
    description: 'Banner slider images on the Popular Itineraries page. Add, remove or reorder slides here.',
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
      label: 'Slide Label (internal reference only)',
      admin: { description: 'e.g. "Moscow Winter", "Sochi Beach" — only shown in the CMS, not on the page.' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Slide Image (upload)',
      admin: { description: 'Upload the image directly. Recommended size: 1920×1080px.' },
    },
    {
      name: 'imageUrl',
      type: 'text',
      label: 'Image URL (external)',
      admin: { description: 'Paste an external URL instead of uploading. Takes priority over uploaded image.' },
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
