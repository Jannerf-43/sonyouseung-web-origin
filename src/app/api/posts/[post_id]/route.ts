// src/app/api/posts/[post_id]/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'
import { Comment } from '@/models/Comment'
import { UserProfile } from '@/models/UserProfile'

export const runtime = 'nodejs'

// ----------------------
// GET /api/posts/[post_id]  → 게시물 상세 (공개)
// ----------------------
export async function GET(
  req: Request,
  context: { params: Promise<{ post_id: string }> }
) {
  const { post_id } = await context.params

  await connectDB()

  const post = await Post.findOne({ slug: post_id }).lean()

  if (!post) {
    return NextResponse.json(
      { ok: false, error: '게시물을 찾을 수 없습니다.' },
      { status: 404 }
    )
  }

  return NextResponse.json(
    {
      ok: true,
      post: {
        id: post._id.toString(),
        title: post.title,
        slug: post.slug,
        category: post.category,
        excerpt: post.excerpt,
        content: post.content,
        authorId: post.authorId?.toString() ?? null,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
    },
    { status: 200 }
  )
}

// ----------------------
// PATCH /api/posts/[post_id]  → 게시물 수정 (admin만)
// ----------------------
export async function PATCH(
  req: Request,
  context: { params: Promise<{ post_id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json(
      { ok: false, error: '로그인이 필요합니다.' },
      { status: 401 }
    )
  }

  await connectDB()
  const profile = await UserProfile.findOne({ clerkUserId: userId })

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json(
      { ok: false, error: '수정 권한이 없습니다.' },
      { status: 403 }
    )
  }

  const { post_id } = await context.params
  const slug = post_id

  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json(
      { ok: false, error: '잘못된 요청입니다.' },
      { status: 400 }
    )
  }

  const { title, category, excerpt, content } = body as {
    title?: string
    category?: string
    excerpt?: string
    content?: string
  }

  const updated = await Post.findOneAndUpdate(
    { slug },
    { title, category, excerpt, content },
    { new: true }
  )

  if (!updated) {
    return NextResponse.json(
      { ok: false, error: '게시물을 찾을 수 없습니다.' },
      { status: 404 }
    )
  }

  return NextResponse.json(
    {
      ok: true,
      post: {
        slug: updated.slug,
      },
    },
    { status: 200 }
  )
}

// ----------------------
// DELETE /api/posts/[post_id]  → 게시물 삭제 (admin만)
// ----------------------
export async function DELETE(
  req: Request,
  context: { params: Promise<{ post_id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json(
      { ok: false, error: '로그인이 필요합니다.' },
      { status: 401 }
    )
  }

  await connectDB()
  const profile = await UserProfile.findOne({ clerkUserId: userId })

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json(
      { ok: false, error: '삭제 권한이 없습니다.' },
      { status: 403 }
    )
  }

  const { post_id } = await context.params
  const slug = post_id

  const post = await Post.findOne({ slug })
  if (!post) {
    return NextResponse.json(
      { ok: false, error: '게시물이 존재하지 않습니다.' },
      { status: 404 }
    )
  }

  // 댓글도 함께 삭제
  await Comment.deleteMany({ postId: post._id })
  await Post.deleteOne({ _id: post._id })

  return NextResponse.json(
    { ok: true, message: '게시물이 삭제되었습니다.' },
    { status: 200 }
  )
}
