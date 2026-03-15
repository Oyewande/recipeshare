import { NextResponse } from "next/server"

// POST /api/translate — translate text using lingo.dev or fallback
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text, targetLanguage } = body

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: "text and targetLanguage are required" },
        { status: 400 }
      )
    }

    const apiKey = process.env.NEXT_PUBLIC_LINGO_API_KEY

    // If no API key, return mock translation (prefix with language code)
    if (!apiKey || apiKey === "dummy") {
      return NextResponse.json({
        translated: text,
        source: "mock",
        note: "Set NEXT_PUBLIC_LINGO_API_KEY in .env.local for real translations.",
      })
    }

    // Real translation via lingo.dev
    try {
      // @ts-ignore — lingo.dev has no type declarations
      const Lingo = (await import("lingo.dev")).default
      const lingo = new Lingo({ apiKey })

      const result = await lingo.translate({
        input: text,
        targetLanguage,
      })

      return NextResponse.json({
        translated: result.output,
        source: "lingo.dev",
      })
    } catch (lingoErr: any) {
      console.error("Lingo.dev error:", lingoErr)
      return NextResponse.json({
        translated: text,
        source: "fallback",
        error: lingoErr.message,
      })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid request" }, { status: 400 })
  }
}