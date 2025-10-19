import Link from 'next/link'
import { getPosts, Post } from '@/data/posts'
import { Suspense } from 'react'

// 포스트 데이터를 가져와 렌더링하는 Server Component
function PostListContent() {
  // getPosts()는 이제 최신순으로 정렬된 데이터를 반환합니다.
  const posts = getPosts()

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        게시물이 없습니다. 새로운 글을 작성해 보세요!
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {posts.map((post: Post) => (
        <article
          key={post.slug}
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out border border-gray-100"
        >
          {/* post_id 경로에 맞춰 링크를 사용합니다. */}
          <Link href={`/posts/${post.slug}`} className="block">
            <h2 className="text-2xl font-semibold text-gray-900 hover:text-blue-600 transition duration-150 ease-in-out mb-2">
              {post.title}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium mr-3 text-blue-500">
                #{post.category}
              </span>
              <time dateTime={post.date}>{post.date}</time>
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">{post.excerpt}</p>
            <span className="text-blue-500 font-medium hover:underline">
              더 읽기 &rarr;
            </span>
          </Link>
        </article>
      ))}
    </div>
  )
}

export default function PostsPage() {
  return (
    <section>
      <header className="mb-10 flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          전체 게시물
        </h1>
        <Link
          href="/write"
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-green-700 transition duration-150 flex items-center"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          글쓰기
        </Link>
      </header>

      <Suspense
        fallback={
          <div className="text-center text-lg py-12 text-gray-600">
            게시물 목록을 불러오는 중입니다...
          </div>
        }
      >
        <PostListContent />
      </Suspense>
    </section>
  )
}
