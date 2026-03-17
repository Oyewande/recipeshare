import { Recipe } from "@/types/recipe"
import RecipeCard from "./RecipeCard"

interface Props {
  recipes: Recipe[]
}

export default function RecipeGrid({ recipes }: Props) {

  return (
    // xl:grid-cols-4 matches the sizes prop in RecipeCard ("25vw" on wide screens)
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

      {recipes.map((recipe, index) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          // Pre-load the first row of cards (above the fold on most viewports)
          priority={index < 4}
        />
      ))}

    </div>

  )
}