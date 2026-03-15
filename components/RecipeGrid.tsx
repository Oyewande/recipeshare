import { Recipe } from "@/types/recipe"
import RecipeCard from "./RecipeCard"

interface Props {
  recipes: Recipe[]
}

export default function RecipeGrid({ recipes }: Props) {

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}

    </div>

  )
}