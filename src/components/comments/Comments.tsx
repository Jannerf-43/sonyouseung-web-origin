'use client'

import { useState, useEffect } from 'react'
import { IComment } from '@/models/Comment'

export default function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<IComment[]>([])
  const [content, setContent] = useState('')

  async function load() {
    const res = await fetch(`/api/comments/${slug}`)
    const data = (await res.json()) as { comments: IComment[] }
    setComments(data.comments || [])
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    load()
  }, [slug])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    await fetch(`/api/comments/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })

    setContent('')
    load()
  }

  return (
    <div className="mt-10 space-y-4">
      <h3 className="text-xl font-semibold mb-4">댓글</h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          className="w-full border p-3 rounded-lg"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력하세요..."
        />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
          등록
        </button>
      </form>

      <div className="space-y-3">
        {comments.map((c) => (
          <div
            key={c._id}
            className="border p-4 bg-gray-50 rounded-lg shadow-sm"
          >
            <div className="text-sm text-gray-600 mb-1">
              {c.authorName}{' '}
              <span className="text-gray-400">
                ({new Date(c.createdAt).toLocaleDateString('ko-KR')})
              </span>
            </div>
            <p className="whitespace-pre-line">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
