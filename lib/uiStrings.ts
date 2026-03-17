// All static UI strings in English.
// The useUI() hook translates these automatically when the active language changes.
// "FlavorBridge" is intentionally omitted — the brand name is never translated.

export const UI_STRINGS = {
  // ── Navbar ──
  navExplore: "Explore",
  navSubmit: "Submit",
  navMap: "Map",

  // ── Home — Hero ──
  heroLive: "FlavorBridge is Live",
  heroHeadline: "Taste the world,",
  heroHeadline2: "one recipe at a time.",
  heroSubtext:
    "Discover authentic dishes from around the globe, seamlessly translated into your language. Share your culture's flavors with the world.",
  heroPopular: "Popular:",
  heroTag1: "Pasta",
  heroTag2: "Jollof",
  heroTag3: "Curry",
  heroTag4: "Tacos",

  // ── Home — Featured ──
  editorsPicks: "Editor's Picks",
  editorsPicksSub: "Hand-selected culinary masterpieces",
  viewAll: "View all",

  // ── Home — No recipes ──
  noRecipesYet: "No recipes yet",
  noRecipesYetSub: "Be the first to share a global flavor!",
  submitRecipeBtn: "Submit a Recipe",

  // ── Home — Travel by Taste ──
  travelByTaste: "Travel by Taste",

  // ── Explore page ──
  exploreHeading: "Explore",
  exploreFlavors: "Flavors",
  exploreSub: "Browse recipes from kitchens across every continent, all translated for you.",
  filterAll: "All",
  filterEnglish: "English",
  filterSpanish: "Spanish",
  filterFrench: "French",
  filterGerman: "German",
  noRecipesFound: "No recipes found",
  noRecipesFoundSub: "Try changing the language filter or search for something else.",
  recipesFound: "recipes found",
  recipeFound: "recipe found",

  // ── Submit page ──
  shareYour: "Share Your",
  shareRecipeWord: "Recipe",
  shareSub: "Add your favorite dish from any culture. We'll translate it for the world!",
  fieldTitle: "Recipe Title",
  fieldCountry: "Country of Origin",
  fieldCountryPlaceholder: "Select a country...",
  fieldIngredients: "Ingredients",
  fieldIngredientsSub: "List each ingredient on a new line",
  fieldInstructions: "Instructions",
  fieldInstructionsSub: "Write each step on a new line",
  fieldPhoto: "Photo",
  fieldPhotoSub: "Click to upload a photo of your dish",
  fieldPhotoHint: "PNG, JPG up to 5MB",
  submitBtn: "Submit Recipe",
  submittingBtn: "Submitting...",
  fillAllFields: "Please fill in all required fields.",
  submitSuccess: "Recipe Submitted!",
  submitSuccessMsg:
    "Your recipe has been added to FlavorBridge. Thank you for sharing your flavors!",
  submitAnother: "Submit Another",
  exploreRecipes: "Explore Recipes",

  // ── Recipe detail ──
  backToRecipes: "Back to recipes",
  translateTo: "Translate to:",
  ingredientsHeading: "Ingredients",
  instructionsHeading: "Instructions",
  recipeNotFound: "Recipe not found",
  recipeNotFoundSub: "This recipe might have been removed or doesn't exist.",
  goBack: "Go back",
  aiLoading: "✨ AI analyzing ingredients for local substitutions...",
  origLabel: "Orig:",

  // ── Footer ──
  footerTagline:
    "Bridging cultures through cuisine. Discover, share, and translate recipes from around the world.",
  footerQuickLinks: "Quick Links",
  footerExplore: "Explore Recipes",
  footerSubmit: "Submit a Recipe",
  footerMap: "Global Map",
  footerLanguages: "Languages",
  footerBuiltWith: "Built with ❤️ for food lovers everywhere.",

  // ── SearchBar ──
  searchPlaceholder: "Search worldly flavors...",
  searchBtn: "Search",

  // ── Map page ──
  mapTitle: "Global Recipes Map",
  mapSubtitle: "Click on a country to explore recipes from that region!",
  mapDishesFrom: "Dishes from",
  mapNoRecipesFor: "No recipes found for",
  mapNoRecipesYet: "yet.",
  mapBeFirst: "Be the first to add one!",
  mapSelectCountry: "Select a country on the map to see its delicious recipes!",

  // ── Recipe card ──
  recipeCardView: "View",

  // ── Comments ──
  commentsHeading: "Comments",
  commentPlaceholder: "Share your thoughts about this recipe...",
  commentPostBtn: "Post",
  commentPosting: "Posting...",
  commentError: "Failed to post comment. Please try again.",
  commentNoComments: "No comments yet — be the first!",
  commentTranslateBtn: "Translate comment",
} as const

export type UIKey = keyof typeof UI_STRINGS
