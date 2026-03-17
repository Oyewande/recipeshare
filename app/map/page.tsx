"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import MapView from "@/components/MapView"
import { useLanguage } from "@/lib/languageContext"
import { useUI } from "@/lib/useUI"
import { fetchRecipesByCountry } from "@/lib/recipe"
import { Recipe } from "@/types/recipe"

export default function MapPage() {
  const { language } = useLanguage()
  const { t } = useUI()
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)

  // useCallback so the function reference is stable for the useEffect dep array
  const handleCountrySelect = useCallback(async (countryName: string) => {
    setSelectedCountry(countryName)
    setLoading(true)
    try {
      const fetchedRecipes = await fetchRecipesByCountry(countryName, language)
      setRecipes(fetchedRecipes)
    } catch (error) {
      console.error("Error fetching recipes for map:", error)
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }, [language])

  // Re-fetch when language changes if a country is already selected
  useEffect(() => {
    if (selectedCountry) {
      handleCountrySelect(selectedCountry)
    }
  }, [language, handleCountrySelect, selectedCountry])

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-hunter-green mb-2">{t("mapTitle")}</h1>
      <p className="text-stone-500 dark:text-stone-400 mb-6">{t("mapSubtitle")}</p>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 bg-white dark:bg-stone-900 shadow-sm overflow-hidden">
          <MapView
            onCountrySelect={handleCountrySelect}
            selectedCountry={selectedCountry}
          />
        </div>

        <div className="w-full lg:w-1/3 flex flex-col min-h-[400px]">
          {selectedCountry ? (
            <div className="bg-vanilla-cream dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 flex-1">
              <h2 className="text-2xl font-semibold text-stone-800 dark:text-white mb-4">
                {t("mapDishesFrom")} <span className="text-hunter-green">{selectedCountry}</span>
              </h2>

              {loading ? (
                <div className="flex flex-col gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-4 bg-white dark:bg-stone-800 p-3 rounded-xl shadow-sm">
                      <div className="w-16 h-16 bg-stone-200 dark:bg-stone-700 rounded-lg"></div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-3/4"></div>
                        <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recipes.length > 0 ? (
                <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
                  {recipes.map(recipe => (
                    <Link
                      key={recipe.id}
                      href={`/recipe/${recipe.id}`}
                      className="flex gap-4 bg-white dark:bg-stone-800 p-3 rounded-xl shadow-sm hover:shadow-md transition-all border border-stone-100 dark:border-stone-700 group"
                    >
                      <div className="w-20 h-20 shrink-0 bg-stone-100 dark:bg-stone-700 rounded-lg overflow-hidden relative">
                        <Image
                          src={recipe.image_url?.trim() || "/food-placeholder.svg"}
                          alt={recipe.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <h3 className="font-bold text-sm text-stone-900 dark:text-white line-clamp-2 group-hover:text-hunter-green transition-colors">
                          {recipe.title}
                        </h3>
                        <span className="text-xs font-semibold text-hunter-green mt-1">
                          {t("recipeCardView")} →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center text-stone-500 bg-white dark:bg-stone-800 rounded-xl border border-dashed border-stone-300 dark:border-stone-600">
                  <span className="text-3xl mb-2">🍽️</span>
                  <p className="text-sm px-4">
                    {t("mapNoRecipesFor")} <strong>{selectedCountry}</strong> {t("mapNoRecipesYet")}
                  </p>
                  <Link href="/submit" className="mt-4 text-hunter-green hover:text-sage-green text-sm font-semibold transition-colors">
                    {t("mapBeFirst")}
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center text-stone-400 border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-2xl p-6">
              <span className="text-4xl mb-4">🌍</span>
              <p className="text-base font-medium">{t("mapSelectCountry")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
