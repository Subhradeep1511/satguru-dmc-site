import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const GalleryItems: CollectionConfig = {
  slug: 'gallery-items',
  lockDocuments: false,
  admin: {
    useAsTitle: 'title',
    group: 'Media Page',
    defaultColumns: ['title', 'order', 'updatedAt'],
    description: 'Image cards shown in the gallery swiper carousel on the Media page.',
  },
  access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdminOrEditor },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Caption / Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Short Description',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Controls carousel order (lower = earlier).' },
    },
  ],
}
