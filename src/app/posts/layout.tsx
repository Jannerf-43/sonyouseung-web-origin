import React from 'react'

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl flex-grow">
      {children}
    </div>
  )
}
