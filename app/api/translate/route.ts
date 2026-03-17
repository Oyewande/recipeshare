import { NextResponse } from "next/server"

// POST /api/translate
// Accepts either:
//   { text: string, targetLanguage: string }        → { translated: string, source }
//   { texts: string[], targetLanguage: string }     → { translations: string[], source }
const MAX_SINGLE_CHARS = 20_000
const MAX_BATCH_ITEMS = 200
const MAX_BATCH_ITEM_CHARS = 5_000
const MAX_LANG_CHARS = 10

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text, texts, targetLanguage } = body

    // --- Input validation & length limits (security: prevent credit-burning attacks) ---
    if (!targetLanguage || typeof targetLanguage !== "string" || targetLanguage.length > MAX_LANG_CHARS) {
      return NextResponse.json({ error: "Valid targetLanguage is required (max 10 chars)" }, { status: 400 })
    }

    const isBatch = Array.isArray(texts) && texts.length > 0
    const isSingle = typeof text === "string" && text.length > 0

    if (!isBatch && !isSingle) {
      return NextResponse.json(
        { error: "text or texts, and targetLanguage are required" },
        { status: 400 }
      )
    }

    if (isBatch) {
      if (texts.length > MAX_BATCH_ITEMS) {
        return NextResponse.json({ error: `Batch size cannot exceed ${MAX_BATCH_ITEMS} strings` }, { status: 400 })
      }
      const oversized = texts.find((t: string) => typeof t === "string" && t.length > MAX_BATCH_ITEM_CHARS)
      if (oversized !== undefined) {
        return NextResponse.json({ error: `Each string in batch cannot exceed ${MAX_BATCH_ITEM_CHARS} characters` }, { status: 400 })
      }
    }

    if (isSingle && text.length > MAX_SINGLE_CHARS) {
      return NextResponse.json({ error: `Text cannot exceed ${MAX_SINGLE_CHARS} characters` }, { status: 400 })
    }

    // Server-only key — no NEXT_PUBLIC_ prefix so it is never sent to the browser
    const apiKey = process.env.LINGO_API_KEY

    // Treat missing or placeholder values as unconfigured
    if (!apiKey || apiKey.includes("your_") || apiKey === "dummy") {
      if (isBatch) {
        return NextResponse.json({ translations: texts, source: "mock" })
      }
      return NextResponse.json({ translated: text, source: "mock" })
    }

    try {
      const { LingoDotDevEngine } = await import("lingo.dev/sdk")
      const engine = new LingoDotDevEngine({ apiKey })

      if (isBatch) {
        // Translate all strings in parallel
        const results = await Promise.all(
          texts.map((t: string) =>
            engine
              .localizeText(t, { sourceLocale: "en", targetLocale: targetLanguage })
              .catch(() => t) // fallback to original on individual failure
          )
        )
        return NextResponse.json({ translations: results, source: "lingo.dev" })
      }

      const translated = await engine.localizeText(text, {
        sourceLocale: "en",
        targetLocale: targetLanguage,
      })
      return NextResponse.json({ translated, source: "lingo.dev" })
    } catch (lingoErr: any) {
      console.error("Lingo.dev error:", lingoErr)
      if (isBatch) {
        return NextResponse.json({ translations: texts, source: "fallback", error: lingoErr.message })
      }
      return NextResponse.json({ translated: text, source: "fallback", error: lingoErr.message })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid request" }, { status: 400 })
  }
}
