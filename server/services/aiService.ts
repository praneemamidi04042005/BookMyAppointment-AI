import OpenAI from 'openai';
import { loadEnv } from '../config/env.js';
import type { ParsedParameter } from '../ai/reportParser/reportParser.js';

const env = loadEnv();
const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

export type ReportAnalysisInput = {
  reportType: string;
  extractedText: string;
  extractedParameters: ParsedParameter[];
  abnormalParameters: Array<{ key: string; label: string; value: number | string; unit: string; reason?: string }>;
  specialist: string;
  contextChunks: Array<{ title: string; category: string; content: string }>;
  language?: string;
};

export async function generateReportSummary(input: ReportAnalysisInput) {
  if (!openai) {
    return buildFallbackSummary(input);
  }

  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are a healthcare report interpretation assistant. Never diagnose disease. Never invent values. Return only valid JSON with summary, abnormalParameters, riskCategory, recommendedSpecialist, explanation and disclaimer.',
      },
      {
        role: 'user',
        content: JSON.stringify({
          reportType: input.reportType,
          extractedParameters: input.extractedParameters,
          abnormalParameters: input.abnormalParameters,
          specialist: input.specialist,
          contextChunks: input.contextChunks,
          language: input.language || 'English',
          extractedText: input.extractedText.slice(0, 5000),
        }),
      },
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content || '{}';
  return safeJsonParse(content) ?? buildFallbackSummary(input);
}

function buildFallbackSummary(input: ReportAnalysisInput) {
  const abnormalText = input.abnormalParameters.length
    ? input.abnormalParameters.map((parameter) => `${parameter.label}: ${parameter.value} ${parameter.unit}`.trim()).join('; ')
    : 'No parameters were flagged by the configured informational rules.';

  return {
    summary: `${input.reportType} was processed successfully. ${abnormalText}`,
    abnormalParameters: input.abnormalParameters,
    riskCategory: input.abnormalParameters.length > 0 ? 'Needs Clinical Review' : 'Informational',
    recommendedSpecialist: input.specialist,
    explanation: `The report was analyzed using configured reference ranges and the suggested specialist is ${input.specialist}. This is an informational interpretation only.`,
    disclaimer: 'This application is an AI-assisted informational tool. It does not provide a medical diagnosis or replace a licensed healthcare professional.',
  };
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value) as ReturnType<typeof buildFallbackSummary>;
  } catch {
    return null;
  }
}
