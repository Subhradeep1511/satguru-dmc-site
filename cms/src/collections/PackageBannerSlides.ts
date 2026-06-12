import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const PackageBannerSlides: CollectionConfig = {
  slug: 'package-banner-slides',
  lockDocuments: false,
  admin: {
    useAsTitle: 'title',
    group: 'Package Detail Pages',
    defaultColumns: ['title', 'packageSlug', 'active', 'order', 'updatedAt'],
    description: 'Banner slider images for individual package/tour detail pages. One collection shared across all packages — filter by Package Slug.',
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
      label: 'Slide Label (internal only)',
      admin: { description: 'e.g. "Moscow Kremlin" — only shown in the CMS admin, never on the page.' },
    },
    {
      name: 'packageSlug',
      type: 'text',
      required: true,
      label: 'Package Slug',
      admin: { description: 'Must match the slug used in the page CMS loader. e.g. "moscow-spb", "murmansk-moscow", "sochi".' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Slide Image (upload)',
      admin: { description: 'Recommended size: 1920×1080px.' },
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
