import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const TourPackages: CollectionConfig = {
  slug: 'tour-packages',
  lockDocuments: false,
  admin: {
    useAsTitle: 'title',
    group: 'Home Page',
    defaultColumns: ['title', 'featured', 'order', 'updatedAt'],
    description: 'Expanding destination cards on the home page hero section.',
    hidden: true,
  },
  access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdminOrEditor },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Destination Name',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Short Description (shown on card hover)',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image (uploaded)',
    },
    {
      name: 'imageUrl',
      type: 'text',
      label: 'Background Image URL (external / live site)',
      admin: { description: 'Use this if image is hosted externally. Overrides uploaded image.' },
    },
    {
      name: 'link',
      type: 'text',
      label: 'Link URL (e.g., sochi.html or destination.html?id=sochi)',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show on Home Page',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower numbers appear first (left to right).' },
    },
  ],
}
