// src/app/api/posts/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'
import { UserProfile } from '@/models/UserProfile'

export const runtime = 'nodejs'

// ------------------------------------
// GET /api/posts  (전체, 카테고리, slug 단일 조회)
// ------------------------------------
export async function GET(req: Request) {
  await connectDB()

  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const slug = searchParams.get('slug')

  // 단일 조회
  if (slug) {
    const post = await Post.findOne({ slug }).lean()
    return NextResponse.json({ ok: true, post })
  }

  // 카테고리 조회
  const query: Record<string, string> = {}
  if (category) query.category = category

  const posts = await Post.find(query).sort({ createdAt: -1 }).lean()

  return NextResponse.json({ ok: true, posts })
}

// ------------------------------------
// POST /api/posts (admin만 글 작성 가능)
// ------------------------------------
export async function POST(req: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: '로그인이 필요합니다.' },
      { status: 401 }
    )
  }

  await connectDB()

  // 관리자 권한 확인
  const profile = await UserProfile.findOne({ clerkUserId: userId }).lean()
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json(
      { ok: false, error: '관리자만 글을 작성할 수 있습니다.' },
      { status: 403 }
    )
  }

  const body = await req.json().catch(() => null)

  if (!body?.title || !body?.slug || !body?.content || !body?.category) {
    return NextResponse.json(
      { ok: false, error: '필수 값이 누락되었습니다.' },
      { status: 400 }
    )
  }

  const newPost = await Post.create({
    title: body.title,
    slug: body.slug,
    category: body.category,
    excerpt: body.excerpt ?? '',
    content: body.content,
    authorId: userId,
  })

  return NextResponse.json({ ok: true, post: newPost }, { status: 201 })
}
