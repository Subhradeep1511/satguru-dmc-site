import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  lockDocuments: false,
  admin: {
    useAsTitle: 'author',
    group: 'Media Page',
    defaultColumns: ['author', 'role', 'featured', 'order', 'updatedAt'],
    description: 'Reviews shown in the testimonial swiper on the Media page.',
  },
  access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdminOrEditor },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: 'Testimonial Quote',
    },
    {
      name: 'author',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      label: 'Role / Title (e.g., "Traveler", "Corporate Client")',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Author Photo',
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
