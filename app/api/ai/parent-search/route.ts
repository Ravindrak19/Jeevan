import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { query, childAge } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query string is required" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const prompt = `You are a world-class senior pediatric clinical consultant at "Jeevan Wings Speech Therapy & Child Development Center" in Noida Sector 75 led by Founder & Speech Therapist Kajal Kavita. 
A concerned parent has described their child's behavior or communication concern:
- Child's Age: ${childAge || "Not specified"}
- Parent's Observation: "${query}"

Analyze this observation through a pediatric speech-language, occupational, sensory, and behavioral clinical lens.
Return a structured JSON object with the following fields:
1. possibleCondition: Name of the potential condition or developmental milestone mismatch (e.g. "Speech & Articulation Disorder", "Sensory Processing Difference", "Stammering / Fluency Impairment", "Autism Spectrum Marker", "Inattention / ADHD").
2. clinicalExplanation: A warm, empathetic, parent-friendly clinical explanation (3-4 sentences) that provides reassurance while explaining what might be happening developmentally.
3. keyRedFlags: Array of 3-4 specific warning signs parents should watch for.
4. recommendedTherapy: Primary Jeevan Wings therapy program recommended (e.g. "Pediatric Speech & Language Therapy", "Occupational Therapy & Sensory Integration", "Autism Early Intervention", "Special Education").
5. homeActionPlan: Array of 3 practical, actionable tips the parent can start doing at home today.
6. urgencyLevel: "High - Early Evaluation Advised", "Moderate - Clinical Assessment Suggested", or "Informational - Monitor & Guide".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            possibleCondition: { type: Type.STRING },
            clinicalExplanation: { type: Type.STRING },
            keyRedFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            recommendedTherapy: { type: Type.STRING },
            homeActionPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            urgencyLevel: { type: Type.STRING },
          },
          required: [
            "possibleCondition",
            "clinicalExplanation",
            "keyRedFlags",
            "recommendedTherapy",
            "homeActionPlan",
            "urgencyLevel",
          ],
        },
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);

    return NextResponse.json({ success: true, result: data });
  } catch (error: any) {
    console.error("AI Parent Search Error:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze parent query",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
