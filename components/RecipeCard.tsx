import Link from "next/link"
import { Recipe } from "@/types/recipe"

interface Props {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: Props) {

  return (
    <Link href={`/recipe/${recipe.id}`} className="group block">
      <div className="glass-card rounded-[24px] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-hunter-green/20 active:scale-[0.98] border border-stone-200/50 dark:border-white/10 relative">
        
        {/* Image wrapper with zoom on hover */}
        <div className="relative h-60 overflow-hidden bg-stone-100 dark:bg-stone-800">
          <img
            src={recipe.image_url || "/food-placeholder.svg"}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Top-right floating badge */}
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
              {recipe.original_language.toUpperCase()}
            </div>
            
            <button className="text-hunter-green font-semibold group-hover:px-2 transition-all duration-300 bg-vanilla-cream dark:bg-orange-950/30 px-3 py-1.5 rounded-full text-xs">
              View <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>

      </div>
    </Link>
  )
}