"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { Recipe } from "@/types/recipe"
import IngredientSubstitute from "@/components/IngredientSubstitute"
import CommentSection from "@/components/CommentSection"
import { useLanguage } from "@/lib/languageContext"
import { useUI } from "@/lib/useUI"

export default function RecipeDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const { t } = useUI()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)        // true only on first load (no data yet)
  const [translating, setTranslating] = useState(false) // true while re-translating with data visible

  useEffect(() => {
    const fetchRecipe = async () => {
      // Only show full-page spinner when we have no recipe data at all
      if (!recipe) {
        setLoading(true)
      } else {
        setTranslating(true)
      }

      // Fetch base recipe
      const { data: baseRecipe, error: baseError } = await supabase
        .from("Recipes")
        .select("*")
        .eq("id", id)
        .single()

      if (!baseRecipe || baseError) {
        setRecipe(null)
        setLoading(false)
        setTranslating(false)
        return
      }

      // On initial load, immediately show the base recipe in its original language
      // so the user sees content right away while translations load
      if (!recipe) {
        setRecipe(baseRecipe as Recipe)
        setLoading(false)
      }

      // Fetch all translations for this recipe
      const { data: translations } = await supabase
        .from("Recipe Translations")
        .select("*")
        .eq("recipe_id", id)

      const translation = (translations || []).find((t: any) => t.language === language)

      if (translation) {
        // Translation found for requested language
        setRecipe({
          ...baseRecipe,
          title: translation.title || baseRecipe.title,
          ingredients: translation.ingredients || baseRecipe.ingredients,
          instructions: translation.instructions || baseRecipe.instructions,
        } as Recipe)
      } else {
        // Apply fallback logic + dynamic translation
        let fallback = (translations && translations.length > 0) ? translations[0] : null
        const sourceTitle = fallback ? fallback.title : baseRecipe.title
        const sourceIngredients = fallback ? fallback.ingredients : baseRecipe.ingredients
        const sourceInstructions = fallback ? fallback.instructions : baseRecipe.instructions

        if (language !== "all" && language !== baseRecipe.original_language) {
          try {
            const headers = { "Content-Type": "application/json" }
            const [titleObj, ingredientsObj, stepsObj] = await Promise.all([
              fetch("/api/translate", { method: "POST", headers, body: JSON.stringify({ text: sourceTitle, targetLanguage: language }) }).then(r => r.json()),
              fetch("/api/translate", { method: "POST", headers, body: JSON.stringify({ text: typeof sourceIngredients === 'string' ? sourceIngredients : JSON.stringify(sourceIngredients), targetLanguage: language }) }).then(r => r.json()),
              fetch("/api/translate", { method: "POST", headers, body: JSON.stringify({ text: typeof sourceInstructions === 'string' ? sourceInstructions : JSON.stringify(sourceInstructions), targetLanguage: language }) }).then(r => r.json())
            ])

            const translatedData = {
              title: titleObj.translated || sourceTitle,
              ingredients: ingredientsObj.translated || sourceIngredients,
              instructions: stepsObj.translated || sourceInstructions,
            }

            setRecipe({
              ...baseRecipe,
              ...translatedData,
            } as Recipe)

            if (titleObj.source === "lingo.dev") {
              supabase.from("Recipe Translations").insert({
                recipe_id: id,
                language: language,
                title: translatedData.title,
                ingredients: typeof translatedData.ingredients === "string" ? translatedData.ingredients : JSON.stringify(translatedData.ingredients),
                instructions: typeof translatedData.instructions === "string" ? translatedData.instructions : JSON.stringify(translatedData.instructions),
              }).then(({ error }) => {
                if (error) console.error("Error caching translation:", error)
              })
            }
          } catch (e) {
            setRecipe({
              ...baseRecipe,
              title: sourceTitle,
              ingredients: sourceIngredients,
              instructions: sourceInstructions,
            } as Recipe)
          }
        } else {
          setRecipe({
            ...baseRecipe,
            title: sourceTitle,
            ingredients: sourceIngredients,
            instructions: sourceInstructions,
          } as Recipe)
        }
      }

      setLoading(false)
      setTranslating(false)
    }

    fetchRecipe()
  }, [id, language])

  const [substitutions, setSubstitutions] = useState<any[]>([])
  const [subsLoading, setSubsLoading] = useState(false)

  useEffect(() => {
    if (!recipe || !recipe.ingredients) return
    // Avoid re-fetching if we already have results
    if (substitutions.length > 0) return

    const fetchAI = async () => {
      setSubsLoading(true)
      try {
        const ingredientsStr = typeof recipe.ingredients === 'string' ? recipe.ingredients : JSON.stringify(recipe.ingredients)
        const userRegion = typeof navigator !== 'undefined' ? navigator.language : "Global"

        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredientsText: ingredientsStr, userRegion })
        })
        const result = await res.json()
        if (result.recommendations) {
          setSubstitutions(result.recommendations)
        }
      } catch (err) {
        console.error("AI Fetch Error", err)
      }
      setSubsLoading(false)
    }

    fetchAI()
  }, [recipe])

  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hunter-green"></div>
    </div>
  )

  if (!recipe) return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
      <span className="text-4xl mb-4">🍽️</span>
      <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">{t("recipeNotFound")}</h2>
      <p className="text-stone-500 mb-6">{t("recipeNotFoundSub")}</p>
      <button onClick={() => router.back()} className="text-hunter-green font-medium hover:underline">
        {t("goBack")}
      </button>
    </div>
  )

  // Parse ingredients/steps to arrays if they are strings
  let ingredientsList: string[] = []
  try {
    ingredientsList = Array.isArray(recipe.ingredients)
      ? recipe.ingredients
      : JSON.parse(recipe.ingredients)
  } catch (e) {
    ingredientsList = typeof recipe.ingredients === 'string' ? recipe.ingredients.split('\n') : []
  }

  let stepsList: string[] = []
  try {
    stepsList = Array.isArray(recipe.instructions)
      ? recipe.instructions
      : JSON.parse(recipe.instructions)
  } catch (e) {
    stepsList = typeof recipe.instructions === 'string' ? recipe.instructions.split('\n') : []
  }



  return (
    <div className="max-w-4xl mx-auto animate-fade-in relative z-10 pt-4">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-stone-500 hover:text-hunter-green transition-colors bg-white/50 dark:bg-stone-800/50 px-4 py-2 rounded-full border border-stone-200 dark:border-stone-700 w-fit backdrop-blur-sm shadow-sm"
        >
          <span>←</span> {t("backToRecipes")}
        </button>

        <div className="flex items-center gap-2">
          {/* Translating indicator */}
          {translating && (
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-full text-xs font-semibold border border-amber-200 dark:border-amber-800 animate-pulse">
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Translating…
            </div>
          )}

          <div className="flex items-center gap-3 bg-white/50 dark:bg-stone-800/50 px-4 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 backdrop-blur-sm shadow-sm">
            <span className="text-sm font-semibold text-stone-600 dark:text-stone-300 hidden sm:inline-block">{t("translateTo")}</span>
            <select
              className="bg-transparent border-none focus:outline-none text-hunter-green font-bold cursor-pointer"
              value={language}
              onChange={(e) => {
                const lang = e.target.value;
                setLanguage(lang);
              }}
            >
              <optgroup label="Popular">
                <option value="en">🇬🇧 English</option>
                <option value="es">🇪🇸 Spanish</option>
                <option value="fr">🇫🇷 French</option>
                <option value="de">🇩🇪 German</option>
                <option value="it">🇮🇹 Italian</option>
                <option value="pt">🇧🇷 Portuguese</option>
                <option value="zh">🇨🇳 Chinese</option>
                <option value="ja">🇯🇵 Japanese</option>
              </optgroup>
              <optgroup label="More">
                <option value="hi">🇮🇳 Hindi</option>
                <option value="ar">🇸🇦 Arabic</option>
                <option value="ko">🇰🇷 Korean</option>
                <option value="ru">🇷🇺 Russian</option>
                <option value="nl">🇳🇱 Dutch</option>
                <option value="tr">🇹🇷 Turkish</option>
              </optgroup>
              <optgroup label="African">
                <option value="yo">🇳🇬 Yoruba</option>
                <option value="sw">🇰🇪 Swahili</option>
                <option value="ha">🇳🇬 Hausa</option>
                <option value="am">🇪🇹 Amharic</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      <div className={`glass-card rounded-[32px] overflow-hidden transition-opacity duration-300 ${translating ? 'opacity-60' : 'opacity-100'}`}>
        {/* Header Section */}
        <div className="relative h-72 sm:h-96 md:h-[450px]">
          <Image
            src={recipe.image_url || "/food-placeholder.svg"}
            alt={recipe.title}
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/40 to-transparent"></div>

          <div className="absolute bottom-0 left-0 p-6 sm:p-10 w-full">
            <div className="flex gap-3 mb-4 flex-wrap">
              <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-sm">
                <span>🌎</span> {recipe.country}
              </span>
              <span className="bg-hunter-green/80 backdrop-blur-md border border-sage-green/30 text-white px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                {t("origLabel")} {recipe.original_language}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
              {recipe.title}
            </h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-10 bg-white dark:bg-stone-900">
          <div className="grid md:grid-cols-[1fr_2fr] gap-10 lg:gap-14">

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="text-hunter-green">🛒</span>
                  {t("ingredientsHeading")}
                </h2>
                <ul className="space-y-3">
                  {ingredientsList.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 bg-stone-50 dark:bg-stone-800/50 p-3 rounded-xl border border-stone-100 dark:border-stone-800">
                      <span className="text-hunter-green mt-0.5 font-bold">•</span>
                      <span className="text-stone-700 dark:text-stone-300 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="text-hunter-green">🧑‍🍳</span>
                  {t("instructionsHeading")}
                </h2>
                <ol className="space-y-6">
                  {stepsList.map((step, index) => (
                    <li key={index} className="flex gap-4 group">
                      <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-vanilla-cream dark:bg-orange-900/30 text-hunter-green dark:text-sage-green font-bold text-sm transition-colors group-hover:bg-hunter-green group-hover:text-white">
                        {index + 1}
                      </span>
                      <p className="text-stone-700 dark:text-stone-300 leading-relaxed pt-1">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      {subsLoading ? (
        <div className="py-8 text-center text-stone-500 animate-pulse">{t("aiLoading")}</div>
      ) : (
        <IngredientSubstitute substitutes={substitutions} />
      )}
      <CommentSection recipeId={id as string} language={language} />
    </div>
  )
}