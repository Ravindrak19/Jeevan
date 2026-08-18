import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { parentName, childAge, primaryConcern, notes } = await req.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const prompt = `You are a clinical CRM triage AI at Jeevan Wings Child Development Centre Noida.
Evaluate this parent lead:
- Parent: ${parentName}
- Child Age: ${childAge}
- Primary Concern: "${primaryConcern}"
- Extra Notes: "${notes || "None"}"

Assess:
1. score: "Hot" (critical early window under 3 yrs OR severe developmental red flags like loss of speech/no eye contact), "Warm" (moderate speech delay/sensory/academic difficulty), or "Cold" (general query).
2. reasoning: Short 2-sentence explanation of the score.
3. recommendedAction: Suggested immediate next step for the Jeevan Wings intake team (e.g., "Schedule priority 45-min diagnostic assessment with Speech & OT team within 24 hours").`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            recommendedAction: { type: Type.STRING },
          },
          required: ["score", "reasoning", "recommendedAction"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return NextResponse.json({ success: true, leadAnalysis: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to score lead", details: error?.message },
      { status: 500 }
    );
  }
}
