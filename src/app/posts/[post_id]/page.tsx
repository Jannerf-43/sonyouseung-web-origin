import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getPosts } from '@/data/posts'

interface PostDetailPageProps {
  params: {
    post_id: string
  }
}

// post_id, slug 오류 임시 해결
export async function generateStaticParams() {
  const posts = getPosts()

  return posts.map((post) => ({
    post_id: post.slug,
  }))
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { post_id: postId } = await params

  if (!postId) {
    notFound()
  }

  const post = getPostBySlug(postId)

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* 본문 영역 */}
      <article className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        {/* 글 제목 */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 break-words">
          {post.title}
        </h1>
        <div className="text-sm text-gray-500 mb-8 border-b pb-4 flex justify-between items-center">
          <span>
            {/* 카테고리 */}
            <span className="font-medium mr-3 text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs uppercase tracking-wider">
              {post.category}
            </span>
            {/* 게시일 */}
            <time dateTime={post.date}>{post.date} 작성</time>
          </span>
          {/* 뒤로가기 */}
          <Link
            href="/posts"
            className="text-blue-500 hover:text-blue-700 text-sm font-medium transition flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            목록으로 돌아가기
          </Link>
        </div>

        {/* 실제 게시물 본문 */}
        <div className="prose max-w-none prose-lg prose-indigo text-gray-800">
          <p className="lead font-medium text-lg mb-8 border-l-4 border-indigo-400 pl-4 italic bg-indigo-50 p-4 rounded-md">
            {/* 게시물 요약본 */}
            {post.excerpt}
          </p>
          {/* 실제 게시물 상세*/}
          <div
            className="mt-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </div>
  )
}
