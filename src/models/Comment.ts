import { Schema, model, models } from 'mongoose'

export interface IComment {
  _id: string
  postSlug: string
  authorId: string // ← Clerk userId (문자열)
  authorName: string
  content: string
  createdAt: Date
  updatedAt: Date
}

const CommentSchema = new Schema<IComment>(
  {
    postSlug: { type: String, required: true },

    // Clerk userId는 문자열, ObjectId가 아님
    authorId: { type: String, required: true },

    authorName: { type: String, required: true },

    content: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: 'comments',
  }
)

export const Comment =
  models.Comment || model<IComment>('Comment', CommentSchema)
