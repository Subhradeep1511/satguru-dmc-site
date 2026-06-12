import type { Access } from 'payload'

// Any logged-in user (admin or editor) can manage content
export const isAuthenticated: Access = ({ req: { user } }) => Boolean(user)

// Only admins can manage users
export const isAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  return (user as any).role === 'admin'
}

// Admin or Editor — with safe fallback if role field is empty
export const isAdminOrEditor: Access = ({ req: { user } }) => {
  if (!user) return false
  const role = (user as any).role
  // If no role assigned yet, treat as editor (allow content edits)
  if (!role) return true
  return role === 'admin' || role === 'editor'
}
