import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'

// Post 타입과 데이터 함수를 사용자님의 src/data/posts.ts 파일에서 가져옵니다.
import { getPostBySlug, getPosts } from '@/data/posts'

// ----------------------------------------------------
// TypeScript Type Definitions
// ----------------------------------------------------

interface PostDetailPageProps {
  params: {
    // 폴더 이름 [post_id]와 일치하는 키입니다.
    post_id: string
  }
}

// ----------------------------------------------------
// Next.js Static Generation Function (오류 해결 1)
// ----------------------------------------------------

// generateStaticParams를 구현하여 Next.js에게 어떤 경로를 만들지 명확히 알려줍니다.
// 이 함수가 라우팅 폴더 이름 [post_id]와 일치하는 키를 사용하여 'post_id' !== 'slug' 오류를 해결합니다.
export async function generateStaticParams() {
  const posts = getPosts()

  return posts.map((post) => ({
    // 데이터의 slug 값을 라우팅 파라미터의 키인 post_id에 할당합니다.
    post_id: post.slug,
  }))
}

// ----------------------------------------------------
// Main Page Component (Async Server Component로 수정 - 오류 해결 2)
// ----------------------------------------------------

// 페이지 컴포넌트를 async로 선언하여 'params should be awaited' 오류를 해결합니다.
export default async function PostDetailPage({ params }: PostDetailPageProps) {
  // params에서 post_id를 가져옵니다.
  const postId = params.post_id

  if (!postId) {
    notFound()
  }

  // postId(데이터 파일의 slug)를 사용하여 데이터를 가져옵니다.
  const post = getPostBySlug(postId)

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* 1. 게시물 본문 영역 */}
      <article className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 break-words">
          {post.title}
        </h1>
        <div className="text-sm text-gray-500 mb-8 border-b pb-4 flex justify-between items-center">
          <span>
            <span className="font-medium mr-3 text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs uppercase tracking-wider">
              {post.category}
            </span>
            <time dateTime={post.date}>{post.date} 작성</time>
          </span>
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
            {post.excerpt}
          </p>
          <div
            className="mt-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </div>
  )
}
