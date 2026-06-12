import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const MediaBanners: CollectionConfig = {
  slug: 'media-banners',
  lockDocuments: false,
  admin: {
    useAsTitle: 'title',
    group: 'Page Banners',
    defaultColumns: ['page', 'title', 'updatedAt'],
    description: 'Hero banner content for each inner page.',
  },
  access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdminOrEditor },
  fields: [
    {
      name: 'page',
      type: 'select',
      required: true,
      label: 'Page',
      options: [
        { label: 'Popular Itineraries', value: 'popular-itineraries' },
        { label: 'Media', value: 'media' },
        { label: 'Golden Ring', value: 'golden-ring' },
        { label: 'Murmansk Excursions', value: 'murmansk-excursions' },
        { label: 'Kazan Excursions', value: 'kazan-excursions' },
        { label: 'Sochi Excursions', value: 'sochi-excursions' },
        { label: 'Saint Petersburg Excursions', value: 'saint-petersburg-excursions' },
        { label: 'Moscow Excursions', value: 'moscow-excursions' },
        { label: 'Moscow', value: 'moscow' },
        { label: 'Saint Petersburg', value: 'saint-petersburg' },
        { label: 'Murmansk', value: 'murmansk' },
        { label: 'Sochi', value: 'sochi' },
        { label: 'Kazan', value: 'kazan' },
        { label: 'Lake Baikal', value: 'lake-baikal' },
        { label: 'Kamchatka', value: 'kamchatka' },
        { label: 'Nizhny Novgorod', value: 'nizhny-novgorod' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'titleHighlight',
      type: 'text',
      label: 'Highlighted Title Word (rendered in accent color)',
    },
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
    },
    {
      name: 'slides',
      type: 'array',
      label: 'Additional Slides (for multi-slide banners)',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'imageUrl',
          type: 'text',
          label: 'Image URL (legacy path)',
        },
      ],
    },
  ],
}
