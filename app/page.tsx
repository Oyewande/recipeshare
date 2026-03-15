"use client"

import { useEffect, useState } from "react"
import SearchBar from "@/components/SearchBar"
import RecipeGrid from "@/components/RecipeGrid"
import { Recipe } from "@/types/recipe"
import { fetchRecipes } from "@/lib/recipe"
import Link from "next/link"
import { useLanguage } from "@/lib/languageContext"

export default function HomePage() {
  const { language } = useLanguage()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHomeRecipes = async () => {
      setLoading(true)
      try {
        const data = await fetchRecipes(language, 12)
        setRecipes(data)
      } catch (e) {
        console.error("Home recipes failed", e)
      }
      setLoading(false)
    }

    fetchHomeRecipes()
  }, [language])

  return (
    <div className="w-full">
      {/* Decorative background blobs */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-vanilla-cream/60 dark:from-orange-950/20 to-transparent -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-20">

        {/* ── Hero Section ── */}
        <section className="text-center pt-20 pb-12 px-4 animate-slide-up relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vanilla-cream dark:bg-orange-900/40 text-hunter-green dark:text-orange-300 text-sm font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-hunter-green"></span>
            </span>
            FlavorBridge is Live
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-stone-900 dark:text-white mb-6 tracking-tight leading-tight max-w-4xl mx-auto">
            Taste the world, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-hunter-green to-yellow-green">
              one recipe at a time.
            </span>
          </h1>

          <p className="text-stone-500 dark:text-stone-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover authentic dishes from around the globe, seamlessly translated into your language. Share your culture's flavors with the world.
          </p>

          <div className="relative z-20 mb-8">
            <SearchBar />
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-stone-500 font-medium">
            <span>Popular:</span>
            {["Pasta", "Jollof", "Curry", "Tacos"].map(tag => (
              <span key={tag} className="hover:text-hunter-green cursor-pointer transition-colors">{tag}</span>
            ))}
          </div>
        </section>

        {/* ── Featured Recipes ── */}
        <section className="px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-stone-900 dark:text-white mb-2">Editor&apos;s Picks</h2>
              <p className="text-stone-500 dark:text-stone-400">Hand-selected culinary masterpieces</p>
            </div>
            <Link href="/explore" className="text-hunter-green font-semibold hover:text-hunter-green transition flex items-center gap-1 group">
              View all <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-80 rounded-[24px] bg-stone-100 dark:bg-stone-800 animate-pulse"></div>
              ))}
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-3xl">
              <span className="text-5xl mb-4 block">🍳</span>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">No recipes yet</h3>
              <p className="text-stone-500 mb-6">Be the first to share a global flavor!</p>
              <Link href="/submit" className="bg-hunter-green text-white px-6 py-3 rounded-full font-semibold hover:bg-hunter-green transition-all shadow-lg shadow-hunter-green/20">
                Submit a Recipe
              </Link>
            </div>
          ) : (
            <div className="animate-fade-in">
              <RecipeGrid recipes={recipes} />
            </div>
          )}
        </section>

        {/* ── Travel by Taste ── */}
        <section className="px-4 pb-20">
          <h2 className="text-3xl font-bold text-stone-900 dark:text-white mb-8 text-center">Travel by Taste</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { flag: "🇮🇹", name: "Italy", recipes: "1.2k+" },
              { flag: "🇫🇷", name: "France", recipes: "840+" },
              { flag: "🇳🇬", name: "Nigeria", recipes: "920+" },
              { flag: "🇯🇵", name: "Japan", recipes: "1.5k+" }
            ].map((country, idx) => (
              <div key={idx} className="glass-card rounded-[24px] p-6 text-center hover:scale-105 hover:bg-white dark:hover:bg-stone-800 hover:shadow-xl hover:shadow-hunter-green/10 cursor-pointer group transition-all duration-300">
                <span className="text-5xl block mb-4 group-hover:-translate-y-2 transition-transform duration-300">{country.flag}</span>
                <h3 className="font-bold text-lg text-stone-900 dark:text-white">{country.name}</h3>
                <p className="text-sm font-medium mt-2 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 w-fit mx-auto px-3 py-0.5 rounded-full">{country.recipes}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}