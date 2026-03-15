"use client"

import { useState } from "react"

interface LocalComment {
  text: string
  time: string
}

export default function CommentSection() {
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<LocalComment[]>([])

  const addComment = () => {
    if (!comment.trim()) return
    const newComment: LocalComment = {
      text: comment,
      time: new Date().toLocaleString(),
    }
    setComments([newComment, ...comments])
    setComment("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      addComment()
    }
  }

  return (
    <div className="mt-12 mb-8">
      <h3 className="text-2xl font-bold text-stone-900 dark:text-white mb-6 flex items-center gap-2">
        <span className="text-hunter-green">💬</span>
        Comments
        {comments.length > 0 && (
          <span className="text-xs font-semibold bg-vanilla-cream dark:bg-orange-900/30 text-hunter-green dark:text-sage-green px-2 py-0.5 rounded-full">
            {comments.length}
          </span>
        )}
      </h3>

      {/* Input */}
      <div className="glass-card rounded-2xl p-4 mb-8">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sage-green to-yellow-green flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            U
          </div>
          <div className="flex-1 flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-2.5 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-hunter-green/30 focus:border-hunter-green transition-all"
              placeholder="Share your thoughts..."
            />
            <button
              onClick={addComment}
              disabled={!comment.trim()}
              className="bg-hunter-green text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-hunter-green transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-sm"
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-12 text-stone-400">
          <span className="text-3xl block mb-2">🍿</span>
          <p className="text-sm font-medium">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c, index) => (
            <div key={index} className="flex gap-3 animate-fade-in">
              <div className="w-9 h-9 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-stone-500 dark:text-stone-400 font-bold text-sm flex-shrink-0">
                U
              </div>
              <div className="flex-1 bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-800">
                <p className="text-stone-800 dark:text-stone-200 leading-relaxed">{c.text}</p>
                <p className="text-xs text-stone-400 mt-2">{c.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}