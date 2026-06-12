import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const Bloggers: CollectionConfig = {
  slug: 'bloggers',
  lockDocuments: false,
  admin: {
    useAsTitle: 'name',
    group: 'Media Page',
    defaultColumns: ['name', 'role', 'order', 'updatedAt'],
    description: 'Blogger review cards with play-button shown on the Media page.',
  },
  access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdminOrEditor },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'role',
      type: 'text',
      label: 'Title / Role (e.g., "GLOBAL CEO & EXECUTIVE CHAIRMAN")',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile / Thumbnail Image',
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video URL',
      admin: {
        description: 'Paste a YouTube link or select an uploaded video from the media library.',
        components: {
          Field: '@/components/VideoUrlField#default',
        },
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
