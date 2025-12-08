// src/models/UserProfile.ts
import { Schema, model, models } from 'mongoose'

export interface IUserProfile {
  _id: string
  clerkUserId: string
  role: 'basic' | 'admin'
  createdAt: Date
  updatedAt: Date
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    clerkUserId: { type: String, required: true, unique: true },
    role: { type: String, enum: ['basic', 'admin'], default: 'basic' },
  },
  {
    timestamps: true,
    collection: 'user_profiles', // ← 절대적으로 중요!
  }
)

export const UserProfile =
  models.UserProfile || model<IUserProfile>('UserProfile', UserProfileSchema)
