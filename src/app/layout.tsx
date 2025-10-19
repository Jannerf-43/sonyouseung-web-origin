'use client'

import './globals.css'
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React from 'react'
import { GeistSans, GeistMono } from 'geist/font'
// import { getPosts } from '@/data/posts'

// 컴파일 오류 방지: 임시 더미 함수 정의
function getPosts(): { category: string }[] {
  return [
    { category: 'Next.js & React' },
    { category: 'Python' },
    { category: 'Next.js & React' },
  ]
}

// Clerk 인증 라우트 목록 (헤더/푸터를 숨길 경로)
const AUTH_ROUTES = ['/sign-in', '/sign-up']

// 카테고리별 포스트 수를 계산하는 함수 (더미 데이터 구조를 가정)
function getCategoryCounts() {
  const posts = getPosts()
  const counts: { [key: string]: number } = {}

  posts.forEach((post) => {
    if (post.category) {
      counts[post.category] = (counts[post.category] || 0) + 1
    }
  })

  // 명시적으로 지정된 카테고리 목록 (순서 유지를 위해)
  const allCategories = [
    'Next.js & React',
    'Python',
    '개발 트렌드',
    '일상 & 생각',
  ]

  return allCategories.map((name) => ({
    name,
    count: counts[name] || 0,
  }))
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  const categories = getCategoryCounts()
  const totalPosts = categories.reduce((sum, cat) => sum + cat.count, 0)

  return (
    <ClerkProvider>
      {/* 1. Geist 폰트 클래스를 <html>에 적용 */}
      <html lang="ko" className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <head>
          <title>개발 블로그 by Jannerf</title>
        </head>
        {/* 폰트 적용을 위해 <body>에 font-sans 클래스 추가 */}
        <body className="bg-gray-50 text-gray-800 min-h-screen flex flex-col font-sans antialiased">
          {/* 조건부 렌더링: 인증 경로가 아닐 때만 헤더 표시 */}
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

                {/* 2. 우측 상단 유저 정보 (Clerk UserButton / SignInButton) */}
                <div className="flex items-center space-x-4">
                  <SignedIn>
                    {/* 로그인 상태일 때: 유저 버튼 표시 */}
                    <UserButton afterSignOutUrl="/sign-in" />
                  </SignedIn>
                  <SignedOut>
                    {/* 로그아웃 상태일 때: 로그인 버튼 표시 */}
                    <SignInButton mode="modal">
                      <button className="text-white bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded-lg font-medium shadow-md text-sm">
                        Sign In
                      </button>
                    </SignInButton>
                  </SignedOut>
                </div>
              </div>
            </header>
          )}

          {/* 메인 콘텐츠 영역 (사이드바와 본문) */}
          <main className="container mx-auto px-4 py-8 max-w-6xl flex-grow">
            {/* 인증 경로가 아닐 때만 블로그 레이아웃 (본문 + 사이드바) 적용 */}
            {!isAuthRoute ? (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* 본문 (페이지 내용) */}
                <div className="lg:w-3/4 w-full">{children}</div>

                {/* 사이드바 */}
                <aside className="lg:w-1/4 w-full lg:sticky lg:top-20 h-full space-y-8">
                  {/* About Me */}
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">
                      About Me
                    </h2>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-800 font-bold text-lg">
                        손유승
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Jannerf-43</p>
                        <p className="text-sm text-gray-500">
                          중부대학교 재학중
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      현재 중부대학교 고양캠퍼스 재학중이며. 정보보호학을
                      전공하고 있습니다.
                    </p>
                    <Link
                      href="/about"
                      className="mt-3 inline-block text-indigo-500 hover:text-indigo-700 text-sm transition font-semibold"
                    >
                      더 보기 &rarr;
                    </Link>
                  </div>

                  {/* 카테고리 목록 */}
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
              // 인증 경로일 경우: 자식 컴포넌트만 중앙에 표시
              <div className="flex justify-center items-center h-full">
                {children}
              </div>
            )}
          </main>

          {/* 조건부 렌더링: 인증 경로가 아닐 때만 푸터 표시 */}
          {!isAuthRoute && (
            <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
              <div className="container mx-auto max-w-6xl">
                <p className="text-sm">
                  &copy; {new Date().getFullYear()} Learning Log. All rights
                  reserved.
                </p>
              </div>
            </footer>
          )}
        </body>
      </html>
    </ClerkProvider>
  )
}
