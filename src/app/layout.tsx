import './globals.css'
import React from 'react'
import Link from 'next/link'
import { GeistSans, GeistMono } from 'geist/font'
import { ClerkProvider } from '@clerk/nextjs'
import UserButtons from '@/components/UserButton'

// 인증 경로
const AUTH_ROUTES = ['/sign-in', '/sign-up']

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  // 임시로 타이핑만 해둔 카테고리
  const categories = [
    { name: 'Next.js & React', count: 0 },
    { name: 'Python', count: 0 },
    { name: '개발 트렌드', count: 0 },
    { name: '일상 & 생각', count: 0 },
  ]
  const totalPosts = 0

  // 서버 컴포넌트를 위한 코드
  const currentPath = '/'
  const isAuthRoute = AUTH_ROUTES.some((route) => currentPath.startsWith(route))

  return (
    <ClerkProvider>
      <html lang="ko" className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <head>
          <title>개발 블로그 by Jannerf</title>
        </head>
        <body className="bg-gray-50 text-gray-800 min-h-screen flex flex-col font-sans antialiased">
          {/* 헤더 */}
          {!isAuthRoute && (
            <header className="bg-white shadow-md sticky top-0 z-10">
              <div className="container mx-auto px-4 py-4 max-w-6xl flex justify-between items-center">
                <div className="flex items-center space-x-6">
                  <Link
                    href="/"
                    className="text-2xl font-extrabold text-indigo-600 hover:text-indigo-800 transition"
                  >
                    Learning Log
                  </Link>
                  <nav className="space-x-4 hidden sm:block">
                    <Link
                      href="/posts"
                      className="text-gray-600 hover:text-indigo-600 transition font-medium"
                    >
                      All Posts
                    </Link>
                  </nav>
                </div>

                {/* 인증 버튼 */}
                <UserButtons />
              </div>
            </header>
          )}

          {/* 본문 + 사이드바 */}
          <main className="container mx-auto px-4 py-8 max-w-6xl flex-grow">
            {!isAuthRoute ? (
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-3/4 w-full">{children}</div>

                <aside className="lg:w-1/4 w-full lg:sticky lg:top-20 h-full space-y-8">
                  {/* About Me */}
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">
                      About Me
                    </h2>
                    <p className="text-sm text-gray-700">
                      현재 중부대학교 고양캠퍼스 재학중이며, 정보보호학을
                      전공하고 있습니다.
                    </p>
                    <Link
                      href="/about"
                      className="mt-3 inline-block text-indigo-500 hover:text-indigo-700 text-sm transition font-semibold"
                    >
                      더 보기 &rarr;
                    </Link>
                  </div>

                  {/* Categories */}
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">
                      Categories
                    </h2>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center">
                        <Link
                          href="/posts"
                          className="text-gray-700 hover:text-indigo-600 font-medium transition"
                        >
                          전체보기
                        </Link>
                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full font-mono">
                          {totalPosts}
                        </span>
                      </li>
                      {categories.map((cat) => (
                        <li
                          key={cat.name}
                          className="flex justify-between items-center"
                        >
                          <Link
                            href={`/category/${encodeURIComponent(cat.name)}`}
                            className="text-gray-700 hover:text-indigo-600 transition"
                          >
                            {cat.name}
                          </Link>
                          <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-mono font-medium">
                            {cat.count}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
              </div>
            ) : (
              <div className="flex justify-center items-center h-full">
                {children}
              </div>
            )}
          </main>

          {!isAuthRoute && (
            <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
              <div className="container mx-auto max-w-6xl">
                <p className="text-sm">&copy; {new Date().getDate()}</p>
              </div>
            </footer>
          )}
        </body>
      </html>
    </ClerkProvider>
  )
}
