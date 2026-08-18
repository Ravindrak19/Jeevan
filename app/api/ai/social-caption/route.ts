import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { title, excerpt, platform } = await req.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const prompt = `You are a social media marketing expert for Jeevan Wings Child Development Centre Noida.
Generate a social media post based on this article:
Title: "${title}"
Summary: "${excerpt}"
Platform: "${platform || "Instagram"}"

Provide:
1. caption: Engaging, empathetic post copy with emojis and clear CTA to book an evaluation at Jeevan Wings Noida Sector 75.
2. hashtags: Array of 8 top trending local and medical hashtags (e.g., #SpeechTherapyNoida #JeevanWings #ChildDevelopment #NoidaSector75).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: { type: Type.STRING },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["caption", "hashtags"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return NextResponse.json({ success: true, socialPost: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to generate social caption", details: error?.message },
      { status: 500 }
    );
  }
}
