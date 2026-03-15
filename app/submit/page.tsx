"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/lib/languageContext"
import Link from "next/link"

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe", "Other"
]

export default function SubmitPage() {
  const { language } = useLanguage()
  const [title, setTitle] = useState("")
  const [country, setCountry] = useState("")
  const [ingredients, setIngredients] = useState("")
  const [instructions, setInstructions] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImage(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !ingredients || !instructions) {
      setError("Please fill in all required fields.")
      return
    }

    setLoading(true)
    setError("")

    try {
      let imageUrl = ""
      if (image) {
        const fileName = `recipes/${Date.now()}-${image.name}`
        const { data: storageData, error: storageError } = await supabase.storage
          .from("recipe-images")
          .upload(fileName, image)

        if (storageError) throw storageError
        imageUrl = supabase.storage.from("recipe-images").getPublicUrl(fileName).data.publicUrl
      }

      const { data: recipeData, error: recipeError } = await supabase
        .from("Recipes")
        .insert({
          title: title,
          ingredients: ingredients,
          instructions: instructions,
          country: country || "Unknown",
          original_language: language,
          image_url: imageUrl,
        })
        .select()

      if (recipeError) throw recipeError

      const recipeId = recipeData![0].id

      await supabase.from("Recipe Translations").insert({
        recipe_id: recipeId,
        language,
        title,
        ingredients,
        instructions: instructions,
      })

      setSuccess(true)
      setTitle("")
      setCountry("")
      setIngredients("")
      setInstructions("")
      setImage(null)
      setImagePreview(null)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-32 animate-fade-in">
        <div className="glass-card rounded-[32px] p-12">
          <span className="text-6xl block mb-6">🎉</span>
          <h2 className="text-3xl font-bold text-stone-900 dark:text-white mb-3">Recipe Submitted!</h2>
          <p className="text-stone-500 dark:text-stone-400 mb-8">
            Your recipe has been added to FlavorBridge. Thank you for sharing your flavors!
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setSuccess(false)}
              className="bg-hunter-green text-white px-6 py-3 rounded-full font-semibold hover:bg-hunter-green transition-all shadow-lg shadow-hunter-green/20"
            >
              Submit Another
            </button>
            <Link href="/explore" className="px-6 py-3 rounded-full font-semibold border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all">
              Explore Recipes
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-slide-up">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-white mb-3">
          Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-hunter-green to-yellow-green">Recipe</span>
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-lg">
          Add your favorite dish from any culture. We'll translate it for the world!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-[32px] p-8 sm:p-10 space-y-8">

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-5 py-4 rounded-2xl text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            Recipe Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Grandma's Jollof Rice"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-5 py-4 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-hunter-green/30 focus:border-hunter-green transition-all text-lg font-medium"
          />
        </div>

        {/* Country */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            Country of Origin
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-5 py-4 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-hunter-green/30 focus:border-hunter-green transition-all"
          >
            <option value="">Select a country...</option>
            {COUNTRIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Ingredients */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            Ingredients <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-stone-400">List each ingredient on a new line</p>
          <textarea
            placeholder={"2 cups rice\n1 can tomatoes\n1 onion, diced\n..."}
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            rows={6}
            className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-5 py-4 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-hunter-green/30 focus:border-hunter-green transition-all leading-relaxed resize-none"
          />
        </div>

        {/* Steps */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            Instructions <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-stone-400">Write each step on a new line</p>
          <textarea
            placeholder={"Wash and parboil the rice for 10 minutes\nBlend the tomatoes with peppers\nFry onions in oil until golden\n..."}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={8}
            className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-5 py-4 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-hunter-green/30 focus:border-hunter-green transition-all leading-relaxed resize-none"
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            Photo
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-48 bg-stone-50 dark:bg-stone-800 border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-2xl cursor-pointer hover:border-hunter-green hover:bg-vanilla-cream/50 dark:hover:bg-orange-950/20 transition-all group"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-2xl" />
              ) : (
                <>
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📷</span>
                  <span className="text-sm text-stone-500 font-medium">Click to upload a photo of your dish</span>
                  <span className="text-xs text-stone-400 mt-1">PNG, JPG up to 5MB</span>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-hunter-green to-yellow-green text-white py-4 rounded-2xl font-bold text-lg hover:from-hunter-green hover:to-yellow-green transition-all shadow-lg shadow-hunter-green/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              Submitting...
            </span>
          ) : (
            "🚀 Submit Recipe"
          )}
        </button>
      </form>
    </div>
  )
}