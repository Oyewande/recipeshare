"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import SearchBar from "@/components/SearchBar"
import RecipeGrid from "@/components/RecipeGrid"
import { Recipe } from "@/types/recipe"
import { fetchRecipes } from "@/lib/recipe"
import { useLanguage } from "@/lib/languageContext"
import { useUI } from "@/lib/useUI"

// Module-level cache: survives component re-mounts (e.g. navigating away and back).
// Keyed by "<language>__<searchQuery>" so different searches stay separate.
const recipeCache: Record<string, Recipe[]> = {}

// Inner component — allowed to call useSearchParams() because it will always
// be rendered inside a <Suspense> boundary (see ExplorePageWrapper below).
function ExploreContent() {
  const { language } = useLanguage()
  const { t } = useUI()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  // allRecipes holds the full fetched set; recipes is the client-side filtered view.
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [filterLang, setFilterLang] = useState("all")
  // Track the last fetch key so we don't fire duplicate in-flight requests.
  const fetchingRef = useRef<string | null>(null)

  const LANGUAGES = [
    { code: "all", label: t("filterAll"),    emoji: "🌍" },
    { code: "en",  label: t("filterEnglish"),emoji: "🇬🇧" },
    { code: "es",  label: t("filterSpanish"),emoji: "🇪🇸" },
    { code: "fr",  label: t("filterFrench"), emoji: "🇫🇷" },
    { code: "de",  label: t("filterGerman"), emoji: "🇩🇪" },
  ]

  // Effect 1: Fetch from Supabase only when language or search query changes.
  // Changing the language filter (filterLang) does NOT trigger a new network call.
  useEffect(() => {
    const cacheKey = `${language}__${searchQuery}`

    // Serve from in-memory cache if we already have the data.
    if (recipeCache[cacheKey]) {
      setAllRecipes(recipeCache[cacheKey])
      setLoading(false)
      return
    }

    // Prevent duplicate in-flight requests for the same key.
    if (fetchingRef.current === cacheKey) return
    fetchingRef.current = cacheKey

    const fetchExploreRecipes = async () => {
      setLoading(true)
      try {
        const data = await fetchRecipes(language, 30, searchQuery || undefined)
        recipeCache[cacheKey] = data
        setAllRecipes(data)
      } catch (err) {
        console.error(err)
        setAllRecipes([])
      } finally {
        fetchingRef.current = null
        setLoading(false)
      }
    }

    fetchExploreRecipes()
  }, [language, searchQuery])

  // Effect 2: Filter client-side whenever the language filter or the full list changes.
  // Zero network calls — instant response.
  useEffect(() => {
    if (filterLang === "all") {
      setRecipes(allRecipes)
    } else {
      setRecipes(allRecipes.filter(r => r.original_language?.toLowerCase() === filterLang.toLowerCase()))
    }
  }, [filterLang, allRecipes])

  const count = recipes.length
  const countLabel = `${count} ${count === 1 ? t("recipeFound") : t("recipesFound")}`

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-10">

      {/* Header */}
      <div className="pt-6 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-white mb-3">
          {t("exploreHeading")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-hunter-green to-yellow-green">
            {t("exploreFlavors")}
          </span>
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-lg max-w-xl">
          {t("exploreSub")}
        </p>
      </div>

      {/* Search + Language Filters */}
      <div className="space-y-6">
        <SearchBar />

        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => setFilterLang(lang.code)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                filterLang === lang.code
                  ? "bg-hunter-green text-white border-hunter-green shadow-lg shadow-hunter-green/20"
                  : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-sage-green dark:hover:border-hunter-green"
              }`}
            >
              <span className="mr-1.5">{lang.emoji}</span>{lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <section className="pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-80 rounded-[24px] bg-stone-100 dark:bg-stone-800 animate-pulse"></div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-24 glass-card rounded-3xl animate-fade-in">
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">{t("noRecipesFound")}</h3>
            <p className="text-stone-500">{t("noRecipesFoundSub")}</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            <p className="text-sm text-stone-400 mb-6 font-medium">{countLabel}</p>
            <RecipeGrid recipes={recipes} />
          </div>
        )}
      </section>
    </div>
  )
}

// Skeleton shown by Suspense while the URL search params are being read
function ExploreSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 space-y-10">
      <div className="pt-6">
        <div className="h-12 w-72 bg-stone-200 dark:bg-stone-700 rounded-xl animate-pulse mb-3" />
        <div className="h-5 w-96 bg-stone-100 dark:bg-stone-800 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
          <div key={n} className="h-80 rounded-[24px] bg-stone-100 dark:bg-stone-800 animate-pulse" />
        ))}
      </div>
    </div>
  )
}

// Default export wraps ExploreContent in Suspense so Next.js can statically
// prerender this page without hitting the useSearchParams() restriction.
export default function ExplorePage() {
  return (
    <Suspense fallback={<ExploreSkeleton />}>
      <ExploreContent />
    </Suspense>
  )
}
