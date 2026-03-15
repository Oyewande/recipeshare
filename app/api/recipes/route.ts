import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
)

// GET /api/recipes — fetch recipes with optional search, language, and limit
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")
  const language = searchParams.get("language")
  const limit = parseInt(searchParams.get("limit") || "20", 10)

  let query = supabase
    .from("Recipe Translations")
    .select("*")
    .limit(limit)
    .order("created_at", { ascending: false })

  if (language) {
    query = query.eq("language", language)
  }

  if (search) {
    query = query.ilike("title", `%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ recipes: data })
}

// POST /api/recipes — create a new recipe + its first translation
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, ingredients, instructions, country, language, image_url } = body

    if (!title || !ingredients || !instructions) {
      return NextResponse.json(
        { error: "title, ingredients, and instructions are required" },
        { status: 400 }
      )
    }

    // 1. Insert into "recipes" table
    const { data: recipeData, error: recipeError } = await supabase
      .from("Recipes")
      .insert({
        title,
        ingredients,
        instructions,
        country: country || "Unknown",
        original_language: language || "en",
        image_url: image_url || "",
      })
      .select()

    if (recipeError) {
      return NextResponse.json({ error: recipeError.message }, { status: 500 })
    }

    const recipeId = recipeData[0].id

    // 2. Insert the translation
    const { error: translationError } = await supabase
      .from("Recipe Translations")
      .insert({
        recipe_id: recipeId,
        language: language || "en",
        title,
        ingredients,
        instructions,
      })

    if (translationError) {
      return NextResponse.json({ error: translationError.message }, { status: 500 })
    }

    return NextResponse.json({ id: recipeId, message: "Recipe created" }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid request" }, { status: 400 })
  }
}