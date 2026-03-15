import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: Request) {
  try {
    const { ingredientsText, userRegion = "Global" } = await request.json()

    if (!ingredientsText) {
      return NextResponse.json(
        { error: "ingredientsText is required" },
        { status: 400 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY || "dummy",
    })
    
    // If no key is set yet, explicitly fall back to dummy response
    if (openai.apiKey === "dummy") {
       return NextResponse.json({
         recommendations: [
           {
             original: "API Key Missing",
             substitute: "Set OPENAI_API_KEY in .env.local",
             reason: "The AI endpoint needs to be configured with a real OpenAI key.",
             ratio: "N/A"
           }
         ]
       })
    }

    const prompt = `
You are an expert culinary AI. The user is located in or prefers the region: "${userRegion}".
Analyze the following ingredients and provide local or common substitute recommendations for any hard-to-find or culturally specific items, tailored specifically for someone in the specified region. 
Return an array of JSON objects with exactly these keys: "original" (the ingredient from the text), "substitute" (the recommended alternative), "reason" (why it works), "ratio" (the substitution ratio).
If no substitutions are needed, return an empty array [].

Ingredients: ${ingredientsText}

Respond ONLY with valid JSON containing the array of objects. Do not include markdown blocks or other text.
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    })

    const resultText = completion.choices[0].message.content || "[]"
    
    let recommendations = []
    try {
      recommendations = JSON.parse(resultText)
    } catch (e) {
      // In case of markdown formatting despite instructions
      const match = resultText.match(/```json\n([\s\S]*?)\n```/)
      if (match) {
        recommendations = JSON.parse(match[1])
      }
    }

    return NextResponse.json({ recommendations })
  } catch (err: any) {
    console.error("AI Substitute Error:", err)
    return NextResponse.json({ error: err.message || "Failed to generate AI substitutes" }, { status: 500 })
  }
}
