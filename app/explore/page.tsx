"use client"

import { useEffect, useState } from "react"
import SearchBar from "@/components/SearchBar"
import RecipeGrid from "@/components/RecipeGrid"
import { Recipe } from "@/types/recipe"
import { fetchRecipes } from "@/lib/recipe"
import { useLanguage } from "@/lib/languageContext"

const LANGUAGES = [
  { code: "all", label: "All", emoji: "🌍" },
  { code: "en",  label: "English", emoji: "🇬🇧" },
  { code: "es",  label: "Spanish", emoji: "🇪🇸" },
  { code: "fr",  label: "French",  emoji: "🇫🇷" },
  { code: "de",  label: "German",  emoji: "🇩🇪" },
]

export default function ExplorePage() {
  const { language } = useLanguage()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [filterLang, setFilterLang] = useState("all")

  useEffect(() => {
    const fetchExploreRecipes = async () => {
      setLoading(true)
      try {
        // Fetch recipes translated to the current user's requested language context
        const data = await fetchRecipes(language, 30)
        
        // Let's filter the array by their native `original_language` if it's not "all"
        if (filterLang !== "all") {
          setRecipes(data.filter(r => r.original_language?.toLowerCase() === filterLang.toLowerCase()))
        } else {
          setRecipes(data)
        }
      } catch (err) {
        console.error(err)
        setRecipes([])
      }
      setLoading(false)
    }

    fetchExploreRecipes()
  }, [filterLang, language])

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-10">

      {/* Header */}
      <div className="pt-6 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-white mb-3">
          Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-hunter-green to-yellow-green">Flavors</span>
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-lg max-w-xl">
          Browse recipes from kitchens across every continent, all translated for you.
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
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">No recipes found</h3>
            <p className="text-stone-500">Try changing the language filter or search for something else.</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            <p className="text-sm text-stone-400 mb-6 font-medium">{recipes.length} recipe{recipes.length !== 1 ? "s" : ""} found</p>
            <RecipeGrid recipes={recipes} />
          </div>
        )}
      </section>
    </div>
  )
}