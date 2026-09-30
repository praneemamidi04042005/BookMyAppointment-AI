import { recommendSpecialistFromSymptoms } from '../../utils/symptomRecommendations.js';
import type { ParsedParameter } from '../reportParser/reportParser.js';

export function recommendSpecialist(symptoms: string, abnormalParameters: ParsedParameter[]) {
  const symptomRecommendation = recommendSpecialistFromSymptoms(symptoms);
  const abnormalKeys = abnormalParameters.map((parameter) => parameter.key);

  if (abnormalKeys.includes('creatinine')) {
    return {
      specialist: 'Nephrologist',
      reason: 'The report includes kidney-related abnormalities.',
      confidence: 'high' as const,
      disclaimer: symptomRecommendation.disclaimer,
    };
  }

  if (abnormalKeys.includes('hba1c') || abnormalKeys.includes('fastingGlucose') || abnormalKeys.includes('randomGlucose')) {
    return {
      specialist: 'Endocrinologist / Diabetologist',
      reason: 'The report includes blood sugar related abnormalities.',
      confidence: 'high' as const,
      disclaimer: symptomRecommendation.disclaimer,
    };
  }

  if (abnormalKeys.includes('alt') || abnormalKeys.includes('ast')) {
    return {
      specialist: 'Gastroenterologist / Hepatologist',
      reason: 'The report includes liver enzyme related abnormalities.',
      confidence: 'high' as const,
      disclaimer: symptomRecommendation.disclaimer,
    };
  }

  if (abnormalKeys.includes('bloodPressureSystolic') || abnormalKeys.includes('bloodPressureDiastolic')) {
    return {
      specialist: 'Cardiologist',
      reason: 'The report includes blood-pressure related abnormalities.',
      confidence: 'high' as const,
      disclaimer: symptomRecommendation.disclaimer,
    };
  }

  return symptomRecommendation;
}
