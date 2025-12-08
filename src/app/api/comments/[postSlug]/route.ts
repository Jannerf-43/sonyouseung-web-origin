import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/mongodb'
import { Comment } from '@/models/Comment'
import { UserProfile } from '@/models/UserProfile'

export const runtime = 'nodejs'

// -------------------
// GET 댓글 목록
// -------------------
export async function GET(
  req: Request,
  ctx: { params: Promise<{ postSlug: string }> }
) {
  const { postSlug } = await ctx.params

  await connectDB()

  const comments = await Comment.find({ postSlug })
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json({ ok: true, comments }, { status: 200 })
}

// -------------------
// POST 댓글 생성
// -------------------
export async function POST(
  req: Request,
  ctx: { params: Promise<{ postSlug: string }> }
) {
  const { postSlug } = await ctx.params
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: '로그인이 필요합니다.' },
      { status: 401 }
    )
  }

  await connectDB()

  const profile = await UserProfile.findOne({ clerkUserId: userId })
  const body = await req.json().catch(() => null)

  if (!body?.content) {
    return NextResponse.json(
      { ok: false, error: '내용을 입력해주세요.' },
      { status: 400 }
    )
  }

  const comment = await Comment.create({
    postSlug,
    authorId: userId,
    authorName: profile?.nickname || '익명 사용자',
    content: body.content,
  })

  return NextResponse.json({ ok: true, comment }, { status: 201 })
}
