// src/app/write/page.tsx

import { auth } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/mongodb'
import { UserProfile } from '@/models/UserProfile'
import WriteForm from './WriteForm'

export const runtime = 'nodejs'

export default async function WritePage() {
  // Clerk 로그인 정보 가져오기
  const { userId } = await auth()

  if (!userId) {
    return (
      <div className="py-20 text-center text-xl text-red-500">
        ❌ 로그인이 필요합니다.
      </div>
    )
  }

  // DB 연결 후 유저 role 확인
  await connectDB()
  const profile = await UserProfile.findOne({ clerkUserId: userId }).lean()

  if (!profile) {
    return (
      <div className="py-20 text-center text-xl text-red-500">
        ❌ 프로필 정보가 없습니다.
      </div>
    )
  }

  if (profile.role !== 'admin') {
    return (
      <div className="py-20 text-center text-xl text-red-500">
        ❌ 관리자(admin)만 글을 작성할 수 있습니다.
      </div>
    )
  }

  // 정상적으로 admin이면 글쓰기 폼 렌더링
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">글쓰기</h1>
      <WriteForm />
    </div>
  )
}
