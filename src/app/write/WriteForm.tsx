'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function WriteForm() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, category, excerpt, content }),
    })

    const data = await res.json()

    if (data.ok) {
      router.push(`/posts/${data.post.slug}`)
    } else {
      alert(data.error || '오류 발생')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 제목 */}
      <input
        type="text"
        placeholder="제목"
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* slug */}
      <input
        type="text"
        placeholder="URL (slug)"
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />

      {/* 카테고리 */}
      <input
        type="text"
        placeholder="카테고리"
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      {/* 요약 */}
      <textarea
        placeholder="요약문"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 min-h-[120px]"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
      />

      {/* 본문 */}
      <textarea
        placeholder="본문"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 min-h-[200px]"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* 버튼 */}
      <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg">
        작성하기
      </button>
    </form>
  )
}
