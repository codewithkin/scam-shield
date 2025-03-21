import { NextResponse } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Define the expected response schema (without min/max constraints)
const ScamAnalysisSchema = z.object({
  scam_words: z.array(z.string()), // List of detected scam words
  reason: z.string(), // Explanation for the scam detection
  scamPercentage: z.number(), // Probability score (0-100)
  scamScore: z.number(), // Severity score (1-10)
});

export async function POST(req: Request) {
  try {
    // Get message from the request body
    const { message } = await req.json();

    // Validate input
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // AI system prompt to guide response structure
    const systemPrompt = `
      You are ScamShield AI, an expert in detecting scam messages.
      Analyze the given message and return a structured JSON object with:
      - scam_words: an array of words/phrases that indicate a scam
      - reason: a short explanation of why it's a scam
      - scamPercentage: a probability score (0-100)
      - scamScore: a severity score (1-10)
    `;

    // Call OpenAI with response format enforcement
    const completion = await client.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      response_format: zodResponseFormat(ScamAnalysisSchema, "scamAnalysis"),
    });

    // Extract parsed structured response
    const structuredResponse = completion.choices[0].message.parsed;

    return NextResponse.json(structuredResponse);
  } catch (error) {
    console.error("Error analyzing message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
