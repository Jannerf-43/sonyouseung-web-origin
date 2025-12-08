// src/models/Post.ts
import { Schema, model, models } from 'mongoose'

export interface IPost {
  _id: string
  title: string
  slug: string
  category: string
  excerpt: string
  content: string
  authorId: string // ← Clerk userId 문자열
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    excerpt: { type: String, default: '' },
    content: { type: String, required: true },

    // ❗ ObjectId → String 으로 변경
    authorId: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: 'posts',
  }
)

export const Post = models.Post || model<IPost>('Post', PostSchema)
