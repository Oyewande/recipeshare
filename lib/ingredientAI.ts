import { detectLanguage } from "@/utils/languageDetect"
import { getSubstituteDictionary, SubstituteOption } from "@/utils/ingredientSubstitute"

export interface SubstituteRecommendation {
  original: string;
  substitute: string;
  reason: string;
  ratio: string;
}

export function analyzeIngredientsForSubstitutes(ingredientsText: string, userRegion: string = "Global"): SubstituteRecommendation[] {
  const dictionary = getSubstituteDictionary();
  const recommendations: SubstituteRecommendation[] = [];
  
  const textLower = ingredientsText.toLowerCase();

  for (const item of dictionary) {
    if (textLower.includes(item.original.toLowerCase())) {
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