import OpenAI from "openai";
import dotenv from "dotenv";
import { ExtractedReport } from "./types";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const promptPrefix = `
Extract structured JSON in the following format:

interface ExtractedReport {
  summary: {
    totalGoals: number;
    totalBMPs: number;
    completionRate: number;
  };
  goals: Goal[];
  bmps: BMP[];
  implementation: ImplementationActivity[];
  monitoring: MonitoringMetric[];
  outreach: OutreachActivity[];
  geographicAreas: GeographicArea[];
}

PDF TEXT:
`;

export async function extractStructuredData(
  text: string
): Promise<ExtractedReport | { error: string }> {
  const prompt = `${promptPrefix}\n\n${text.slice(0, 8000)}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0,
    });

    const content = response.choices[0].message?.content || "";

    try {
      return JSON.parse(content) as ExtractedReport;
    } catch (error) {
      console.error("Failed to parse JSON from OpenAI response:", error);
      return { error: "Invalid JSON returned by OpenAI." };
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    return { error: "Failed to generate completion from OpenAI." };
  }
}
