"use client"

import { useState, useEffect, useRef } from "react"
import { useLanguage } from "./languageContext"
import { UI_STRINGS, UIKey } from "./uiStrings"

// Module-level cache so translated strings survive component re-mounts
const cache: Record<string, Record<string, string>> = {}

export function useUI() {
  const { language } = useLanguage()
  const [strings, setStrings] = useState<Record<string, string>>(UI_STRINGS)
  const loadingRef = useRef<string | null>(null)

  useEffect(() => {
    // English (and "all") — just use the static strings, no API needed
    if (language === "en" || language === "all" || !language) {
      setStrings(UI_STRINGS)
      return
    }

    // Serve from cache if already translated
    if (cache[language]) {
      setStrings(cache[language])
      return
    }

    // Prevent duplicate in-flight requests for the same language
    if (loadingRef.current === language) return
    loadingRef.current = language

    const keys = Object.keys(UI_STRINGS) as UIKey[]
    const values = keys.map((k) => UI_STRINGS[k])

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: values, targetLanguage: language }),
    })
      .then((r) => r.json())
      .then((data) => {
        // Only cache real translations — if the API has no key configured it
        // returns source:"mock" with the original English strings, which must
        // NOT be cached so the next render can retry once a key is present.
        if (
          Array.isArray(data.translations) &&
          data.translations.length === keys.length &&
          data.source !== "mock" &&
          data.source !== "fallback"
        ) {
          const translated: Record<string, string> = {}
          keys.forEach((k, i) => {
            translated[k] = data.translations[i] || UI_STRINGS[k]
          })
          cache[language] = translated
          setStrings(translated)
        }
      })
      .catch(() => {
        // Silently fall back to English on any network / API error
        setStrings(UI_STRINGS)
      })
      .finally(() => {
        loadingRef.current = null
      })
  }, [language])

  /** Look up a UI string by key, falling back to the English default */
  const t = (key: UIKey): string =>
    (strings as Record<string, string>)[key] ?? UI_STRINGS[key]

  return { t }
}
