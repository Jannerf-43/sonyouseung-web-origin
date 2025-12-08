// src/lib/auth.ts
import { auth } from '@clerk/nextjs/server'
import { UserProfile } from '@/models/UserProfile'
import { connectDB } from '@/lib/mongodb'

export interface AuthUser {
  clerkUserId: string | null
  userProfile: {
    _id: string
    clerkUserId: string
    displayName: string
    role: 'guest' | 'basic' | 'admin'
  } | null
  role: 'guest' | 'basic' | 'admin'
}

/**
 * 현재 로그인한 사용자 + DB(UserProfile) 정보를 가져오는 helper
 * API에서 일관된 권한 처리를 위해 사용한다.
 */
export async function getAuthUser(): Promise<AuthUser> {
  const { userId } = await auth() // Clerk userId

  // 로그인 안 한 사용자
  if (!userId) {
    return {
      clerkUserId: null,
      userProfile: null,
      role: 'guest',
    }
  }

  await connectDB()

  // DB UserProfile 조회
  let profile = await UserProfile.findOne({ clerkUserId: userId }).lean()

  // 없으면 자동 생성
  if (!profile) {
    profile = await UserProfile.create({
      clerkUserId: userId,
      displayName: 'New User',
      role: 'basic', // 기본 등급
    })
  }

  return {
    clerkUserId: userId,
    userProfile: {
      _id: profile._id.toString(),
      clerkUserId: profile.clerkUserId,
      displayName: profile.displayName,
      role: profile.role,
    },
    role: profile.role,
  }
}
