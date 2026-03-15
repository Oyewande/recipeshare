import { detectLanguage } from "@/utils/languageDetect"
import { getSubstituteDictionary, SubstituteOption } from "@/utils/ingredientSubstitute"

export interface SubstituteRecommendation {
  original: string;
  substitute: string;
  reason: string;
  ratio: string;
}

/**
 * Analyzes a list of ingredients and looks for common substitutes globally based on the user's locale.
 */
export function analyzeIngredientsForSubstitutes(ingredientsText: string, userRegion: string = "Global"): SubstituteRecommendation[] {
  const dictionary = getSubstituteDictionary();
  const recommendations: SubstituteRecommendation[] = [];
  
  const textLower = ingredientsText.toLowerCase();

  for (const item of dictionary) {
    // If the original ingredient is mentioned in the text
    if (textLower.includes(item.original.toLowerCase())) {
      // Find the best substitute for the user's region, or fallback to global
      const regionSub = item.substitutes.find((s: SubstituteOption) => s.region.toLowerCase() === userRegion.toLowerCase()) 
                     || item.substitutes.find((s: SubstituteOption) => s.region === "Global")
                     || item.substitutes[0];
                     
      if (regionSub) {
        recommendations.push({
          original: item.original,
          substitute: regionSub.name,
          reason: regionSub.reason,
          ratio: regionSub.ratio,
        });
      }
    }
  }

  return recommendations;
}