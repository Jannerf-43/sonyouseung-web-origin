'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

export default function EditPostPage({
  params,
}: {
  params: { post_id: string }
}) {
  const { user } = useUser()
  const router = useRouter()
  const slug = params.post_id

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')

  // 기존 글 불러오기
  useEffect(() => {
    const loadPost = async () => {
      const res = await fetch(`/api/posts/${slug}`)
      const data = await res.json()

      if (!data.ok) {
        setError(data.error)
        setLoading(false)
        return
      }

      const p = data.post
      setTitle(p.title)
      setCategory(p.category)
      setExcerpt(p.excerpt)
      setContent(p.content)

      setLoading(false)
    }

    loadPost()
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch(`/api/posts/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        category,
        excerpt,
        content,
      }),
    })

    const data = await res.json()

    if (!data.ok) {
      setError(data.error)
      return
    }

    router.push(`/posts/${data.post.slug}`)
  }

  if (!user) {
    return (
      <div className="text-center text-gray-600 mt-20">
        수정하려면 로그인해야 합니다.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-20">
        데이터를 불러오는 중입니다...
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500 mt-20">오류: {error}</div>
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        게시물 수정
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-indigo-50"
      >
        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium mb-1">제목</label>
          <input
            aria-label="aaa"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block text-sm font-medium mb-1">카테고리</label>
          <input
            aria-label="aaa"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        {/* excerpt */}
        <div>
          <label className="block text-sm font-medium mb-1">요약</label>
          <textarea
            aria-label="aaa"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
          />
        </div>

        {/* 본문 */}
        <div>
          <label className="block text-sm font-medium mb-1">본문 내용</label>
          <textarea
            aria-label="aaa"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 font-mono text-sm"
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {/* 제출 */}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition"
        >
          수정 완료
        </button>
      </form>
    </div>
  )
}
