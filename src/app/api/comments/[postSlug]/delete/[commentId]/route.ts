import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/mongodb'
import { Comment } from '@/models/Comment'
import { UserProfile } from '@/models/UserProfile'

export const runtime = 'nodejs'

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await ctx.params
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: '로그인 필요' },
      { status: 401 }
    )
  }

  await connectDB()

  const comment = await Comment.findById(commentId)
  if (!comment) {
    return NextResponse.json({ ok: false, error: '댓글 없음' }, { status: 404 })
  }

  const profile = await UserProfile.findOne({ clerkUserId: userId })
  const isOwner = comment.authorId === userId
  const isAdmin = profile?.role === 'admin'

  if (!isOwner && !isAdmin) {
    return NextResponse.json(
      { ok: false, error: '삭제 권한 없음' },
      { status: 403 }
    )
  }

  await Comment.deleteOne({ _id: commentId })

  return NextResponse.json({ ok: true }, { status: 200 })
}
