import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

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

const MAX_TITLE_CHARS = 200
const MAX_INGREDIENTS_CHARS = 10_000
const MAX_INSTRUCTIONS_CHARS = 20_000
const MAX_COUNTRY_CHARS = 100
const MAX_IMAGE_URL_CHARS = 500

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

    // Security: enforce max lengths to prevent oversized inserts
    if (title.length > MAX_TITLE_CHARS) {
      return NextResponse.json({ error: `title cannot exceed ${MAX_TITLE_CHARS} characters` }, { status: 400 })
    }
    if (ingredients.length > MAX_INGREDIENTS_CHARS) {
      return NextResponse.json({ error: `ingredients cannot exceed ${MAX_INGREDIENTS_CHARS} characters` }, { status: 400 })
    }
    if (instructions.length > MAX_INSTRUCTIONS_CHARS) {
      return NextResponse.json({ error: `instructions cannot exceed ${MAX_INSTRUCTIONS_CHARS} characters` }, { status: 400 })
    }

    // 1. Insert into "Recipes" table
    const { data: recipeData, error: recipeError } = await supabase
      .from("Recipes")
      .insert({
        title,
        ingredients,
        instructions,
        country: country ? String(country).slice(0, MAX_COUNTRY_CHARS) : "Unknown",
        original_language: language || "en",
        image_url: image_url ? String(image_url).slice(0, MAX_IMAGE_URL_CHARS) : "",
      })
      .select()

    if (recipeError) {
      return NextResponse.json({ error: recipeError.message }, { status: 500 })
    }

    const recipeId = recipeData[0].id

    // 2. Insert the translation
    // Note: "Recipe Translations" uses `steps` (not `instructions`) for the cooking steps column
    const { error: translationError } = await supabase
      .from("Recipe Translations")
      .insert({
        recipe_id: recipeId,
        language: language || "en",
        title,
        ingredients,
        steps: instructions,
      })

    if (translationError) {
      return NextResponse.json({ error: translationError.message }, { status: 500 })
    }

    return NextResponse.json({ id: recipeId, message: "Recipe created" }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid request" }, { status: 400 })
  }
}