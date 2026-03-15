import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function run() {
  const { data: recipes, error: re } = await supabase.from('Recipes').select('*')
  const { data: translations, error: te } = await supabase.from('Recipe Translations').select('*')
  
  console.log("Recipes:", recipes?.length, re)
  console.log("Translations:", translations?.length, te)
  
  if (recipes && recipes.length > 0) {
     console.log("Recipes[0] keys:", Object.keys(recipes[0]))
  }
  if (translations && translations.length > 0) {
     console.log("Translations[0] keys:", Object.keys(translations[0]))
  }
}
run()
