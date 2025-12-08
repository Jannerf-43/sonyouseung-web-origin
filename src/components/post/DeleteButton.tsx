// src/components/post/DeleteButton.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteButton({ slug }: { slug: string }) {
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/profile/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setRole(data.profile.role)
      })
  }, [])

  if (role !== 'admin') return null

  const handleDelete = async () => {
    const ok = confirm('정말로 이 게시물을 삭제하시겠습니까?')
    if (!ok) return

    const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' })
    const data = await res.json()

    if (data.ok) {
      alert('게시물이 삭제되었습니다.')
      router.push('/posts')
    } else {
      alert(data.error || '삭제 중 오류가 발생했습니다.')
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 font-medium"
    >
      🗑 삭제하기
    </button>
  )
}
