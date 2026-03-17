"use client"

import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/lib/languageContext"

// First 4 always-visible flags in the navbar
const VISIBLE_LANGUAGES = [
  { code: "en", label: "English",    emoji: "🇬🇧" },
  { code: "es", label: "Español",    emoji: "🇪🇸" },
  { code: "fr", label: "Français",   emoji: "🇫🇷" },
  { code: "de", label: "Deutsch",    emoji: "🇩🇪" },
]

// Additional languages shown in the "more" dropdown
const MORE_LANGUAGES = [
  { code: "it", label: "Italiano",   emoji: "🇮🇹" },
  { code: "pt", label: "Português",  emoji: "🇧🇷" },
  { code: "zh", label: "中文",        emoji: "🇨🇳" },
  { code: "ja", label: "日本語",      emoji: "🇯🇵" },
  { code: "ko", label: "한국어",      emoji: "🇰🇷" },
  { code: "hi", label: "हिन्दी",    emoji: "🇮🇳" },
  { code: "ar", label: "العربية",    emoji: "🇸🇦" },
  { code: "ru", label: "Русский",    emoji: "🇷🇺" },
  { code: "nl", label: "Nederlands", emoji: "🇳🇱" },
  { code: "tr", label: "Türkçe",     emoji: "🇹🇷" },
  { code: "yo", label: "Yorùbá",     emoji: "🇳🇬" },
  { code: "sw", label: "Kiswahili",  emoji: "🇰🇪" },
  { code: "ha", label: "Hausa",      emoji: "🇳🇬" },
  { code: "am", label: "አማርኛ",      emoji: "🇪🇹" },
]

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [showMore, setShowMore] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showMore) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowMore(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [showMore])

  const activeMoreLang = MORE_LANGUAGES.find(l => l.code === language)
  const isInMore       = Boolean(activeMoreLang)

  const handleSelect = (code: string) => {
    setLanguage(code)
    setShowMore(false)
  }

  return (
    <div className="flex items-center gap-1">
      {/* Always-visible flags */}
      {VISIBLE_LANGUAGES.map(lang => (
        <button
          key={lang.code}
          onClick={() => handleSelect(lang.code)}
          title={lang.label}
          className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition-all duration-200 ${
            language === lang.code
              ? "bg-hunter-green text-white shadow-sm scale-110"
              : "text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
          }`}
        >
          {lang.emoji}
        </button>
      ))}

      {/* Globe / "More languages" button + dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowMore(v => !v)}
          title="More languages"
          className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition-all duration-200 ${
            isInMore || showMore
              ? "bg-hunter-green text-white shadow-sm scale-110"
              : "text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
          }`}
        >
          {/* Show the active language flag if it lives in the "more" list */}
          {isInMore ? activeMoreLang!.emoji : "🌐"}
        </button>

        {showMore && (
          <div className="absolute right-0 top-10 z-50 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl shadow-xl py-2 w-44">
            <p className="px-4 pb-1.5 pt-0.5 text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">
              More languages
            </p>
            {MORE_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors hover:bg-stone-50 dark:hover:bg-stone-800 ${
                  language === lang.code
                    ? "text-hunter-green bg-vanilla-cream/60 dark:bg-orange-900/20"
                    : "text-stone-700 dark:text-stone-300"
                }`}
              >
                <span className="text-lg leading-none">{lang.emoji}</span>
                <span>{lang.label}</span>
                {language === lang.code && (
                  <span className="ml-auto text-hunter-green text-xs font-bold">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
