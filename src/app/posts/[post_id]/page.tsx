import Link from 'next/link'
import { notFound } from 'next/navigation'
import Comments from '@/components/comments/Comments'
import DeleteButton from '@/components/post/DeleteButton'

export const runtime = 'nodejs'

// ---------------------------
// 서버에서 게시물 조회
// ---------------------------
async function getPost(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/posts/${slug}`,
    { cache: 'no-store' }
  )

  if (!res.ok) return null
  const data = await res.json()
  return data.post
}

// ---------------------------
// 상세 페이지
// ---------------------------
export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ post_id: string }>
}) {
  // ⭐ Next.js 15: 반드시 await!
  const { post_id } = await params

  const post = await getPost(post_id)
  if (!post) notFound()

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <article className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 break-words">
          {post.title}
        </h1>

        <div className="text-sm text-gray-500 mb-8 border-b pb-4 flex justify-between items-center">
          <span className="flex items-center space-x-3">
            <span className="font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs uppercase tracking-wider">
              {post.category}
            </span>

            <time>
              {new Date(post.createdAt).toLocaleDateString('ko-KR')} 작성
            </time>
          </span>

          <div className="flex items-center space-x-4">
            <Link
              href="/posts"
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              ← 목록으로
            </Link>

            <Link
              href={`/posts/${post_id}/edit`}
              className="text-indigo-600 font-medium hover:text-indigo-800"
            >
              ✏️ 수정하기
            </Link>

            <DeleteButton slug={post_id} />
          </div>
        </div>

        <p className="lead font-medium text-lg mb-8 border-l-4 border-indigo-400 pl-4 italic bg-indigo-50 p-4 rounded-md">
          {post.excerpt}
        </p>

        <div
          className="mt-8 prose prose-indigo max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <Comments slug={post_id} />
    </div>
  )
}
