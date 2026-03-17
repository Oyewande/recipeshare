"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUI } from "@/lib/useUI"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const { t } = useUI()
  const router = useRouter()

  const handleSearch = () => {
    const trimmed = query.trim()
    if (!trimmed) return
    router.push(`/explore?search=${encodeURIComponent(trimmed)}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto relative group">

      {/* Glow effect behind the input */}
      <div className="absolute -inset-1 bg-gradient-to-r from-orange-300 to-yellow-green rounded-[28px] blur opacity-25 group-hover:opacity-40 transition duration-500"></div>

      <div className="relative flex items-center bg-white dark:bg-stone-900 rounded-[24px] border border-stone-200 dark:border-stone-800 shadow-sm p-1.5 transition-shadow focus-within:ring-2 focus-within:ring-hunter-green/20">

        <div className="pl-4 pr-2 text-stone-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent px-2 py-3 outline-none text-stone-800 dark:text-stone-100 placeholder:text-stone-400 font-medium"
        />

        <button
          onClick={handleSearch}
          className="bg-hunter-green hover:bg-sage-green dark:bg-hunter-green dark:hover:bg-sage-green text-white dark:text-stone-950 px-6 py-3 rounded-[20px] font-semibold transition-all active:scale-95 shadow-sm"
        >
          {t("searchBtn")}
        </button>
      </div>
    </div>
  )
}
