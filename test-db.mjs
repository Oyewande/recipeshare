import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function run() {
  const { data, error } = await supabase.from("Recipe Translations").select("*")
  console.log("Translations:", data, error)
  const r = await supabase.from("Recipes").select("*")
  console.log("Recipes:", r.data, r.error)
}
run()
