"use client"

import { useLanguage } from "@/lib/languageContext"

const languages = [
  { code: "en", label: "EN", emoji: "🇬🇧" },
  { code: "es", label: "ES", emoji: "🇪🇸" },
  { code: "fr", label: "FR", emoji: "🇫🇷" },
  { code: "de", label: "DE", emoji: "🇩🇪" },
]

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex gap-1">
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
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
    </div>
  )
}