import { useState, useEffect } from "react"
import { Recipe } from "@/types/recipe"
import { fetchRecipeById } from "@/lib/recipe"

export function useRecipe(id: string, language: string) {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchRecipeById(id, language)
      .then(setRecipe)
      .finally(() => setLoading(false))
  }, [id, language])

  return { recipe, loading }
}