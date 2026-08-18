import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { topic, category, targetKeywords } = await req.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Topic string is required" },
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

    const prompt = `You are an expert pediatric medical writer & SEO strategist at "Jeevan Wings Speech Therapy & Child Development Center" in Noida Sector 75 led by Founder & Speech Therapist Kajal Kavita.
Write a comprehensive, clinical yet accessible blog post for parents on:
Topic: "${topic}"
Category: "${category || "Child Development"}"
Target Keywords: "${targetKeywords || "Speech Therapy Noida, Child Development Sector 75"}"

Generate a JSON object with:
1. title: Catchy, authoritative headline.
2. excerpt: Engaging 2-sentence summary.
3. content: Markdown formatted full article with h3 headings, bullet points, clinical facts, and local Noida Jeevan Wings references.
4. tags: Array of 4 relevant tags.
5. seoMetaTitle: 60 character SEO page title.
6. seoMetaDescription: 155 character meta description including "Noida Sector 75" and key therapy terms.
7. readTime: e.g. "4 Min Read"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            excerpt: { type: Type.STRING },
            content: { type: Type.STRING },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            seoMetaTitle: { type: Type.STRING },
            seoMetaDescription: { type: Type.STRING },
            readTime: { type: Type.STRING },
          },
          required: [
            "title",
            "excerpt",
            "content",
            "tags",
            "seoMetaTitle",
            "seoMetaDescription",
            "readTime",
          ],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return NextResponse.json({ success: true, blog: data });
  } catch (error: any) {
    console.error("AI Blog Writer Error:", error);
    return NextResponse.json(
      { error: "Failed to generate blog", details: error?.message },
      { status: 500 }
    );
  }
}
