"use client"

// @ts-ignore
import Lingo from "lingo.dev"

export const lingo = new Lingo({
  apiKey: process.env.NEXT_PUBLIC_LINGO_API_KEY || "dummy",
})

export async function translateText(
  text: string,
  targetLanguage: string
): Promise<string> {
  if (!process.env.NEXT_PUBLIC_LINGO_API_KEY) {
    return text // Mock translation fallback
  }
  try {
    const translated = await lingo.translate({
      input: text,
      targetLanguage,
    })
    return translated.output
  } catch (error) {
    console.error("Translation error:", error)
    return text // fallback to original
  }
}

// Batch translation for multiple strings (faster for Explore page)
export async function batchTranslate(texts: string[], targetLanguage: string): Promise<string[]> {
  return Promise.all(texts.map((t) => translateText(t, targetLanguage)))
}