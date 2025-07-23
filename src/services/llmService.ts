import OpenAI from "openai";
import dotenv from "dotenv";
import { ExtractedReport } from "../utils/types";
import { systemPrompt, userPrompt } from "../utils/constants";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function ensureExtractedReportShape(obj: any): ExtractedReport {
  const out: ExtractedReport = {
    summary: {
      totalGoals: safeNumber(obj?.summary?.totalGoals),
      totalBMPs: safeNumber(obj?.summary?.totalBMPs),
      completionRate: safeNumber(obj?.summary?.completionRate),
    },
    goals: Array.isArray(obj?.goals) ? obj.goals : [],
    bmps: Array.isArray(obj?.bmps) ? obj.bmps : [],
    implementation: Array.isArray(obj?.implementation)
      ? obj.implementation
      : [],
    monitoring: Array.isArray(obj?.monitoring) ? obj.monitoring : [],
    outreach: Array.isArray(obj?.outreach) ? obj.outreach : [],
    geographicAreas: Array.isArray(obj?.geographicAreas)
      ? obj.geographicAreas
      : [],
  };
  return out;
}

function safeNumber(v: any): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function emptyExtractedReport(): ExtractedReport {
  return {
    summary: { totalGoals: 0, totalBMPs: 0, completionRate: 0 },
    goals: [],
    bmps: [],
    implementation: [],
    monitoring: [],
    outreach: [],
    geographicAreas: [],
  };
}

export async function extractStructuredData(
  text: string
): Promise<ExtractedReport> {
  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `${userPrompt}${text}` },
    ],
  });

  const content = resp.choices[0].message?.content || "{}";

  try {
    const parsed = JSON.parse(content);
    return ensureExtractedReportShape(parsed);
  } catch (err) {
    console.warn("Failed to parse LLM JSON. Returning minimal structure.", err);
    return emptyExtractedReport();
  }
}
