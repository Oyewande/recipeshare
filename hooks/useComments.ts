import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Comment } from "@/types/comment"

export function useComments(recipeId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!recipeId) return

    setLoading(true)
    supabase
      .from("Comments")
      .select("*")
      .eq("recipe_id", recipeId)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching comments:", error)
          setComments([])
        } else {
          setComments(data || [])
        }
        setLoading(false)
      })
  }, [recipeId])

  return { comments, loading, setComments }
}
