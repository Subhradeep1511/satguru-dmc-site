import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  lockDocuments: false,
  admin: {
    useAsTitle: 'email',
    group: 'System',
  },
  auth: true,
  access: {
    read: isAdmin,
    // Allow unauthenticated requests so new users can self-register
    create: ({ req: { user } }) => !user || (user as any).role === 'admin',
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      // Non-admins cannot set their own role during create or update
      access: {
        create: ({ req: { user } }) => Boolean(user && (user as any).role === 'admin'),
        update: ({ req: { user } }) => Boolean(user && (user as any).role === 'admin'),
      },
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
    },
  ],
}
