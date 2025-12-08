// src/app/category/[category]/page.tsx
import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'

interface PostType {
  _id: string
  title: string
  slug: string
  category: string
  excerpt?: string
  createdAt: string
}

export const runtime = 'nodejs'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const decoded = decodeURIComponent(category)

  await connectDB()

  const posts = await Post.find({ category: decoded })
    .sort({ createdAt: -1 })
    .lean()

  if (!posts || posts.length === 0) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">{decoded}</h1>

      <div className="grid gap-6">
        {posts.map((post: PostType) => (
          <a
            key={post._id}
            href={`/posts/${post.slug}`}
            className="block p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600">{post.excerpt}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
