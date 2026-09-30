import path from 'node:path';
import { nanoid } from 'nanoid';
import { MedicalReportModel } from '../models/MedicalReport.js';
import { storeReportFile } from './fileStorage.js';
import { extractTextFromFile } from '../ai/ocr/ocrService.js';
import { identifyAbnormalParameters, parseMedicalParameters } from '../ai/reportParser/reportParser.js';
import { retrieveMedicalContext } from '../ai/rag/ragService.js';
import { recommendSpecialist } from '../ai/specialistRecommendation/specialistRecommendation.js';
import { generateReportSummary } from './aiService.js';
import { ProcessingStatuses } from '../utils/constants.js';

export type AnalyzeReportInput = {
  filePath: string;
  mimeType: string;
  fileName: string;
  patientId: string;
  uploadedBy: string;
  uploadedByRole: string;
  reportType: string;
  language?: string;
  symptoms?: string;
};

export async function analyzeAndStoreReport(input: AnalyzeReportInput) {
  const { fileUrl } = await storeReportFile(input.filePath, input.fileName);
  const extractedText = await extractTextFromFile(input.filePath, input.mimeType);
  const extractedParameters = parseMedicalParameters(extractedText);
  const abnormalParameters = identifyAbnormalParameters(extractedParameters);
  const specialistRecommendation = recommendSpecialist(input.symptoms ?? '', extractedParameters);
  const contextChunks = await retrieveMedicalContext(`${input.reportType} ${extractedText.slice(0, 1000)} ${input.symptoms ?? ''}`);
  const aiSummary = await generateReportSummary({
    reportType: input.reportType,
    extractedText,
    extractedParameters,
    abnormalParameters,
    specialist: specialistRecommendation.specialist,
    contextChunks,
    language: input.language,
  });

  const report = await MedicalReportModel.create({
    reportId: `RPT-${nanoid(10).toUpperCase()}`,
    patientId: input.patientId,
    uploadedBy: input.uploadedBy,
    uploadedByRole: input.uploadedByRole,
    fileUrl,
    fileName: path.basename(input.fileName),
    reportType: input.reportType,
    extractedText,
    extractedParameters,
    abnormalParameters,
    aiSummary,
    recommendedSpecialist: specialistRecommendation.specialist,
    processingStatus: ProcessingStatuses.COMPLETED,
    language: input.language ?? 'English',
  });

  return report;
}
