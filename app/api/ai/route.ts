import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const MAX_INGREDIENTS_CHARS = 5_000
const MAX_REGION_CHARS = 100

export async function POST(request: Request) {
  try {
    const { ingredientsText, userRegion = "Global" } = await request.json()

    if (!ingredientsText || typeof ingredientsText !== "string") {
      return NextResponse.json(
        { error: "ingredientsText is required" },
        { status: 400 }
      )
    }

    // Security: cap payload to prevent runaway Anthropic API charges
    if (ingredientsText.length > MAX_INGREDIENTS_CHARS) {
      return NextResponse.json(
        { error: `ingredientsText cannot exceed ${MAX_INGREDIENTS_CHARS} characters` },
        { status: 400 }
      )
    }

    const safeRegion = typeof userRegion === "string"
      ? userRegion.slice(0, MAX_REGION_CHARS)
      : "Global"

    // Server-only key — no NEXT_PUBLIC_ prefix so it is never sent to the browser
    const apiKey = process.env.ANTHROPIC_API_KEY

    // Real Anthropic keys start with "sk-ant-"
    if (!apiKey || !apiKey.startsWith("sk-ant-")) {
      return NextResponse.json({ recommendations: [] })
    }
    
    const anthropic = new Anthropic({ apiKey: apiKey! })

    const prompt = `
You are an expert culinary AI. The user is located in or prefers the region: "${safeRegion}".
Analyze the following ingredients and provide local or common substitute recommendations for any hard-to-find or culturally specific items, tailored specifically for someone in the specified region. 
Return an array of JSON objects with exactly these keys: "original" (the ingredient from the text), "substitute" (the recommended alternative), "reason" (why it works), "ratio" (the substitution ratio).
If no substitutions are needed, return an empty array [].

Ingredients: ${ingredientsText}

Respond ONLY with valid JSON containing the array of objects. Do not include markdown blocks or other text.
`

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    })

    // Handle string parsing based on Anthropic API format
    // Guard against empty content array to avoid runtime crash
    const firstBlock = response.content[0]
    const resultText = (firstBlock && firstBlock.type === "text" ? firstBlock.text : null) || "[]"
    
    let recommendations = []
    try {
      recommendations = JSON.parse(resultText)
    } catch (e) {
      // In case of markdown formatting despite instructions
      const match = resultText.match(/```json\n([\s\S]*?)\n```/)
      if (match) {
        recommendations = JSON.parse(match[1])
      }
    }

    return NextResponse.json({ recommendations })
  } catch (err: any) {
    console.error("AI Substitute Error:", err)
    return NextResponse.json({ recommendations: [] })
  }
}
