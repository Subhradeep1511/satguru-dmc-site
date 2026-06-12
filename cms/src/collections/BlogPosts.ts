import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  lockDocuments: false,
  admin: {
    useAsTitle: 'title',
    group: 'Media Page',
    defaultColumns: ['title', 'category', 'publishedDate', 'featured', 'updatedAt'],
    description: 'Blog cards shown in the four-tab blog section on the Media page.',
  },
  access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdminOrEditor },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Excerpt (2-line preview shown on card)',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({}),
      label: 'Full Article Content',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      label: 'Category',
      admin: {
        description: 'Select the tab this post belongs to.',
        components: {
          Field: '@/components/CategorySelect#default',
        },
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      // Auto-set to today when creating a new post — user can still change it
      defaultValue: () => new Date().toISOString(),
      hooks: {
        beforeChange: [
          ({ value }) => {
            // If somehow empty on save, default to now
            if (!value) return new Date().toISOString()
            return value
          },
        ],
      },
      admin: {
        date: { pickerAppearance: 'dayOnly' },
        description: 'Auto-set to today. Change if needed.',
      },
    },
    {
      name: 'author',
      type: 'text',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
