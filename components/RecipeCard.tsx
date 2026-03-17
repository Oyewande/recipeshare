"use client"

import Link from "next/link"
import Image from "next/image"
import { Recipe } from "@/types/recipe"
import { useUI } from "@/lib/useUI"

// Tiny warm-grey SVG used as a blur-up placeholder while the real image loads.
// Using a data URL keeps it self-contained (no extra network request).
const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNlN2U1ZTQiLz48L3N2Zz4="

interface Props {
  recipe: Recipe
  /** Pass true for the first few cards so they are not lazy-loaded */
  priority?: boolean
}

export default function RecipeCard({ recipe, priority = false }: Props) {
  const { t } = useUI()

  // Guard against empty-string image_url (falsy check alone misses "")
  const imageSrc = recipe.image_url?.trim() || "/food-placeholder.svg"

  return (
    <Link href={`/recipe/${recipe.id}`} className="group block">
      <div className="glass-card rounded-[24px] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-hunter-green/20 active:scale-[0.98] border border-stone-200/50 dark:border-white/10 relative">

        <div className="relative h-60 overflow-hidden bg-stone-100 dark:bg-stone-800">
          <Image
            src={imageSrc}
            alt={recipe.title}
            fill
            // Accurate breakpoints for the 1 → 2 → 3 → 4 column grid layout used
            // on the explore page so Next.js downloads the right-sized variant.
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            // Show a blurred placeholder while the real image streams in.
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            // Above-the-fold cards are pre-loaded; the rest are lazy.
            priority={priority}
          />
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1">
            <span>🌎</span>
            <span className="text-stone-800 dark:text-stone-200">{recipe.country}</span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-bold text-xl text-stone-900 dark:text-white line-clamp-1 mb-2 group-hover:text-hunter-green transition-colors">
            {recipe.title}
          </h3>

          <div className="flex items-center justify-between text-sm text-stone-500 dark:text-stone-400">
            <div className="flex items-center gap-1.5 font-medium px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded-md">
              <span className="text-hunter-green">A</span>
              {/* null-safe: original_language may be absent on legacy rows */}
              {(recipe.original_language || "en").toUpperCase()}
            </div>

            <button className="text-hunter-green font-semibold group-hover:px-2 transition-all duration-300 bg-vanilla-cream dark:bg-orange-950/30 px-3 py-1.5 rounded-full text-xs">
              {t("recipeCardView")} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>

      </div>
    </Link>
  )
}
