export interface SubstituteOption {
  name: string;
  region: string;
  ratio: string;
  reason: string;
}

export interface IngredientSubTarget {
  original: string;
  substitutes: SubstituteOption[];
}

export function getSubstituteDictionary(): IngredientSubTarget[] {
  return [
    {
      original: "Dashi",
      substitutes: [
        { name: "Chicken Broth", region: "Global", ratio: "1:1", reason: "Similar umami depth, though less oceanic." },
        { name: "Vegetable Broth with Soy Sauce", region: "Global", ratio: "1:1 config", reason: "Adds savory notes for vegetarian options." }
      ]
    },
    {
      original: "Palm Oil",
      substitutes: [
        { name: "Vegetable Oil with Annatto", region: "Western", ratio: "1:1", reason: "Mimics the reddish color and slight earthy flavor." },
        { name: "Peanut Oil", region: "Global", ratio: "1:1", reason: "Similar high smoke-point and slightly nutty profile." }
      ]
    },
    {
      original: "Ghee",
      substitutes: [
        { name: "Clarified Butter", region: "Global", ratio: "1:1", reason: "Almost identical functionally as milk solids are removed." },
        { name: "Coconut Oil", region: "Global", ratio: "1:1", reason: "Good vegan alternative with similar fat content." }
      ]
    },
    {
      original: "Mirin",
      substitutes: [
        { name: "Dry Sherry with Sugar", region: "Western", ratio: "1 tbsp sherry + 1/2 tsp sugar for 1 tbsp mirin", reason: "Provides similar sweet, complex alcohol notes." },
        { name: "White Wine Vinegar + Sugar", region: "Global", ratio: "1 tbsp vinegar + 1/2 tsp sugar", reason: "Adds the acidity and sweetness needed." }
      ]
    },
    {
      original: "Scotch Bonnet Pepper",
      substitutes: [
        { name: "Habanero Pepper", region: "Global", ratio: "1:1", reason: "Nearly identical heat level and fruity flavor." },
        { name: "Jalapeño (for less heat)", region: "Western", ratio: "2-3 jalapeños for 1 scotch bonnet", reason: "Much milder, but adds fresh pepper flavor." }
      ]
    }
  ];
}