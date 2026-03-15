"use client"

import { useState, useEffect } from "react"
import MapView from "@/components/MapView"
import RecipeGrid from "@/components/RecipeGrid"
import { useLanguage } from "@/lib/languageContext"
import { fetchRecipesByCountry } from "@/lib/recipe"
import { Recipe } from "@/types/recipe"

export default function MapPage() {
  const { language } = useLanguage()
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)

  const handleCountrySelect = async (countryName: string) => {
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
  }

  // Refetch when language changes if a country is already selected
  useEffect(() => {
    if (selectedCountry) {
      handleCountrySelect(selectedCountry)
    }
  }, [language])

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-hunter-green mb-6">Global Recipes Map</h1>
      <p className="text-gray-600 mb-6">
        Click on a country to explore recipes from that region!
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3 border rounded-lg p-4 bg-white shadow-sm overflow-hidden">
          <MapView 
            onCountrySelect={handleCountrySelect} 
            selectedCountry={selectedCountry} 
          />
        </div>

        <div className="w-full lg:w-1/3 flex flex-col min-h-[400px]">
          {selectedCountry ? (
            <div className="bg-vanilla-cream rounded-lg p-6 border border-vanilla-cream flex-1">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>Dishes from {selectedCountry}</span>
              </h2>
              
              {loading ? (
                <div className="flex flex-col gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-4 bg-white p-3 rounded-md shadow-sm">
                      <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recipes.length > 0 ? (
                <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {recipes.map(recipe => (
                    <a key={recipe.id} href={`/recipe/${recipe.id}`} className="flex gap-4 bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
                      <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-md overflow-hidden relative">
                        {recipe.image_url ? (
                          <img src={recipe.image_url} alt={recipe.title} className="object-cover w-full h-full" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-gray-400">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="font-medium text-gray-900 line-clamp-2">{recipe.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 capitalize">{recipe.country}</p>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                  <span className="text-3xl mb-2">🍽️</span>
                  <p>No recipes found for <strong>{selectedCountry}</strong> yet.</p>
                  <a href="/submit" className="mt-4 text-hunter-green hover:text-hunter-green text-sm font-medium">Be the first to add one!</a>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg p-6">
              <span className="text-4xl mb-4">🌍</span>
              <p className="text-lg">Select a country on the map to see its delicious recipes!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}