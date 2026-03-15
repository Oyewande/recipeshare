"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface LocalComment {
  id?: string
  text: string
  time: string
  user_name?: string
}

export default function CommentSection({ recipeId, language }: { recipeId: string, language: string }) {
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<LocalComment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!recipeId) return
    const fetchComments = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("recipe_id", recipeId)
        .order("created_at", { ascending: false })

      if (error || !data) {
        setComments([])
        setLoading(false)
        return
      }

      const commentIds = data.map(c => c.id)
      const { data: translations } = await supabase
        .from("Comment Translations")
        .select("*")
        .in("comment_id", commentIds)
        .eq("language", language)
        
      const translatedComments = await Promise.all(data.map(async (c) => {
        let text = c.content
        const t = (translations || []).find(trans => trans.comment_id === c.id)
        if (t) {
          text = t.content || t.text || text
        } else if (language !== "all" && language !== "en") { 
           try {
              const res = await fetch("/api/translate", { method: "POST", body: JSON.stringify({text: c.content, targetLanguage: language}) })
              const result = await res.json()
              if (result.translated) {
                 text = result.translated
                 if (result.source === "lingo.dev") {
                   supabase.from("Comment Translations").insert({ comment_id: c.id, language, content: text }).then(({error}) => {
                     if(error) supabase.from("Comment Translations").insert({ comment_id: c.id, language, text: text }).then()
                   })
                 }
              }
           } catch (e) {}
        }

        return {
          id: c.id,
          text: text,
          user_name: c.user_name || "Anonymous",
          time: new Date(c.created_at).toLocaleString(),
        }
      }))

      setComments(translatedComments)
      setLoading(false)
    }
    fetchComments()
  }, [recipeId, language])

  const addComment = async () => {
    if (!comment.trim() || !recipeId) return
    
    const { data, error } = await supabase.from("comments").insert({
        recipe_id: recipeId,
        content: comment,
        user_name: "Anonymous"
    }).select()
    
    if (data && data.length > 0) {
        const c = data[0]
        const newComment: LocalComment = {
          id: c.id,
          text: comment, 
          time: new Date(c.created_at).toLocaleString(),
          user_name: c.user_name
        }
        setComments([newComment, ...comments])
        setComment("")
        
        if (language !== "en" && language !== "all") {
             supabase.from("Comment Translations").insert({ comment_id: c.id, language, content: comment }).then(({error}) => {
               if(error) supabase.from("Comment Translations").insert({ comment_id: c.id, language, text: comment }).then()
             })
        }
    }
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

      {loading ? (
        <div className="text-center py-8 text-stone-400 animate-pulse">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-stone-400">
          <span className="text-3xl block mb-2">🍿</span>
          <p className="text-sm font-medium">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c, index) => (
            <div key={index} className="flex gap-3 animate-fade-in">
              <div className="w-9 h-9 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-stone-500 dark:text-stone-400 font-bold text-sm flex-shrink-0">
                {c.user_name ? c.user_name[0].toUpperCase() : "U"}
              </div>
              <div className="flex-1 bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2 mb-1">
                   <p className="text-sm font-bold text-stone-700 dark:text-stone-300">{c.user_name}</p>
                   <p className="text-xs text-stone-400">{c.time}</p>
                </div>
                <p className="text-stone-800 dark:text-stone-200 leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}