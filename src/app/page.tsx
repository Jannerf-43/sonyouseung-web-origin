// app/page.tsx
import Link from 'next/link'
import { getPosts, Post } from '@/data/posts'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'

// 게시물 카드를 재사용하기 위한 컴포넌트
function PostCard({ post }: { post: Post }) {
  return (
    <article className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out border border-gray-100 flex flex-col h-full">
      <Link href={`/posts/${post.slug}`} className="block flex-grow">
        <h2 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition duration-150 ease-in-out mb-2 line-clamp-2">
          {post.title}
        </h2>
        <p className="text-sm text-gray-500 mb-3">
          <span className="font-medium mr-3 text-indigo-500">
            #{post.category}
          </span>
          <time dateTime={post.date}>{post.date} 작성</time>
        </p>
        <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>
      </Link>
      <Link
        href={`/posts/${post.slug}`}
        className="text-indigo-500 font-medium hover:underline mt-auto"
      >
        더 읽기 &rarr;
      </Link>
    </article>
  )
}

// 로그인했을 때 보여줄 콘텐츠
function MainContent() {
  const latestPosts = getPosts().slice(0, 4)

  return (
    <section>
      <header className="mb-12 text-center py-16 bg-indigo-50 rounded-xl shadow-inner">
        <h1 className="text-5xl font-extrabold text-indigo-800 tracking-tight mb-3">
          정보보호학과 학생의 일상과 기록
        </h1>
        <p className="text-xl text-indigo-600 font-light">
          수업, 독학을 통해 배운 내용을 공유합니다.
        </p>
      </header>

      {/* 최근 포스트 */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">
          최근 포스트
        </h2>
        {latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">
            아직 작성된 게시물이 없습니다.
          </p>
        )}
      </div>

      {/* 전체 게시물 이동 */}
      <div className="text-center mt-10">
        <Link
          href="/posts"
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium shadow-xl hover:bg-indigo-700 transition duration-200"
        >
          전체 게시물 보러 가기 ({getPosts().length}개)
        </Link>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <SignedIn>
        <MainContent />
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
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium shadow-xl hover:bg-indigo-700 transition duration-200">
              로그인 / 회원가입
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  )
}
