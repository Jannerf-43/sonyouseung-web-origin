// src/app/layout.tsx
import './globals.css'
import React from 'react'
import Link from 'next/link'
import { GeistSans, GeistMono } from 'geist/font'
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs'
import UserButtons from '@/components/UserButton'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await connectDB()

  // DB에서 카테고리 목록 계산
  const posts = await Post.find().lean()
  const categoryMap: Record<string, number> = {}
  for (const p of posts) {
    if (!p.category) continue
    categoryMap[p.category] = (categoryMap[p.category] || 0) + 1
  }
  const categories = Object.entries(categoryMap).map(([name, count]) => ({
    name,
    count,
  }))
  const totalPosts = posts.length

  return (
    <ClerkProvider>
      <html lang="ko" className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <body className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
          {/* ------------------------------------------------ */}
          {/* 🔵 로그인 상태 — 기존 전체 레이아웃 보임 */}
          {/* ------------------------------------------------ */}
          <SignedIn>
            {/* Header */}
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
                <UserButtons />
              </div>
            </header>

            {/* Main */}
            <main className="container mx-auto px-4 py-8 max-w-6xl flex-grow">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Main content */}
                <div className="lg:w-3/4 w-full">{children}</div>

                {/* Sidebar */}
                <aside className="lg:w-1/4 w-full lg:sticky lg:top-20 h-full space-y-8">
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">
                      About Me
                    </h2>
                    <p className="text-sm">
                      현재 중부대학교 고양캠퍼스 재학중이며, 정보보호학을
                      전공하고 있습니다.
                    </p>
                    <Link
                      href="/about"
                      className="mt-3 inline-block text-indigo-500 hover:text-indigo-700 text-sm font-semibold"
                    >
                      더 보기 →
                    </Link>
                  </div>

                  {/* Categories */}
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">
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
                          <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
                            {cat.count}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
              </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
              <p className="text-sm">© {new Date().getFullYear()}</p>
            </footer>
          </SignedIn>

          {/* ------------------------------------------------ */}
          {/* 🔴 비로그인 상태 — 레이아웃 완전 숨김 + children만 */}
          {/* ------------------------------------------------ */}
          <SignedOut>
            <div className="flex justify-center items-center min-h-screen px-4">
              {children}
            </div>
          </SignedOut>
        </body>
      </html>
    </ClerkProvider>
  )
}
