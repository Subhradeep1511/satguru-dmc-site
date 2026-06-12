import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const Excursions: CollectionConfig = {
  slug: 'excursions',
  lockDocuments: false,
  labels: {
    singular: 'Explore Detail',
    plural: 'Explore Details',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Explore Page',
    defaultColumns: ['title', 'cityPage', 'duration', 'order', 'updatedAt'],
    description: 'Individual excursion flip-cards shown on each city\'s excursion detail page.',
  },
  access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdminOrEditor },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        // Auto-populate destinationSlug and destinationTitle from the selected Explore Listing
        if (data.cityPage) {
          const listingId = typeof data.cityPage === 'object' ? data.cityPage.id : data.cityPage
          try {
            const listing = await req.payload.findByID({ collection: 'explore-listings', id: listingId, depth: 0 })
            data.destinationSlug = (listing as any).destinationSlug || ''
            data.destinationTitle = (listing as any).destinationName || ''
          } catch (_) {}
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
      label: 'Excursion Title',
    },
    {
      name: 'cityPage',
      type: 'relationship',
      relationTo: 'explore-listings',
      label: 'City Page',
      admin: { description: 'Select the city this excursion belongs to. Add new cities in Explore Listings.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'location',
          type: 'text',
          label: 'Location',
          admin: { description: 'e.g. "Moscow, Russia"' },
        },
        {
          name: 'duration',
          type: 'text',
          label: 'Duration',
          admin: { description: 'e.g. "4 Hours"' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startTour',
          type: 'text',
          label: 'Start Point',
          defaultValue: 'Your Hotel',
        },
        {
          name: 'transportation',
          type: 'text',
          label: 'Transportation',
          defaultValue: 'By Cab',
        },
      ],
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
      admin: { description: 'External URL — takes priority over uploaded image.' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Flip Card Description',
      admin: { description: 'Text shown on the card back when "View Details" is clicked.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          label: 'Display Order',
        },
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
          label: 'Active',
        },
      ],
    },
    // Internal fields — hidden from admin UI, auto-populated by hook
    { name: 'destinationSlug',       type: 'text',     admin: { hidden: true } },
    { name: 'destinationTitle',      type: 'text',     defaultValue: 'Unknown', admin: { hidden: true } },
    // Legacy fields — kept for DB compatibility
    { name: 'homeFeature',           type: 'checkbox', defaultValue: false,      admin: { hidden: true } },
    { name: 'destinationOrder',      type: 'number',   defaultValue: 0,          admin: { hidden: true } },
    { name: 'destinationHeroImage',  type: 'text',                               admin: { hidden: true } },
    { name: 'destinationDescription',type: 'textarea',                            admin: { hidden: true } },
    { name: 'highlights', type: 'array', admin: { hidden: true }, fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'destinationImage', type: 'upload', relationTo: 'media', admin: { hidden: true } },
  ],
}
