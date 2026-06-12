import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

// Converts "About New Packages" → "about-new-packages"
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const BlogCategories: CollectionConfig = {
  slug: 'blog-categories',
  lockDocuments: false,
  admin: {
    useAsTitle: 'name',
    group: 'Media Page',
    defaultColumns: ['name', 'slug', 'active', 'order', 'updatedAt'],
    description: 'Blog tabs shown on the Media page. Add, rename or reorder tabs here.',
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Tab Label (shown on the page)',
      admin: { description: 'e.g. "About New Packages", "Travel Tips"' },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      label: 'Slug (auto-generated from Tab Label)',
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            // Auto-generate from name if slug is empty
            if (!value && data?.name) return toSlug(data.name as string)
            // Re-slugify if a value was typed (normalise it)
            if (value) return toSlug(value)
            return value
          },
        ],
      },
      admin: {
        description: 'Auto-generated from the Tab Label. Blog posts with this slug in their Category field appear under this tab.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Tab Order (lower = further left)',
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show this tab on the page',
    },
  ],
}
