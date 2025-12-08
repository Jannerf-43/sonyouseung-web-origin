// src/app/api/profile/me/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/mongodb'
import { UserProfile } from '@/models/UserProfile'

export const runtime = 'nodejs' // ✅ mongodb는 nodejs 런타임에서만

export async function GET() {
  // 너 환경에서 타입 오류를 피하기 위해 await 사용 패턴 유지
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: '로그인이 필요합니다.' },
      { status: 401 }
    )
  }

  await connectDB()

  // 기본 role: 'basic'
  let profile = await UserProfile.findOne({ clerkUserId: userId }).lean()

  if (!profile) {
    profile = (
      await UserProfile.create({
        clerkUserId: userId,
        role: 'basic',
      })
    ).toObject()
  }

  return NextResponse.json(
    {
      ok: true,
      profile: {
        id: profile._id.toString(),
        clerkUserId: profile.clerkUserId,
        nickname: profile.nickname ?? '',
        role: profile.role,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    },
    { status: 200 }
  )
}
