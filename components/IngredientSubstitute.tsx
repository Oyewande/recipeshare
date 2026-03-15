import { SubstituteRecommendation } from "@/lib/ingredientAI"

interface Props {
  substitutes: SubstituteRecommendation[]
}

export default function IngredientSubstitute({ substitutes }: Props) {
  if (!substitutes || substitutes.length === 0) return null;

  return (
    <div className="bg-vanilla-cream dark:bg-stone-900 rounded-[20px] p-6 border border-vanilla-cream/50 dark:border-stone-800 relative overflow-hidden my-8">
      {/* Decorative gradient orb */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-sage-green/10 dark:bg-hunter-green/5 rounded-full blur-2xl -mr-16 -mt-16"></div>

      <div className="flex items-center gap-2 mb-5">
        <span className="text-xl">💡</span>
        <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
          Local Alternatives
        </h3>
      </div>

      <ul className="grid sm:grid-cols-2 gap-4 relative z-10">
        {substitutes.map((item, index) => (
          <li key={index} className="bg-white dark:bg-stone-800/80 p-4 rounded-xl shadow-sm border border-stone-100 dark:border-stone-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-stone-800 dark:text-stone-200 line-through decoration-stone-300 dark:decoration-stone-600">
                {item.original}
              </span>
              <span className="text-hunter-green font-bold px-2 py-0.5 bg-vanilla-cream dark:bg-orange-950/50 rounded-md text-sm">
                {item.ratio}
              </span>
            </div>
            
            <div className="font-bold text-hunter-green dark:text-sage-green mb-1">
              ↓ {item.substitute}
            </div>
            
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mt-2">
              {item.reason}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}