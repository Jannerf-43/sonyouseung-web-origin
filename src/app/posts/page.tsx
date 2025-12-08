import Link from 'next/link'
import type { PostType } from '@/types/post'

async function fetchPosts(): Promise<PostType[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts`, {
    cache: 'no-store',
  })
  const data = await res.json()
  return data.posts || []
}

export default async function PostsPage() {
  const posts = await fetchPosts()

  return (
    <section>
      <header className="mb-10 flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-gray-900">전체 게시물</h1>

        <Link
          href="/write"
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-green-700"
        >
          글쓰기
        </Link>
      </header>

      {posts.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          게시물이 없습니다.
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post: PostType) => (
            <article
              key={post.slug}
              className="bg-white p-6 rounded-xl shadow-lg border hover:shadow-xl transition"
            >
              <Link href={`/posts/${post.slug}`} className="block">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2 hover:text-blue-600">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  #{post.category} ·{' '}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700">{post.excerpt}</p>

                <span className="text-blue-500 font-medium mt-4 inline-block">
                  더 읽기 →
                </span>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
