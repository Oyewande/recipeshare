import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET /api/comments?recipe_id=xxx — fetch comments for a recipe
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const recipeId = searchParams.get("recipe_id")

  if (!recipeId) {
    return NextResponse.json({ error: "recipe_id is required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("Comments")
    .select("*")
    .eq("recipe_id", recipeId)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ comments: data })
}

const MAX_COMMENT_CHARS = 1_000

// POST /api/comments — create a new comment
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { recipe_id, content } = body

    if (!recipe_id || !content) {
      return NextResponse.json(
        { error: "recipe_id and content are required" },
        { status: 400 }
      )
    }

    // Security: enforce max length to prevent abuse
    if (typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "content must be a non-empty string" }, { status: 400 })
    }
    if (content.length > MAX_COMMENT_CHARS) {
      return NextResponse.json({ error: `Comment cannot exceed ${MAX_COMMENT_CHARS} characters` }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("Comments")
      .insert({
        recipe_id,
        content: content.trim(),
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