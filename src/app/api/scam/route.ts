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
  scam_words: z.array(z.string()).optional(), // List of detected scam words (if applicable)
  reason: z.string().optional(), // Explanation for the scam detection (if applicable)
  scamPercentage: z.number().optional(), // Probability score (if applicable)
  scamScore: z.number().optional(), // Severity score (if applicable)
  response: z.string().optional(), // General response (if the message is NOT a scam)
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
  Analyze the given message and return a structured JSON object:

  1. If the message contains scam indicators (e.g., fraud attempts, phishing, fake offers, impersonation, blackmail, suspicious links, requests for sensitive information, urgent action demands), return:
     - scam_words: an array of words/phrases that indicate a scam
     - reason: a short explanation of why it's a scam
     - scamPercentage: a probability score (0-100)
     - scamScore: a severity score (1-10)

  2. If the message is NOT a scam but is **asking about scam detection**, return:
     - response: a brief, clear answer to the user's question.

  3. If the message is clearly **marketing, promotions, newsletters, or spam**, but NOT a scam, still return a scam analysis with:
     - scam_words: []
     - reason: "This message does not contain scam elements but may be flagged as spam due to its promotional content."
     - scamPercentage: 0
     - scamScore: 0

  Never return both scam analysis and a general response together.
  Always follow these strict conditions and ensure consistency in the output format.
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
