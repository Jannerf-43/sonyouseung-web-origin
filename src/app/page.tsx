import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import type { PostType } from '@/types/post'

async function getLatestPosts(): Promise<PostType[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts`, {
    cache: 'no-store',
  })

  const data = await res.json()
  return data.posts || []
}

// 카드 UI
function PostCard({ post }: { post: PostType }) {
  return (
    <article className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition border border-gray-100 flex flex-col">
      <Link href={`/posts/${post.slug}`} className="block flex-grow">
        <h2 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 mb-2">
          {post.title}
        </h2>

        <p className="text-sm text-gray-500 mb-3">
          <span className="font-medium text-indigo-500 mr-3">
            #{post.category}
          </span>
          {new Date(post.createdAt).toLocaleDateString('ko-KR')} 작성
        </p>

        <p className="text-gray-700 line-clamp-3">{post.excerpt}</p>
      </Link>

      <Link
        href={`/posts/${post.slug}`}
        className="mt-3 text-indigo-500 hover:underline"
      >
        더 읽기 →
      </Link>
    </article>
  )
}

export default async function HomePage() {
  const posts = await getLatestPosts()
  const latest = posts.slice(0, 4)

  return (
    <>
      <SignedIn>
        <section>
          <header className="mb-12 text-center py-16 bg-indigo-50 rounded-xl shadow-inner">
            <h1 className="text-5xl font-extrabold text-indigo-800 mb-3">
              정보보호학과 학생의 일상과 기록
            </h1>
            <p className="text-xl text-indigo-600 font-light">
              수업, 독학을 통해 배운 내용을 공유합니다.
            </p>
          </header>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">
              최근 포스트
            </h2>

            {latest.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latest.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                아직 작성된 게시물이 없습니다.
              </p>
            )}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/posts"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium shadow-xl hover:bg-indigo-700"
            >
              전체 게시물 보러 가기 ({posts.length}개)
            </Link>
          </div>
        </section>
      </SignedIn>

      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-xl shadow-xl p-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            로그인이 필요합니다.
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            모든 콘텐츠를 보려면 로그인 또는 회원가입을 해 주세요.
          </p>
          <SignInButton mode="modal">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium shadow-xl hover:bg-indigo-700">
              로그인 / 회원가입
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  )
}
