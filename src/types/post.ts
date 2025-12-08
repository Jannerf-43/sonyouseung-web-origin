export interface PostType {
  id: string
  title: string
  slug: string
  category: string
  excerpt: string
  content?: string
  authorId?: string | null
  createdAt: string
  updatedAt: string
}
