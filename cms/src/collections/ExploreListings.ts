import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const ExploreListings: CollectionConfig = {
  slug: 'explore-listings',
  lockDocuments: false,
  admin: {
    useAsTitle: 'destinationName',
    group: 'Explore Page',
    defaultColumns: ['destinationName', 'destinationSlug', 'order', 'active', 'updatedAt'],
    description: 'The destination cards shown on the Explore page grid. Each card links to its city excursion detail page.',
  },
  access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdminOrEditor },
  fields: [
    {
      name: 'destinationName',
      type: 'text',
      required: true,
      label: 'Destination Name',
      admin: { description: 'Card title shown on the Explore page — e.g. "Moscow", "Sochi".' },
    },
    {
      name: 'destinationSlug',
      type: 'text',
      label: 'Page Link',
      admin: { description: 'URL or page this card links to — e.g. "murmansk-excursions.html" or "https://example.com".' },
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
      label: 'Card Image URL',
      admin: { description: 'External image URL — takes priority over uploaded image.' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Short Description',
      admin: { description: 'Paragraph shown on the Home page card when hovering. e.g. "Above the Arctic Circle, Murmansk delivers…"' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'homeFeature',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show on Home Page',
          admin: { description: 'Check to show this city in the "Top Destination" section on the home page.' },
        },
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
          label: 'Active',
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          label: 'Display Order',
          admin: { description: 'Lower = appears first.' },
        },
      ],
    },
  ],
}
