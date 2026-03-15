import { supabase } from "./supabase"
import { Recipe } from "@/types/recipe"

export async function fetchRecipes(language: string, limit = 12, search?: string): Promise<Recipe[]> {
  let query = supabase
    .from("Recipes")
    .select("*")
    .limit(limit)

  if (search) {
    query = query.ilike("title", `%${search}%`)
  }

  const { data: recipes, error: recipesError } = await query
  if (recipesError) {
    console.error("Error fetching recipes:", recipesError)
    return []
  }

  if (!recipes || recipes.length === 0) return []
  
  // Fetch matching translations for these recipes
  const recipeIds = recipes.map(r => r.id)
  const { data: translationsData, error: translationsError } = await supabase
    .from("Recipe Translations")
    .select("*")
    .in("recipe_id", recipeIds)
  
  const translations = translationsData || []

  try {
    const translatedList = await Promise.all(recipes.map(async (item: any) => {
      const translationsArray = item["Recipe Translations"] || []
      let translation = translationsArray.find((t: any) => t.language === language)

  
      if (!translation && item.original_language && language !== "all" && language !== item.original_language) {
        try {
          const res = await fetch("/api/translate", {
            method: "POST",
            body: JSON.stringify({ text: item.title, targetLanguage: language })
          })
          const result = await res.json()
          item.title = result.translated || item.title
        } catch (e) { }
      } else if (translation) {
        item.title = translation.title || item.title
        item.ingredients = translation.ingredients || item.ingredients
        item.instructions = translation.instructions || translation.steps || item.instructions
      }

      return {
        id: item.id,
        country: item.country,
        image_url: item.image_url,
        original_language: item.original_language,
        title: item.title || "",
        ingredients: item.ingredients || "",
        instructions: item.instructions || "",
      } as unknown as Recipe
    }))

    return translatedList as Recipe[]
  } catch (err) {
    console.error("Translation mapping error:", err)
    return []
  }
}

export async function fetchRecipeById(id: string, language: string): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from("Recipe Translations")
    .select("*")
    .eq("recipe_id", id)
    .eq("language", language)
    .single()

  if (error) {
    console.error(error)
    return null
  }
  return data as Recipe
}

export async function fetchRecipesByCountry(country: string, language: string, limit = 12): Promise<Recipe[]> {
  const { data: recipes, error: recipesError } = await supabase
    .from("Recipes")
    .select("*")
    .ilike("country", `%${country}%`)
    .limit(limit)

  if (recipesError) {
    console.error("Error fetching recipes by country:", recipesError)
    return []
  }

  if (!recipes || recipes.length === 0) return []

  const recipeIds = recipes.map(r => r.id)
  const { data: translationsData } = await supabase
    .from("Recipe Translations")
    .select("*")
    .in("recipe_id", recipeIds)
    
  const translations = translationsData || []



  try {
    const translatedList = await Promise.all(recipes.map(async (item: any) => {
      const itemTranslations = translations.filter(t => t.recipe_id === item.id)
      let translation = itemTranslations.find((t: any) => t.language === language)

      if (!translation && itemTranslations.length > 0) {
        translation = itemTranslations[0]
        const res = await fetch("/api/translate", {
          method: "POST",
          body: JSON.stringify({ text: translation.title, targetLanguage: language })
        })
        const result = await res.json()
        translation = { ...translation, title: result.translated || translation.title }
      }

      const t = translation || {}
      return {
        id: item.id,
        country: item.country,
        image_url: item.image_url,
        original_language: item.original_language,
        title: t.title || "",
        ingredients: t.ingredients || "",
        instructions: t.instructions || "",
      } as Recipe
    }))

    return translatedList as Recipe[]
  } catch (err) {
    return []
  }
}