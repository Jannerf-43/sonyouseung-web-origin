import { IComment } from '@/models/Comment'

export default function CommentItem({ comment }: { comment: IComment }) {
  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white">
      <div className="text-sm text-gray-500 mb-2">
        {comment.authorName} ·{' '}
        {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
      </div>
      <p className="text-gray-800 whitespace-pre-line">{comment.content}</p>
    </div>
  )
}
