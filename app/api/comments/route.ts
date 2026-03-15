import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
)

// GET /api/comments?recipe_id=xxx — fetch comments for a recipe
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const recipeId = searchParams.get("recipe_id")

  if (!recipeId) {
    return NextResponse.json({ error: "recipe_id is required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("recipe_id", recipeId)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ comments: data })
}

// POST /api/comments — create a new comment
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { recipe_id, content, user_name } = body

    if (!recipe_id || !content) {
      return NextResponse.json(
        { error: "recipe_id and content are required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({
        recipe_id,
        content,
        user_name: user_name || "Anonymous",
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ comment: data[0] }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid request" }, { status: 400 })
  }
}