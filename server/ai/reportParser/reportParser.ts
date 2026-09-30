import { medicalReferenceRanges } from '../../utils/medicalReferenceRanges.js';

export type ParsedParameter = {
  key: string;
  label: string;
  value: number | string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  note?: string;
};

const metricPatterns: Array<{
  key: string;
  label: string;
  regex: RegExp;
  extract: (match: RegExpExecArray) => number | string;
}> = [
  { key: 'hemoglobin', label: 'Hemoglobin', regex: /hemoglobin\s*[:=]\s*(\d+(?:\.\d+)?)\s*(g\/dL|g\/dl)?/i, extract: (match) => Number(match[1]) },
  { key: 'wbc', label: 'WBC', regex: /(?:wbc|white blood cell(?:s)?)\s*[:=]\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*\/\s*(?:uL|µL|ul)?/i, extract: (match) => Number(match[1].replace(/,/g, '')) },
  { key: 'platelets', label: 'Platelets', regex: /platelets?\s*[:=]\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*\/\s*(?:uL|µL|ul)?/i, extract: (match) => Number(match[1].replace(/,/g, '')) },
  { key: 'hba1c', label: 'HbA1c', regex: /hba1c\s*[:=]\s*(\d+(?:\.\d+)?)\s*%?/i, extract: (match) => Number(match[1]) },
  { key: 'fastingGlucose', label: 'Fasting Glucose', regex: /fasting glucose\s*[:=]\s*(\d+(?:\.\d+)?)\s*mg\/dL/i, extract: (match) => Number(match[1]) },
  { key: 'randomGlucose', label: 'Random Glucose', regex: /(?:random glucose|blood sugar)\s*[:=]\s*(\d+(?:\.\d+)?)\s*mg\/dL/i, extract: (match) => Number(match[1]) },
  { key: 'creatinine', label: 'Creatinine', regex: /creatinine\s*[:=]\s*(\d+(?:\.\d+)?)\s*mg\/dL/i, extract: (match) => Number(match[1]) },
  { key: 'cholesterol', label: 'Cholesterol', regex: /cholesterol\s*[:=]\s*(\d+(?:\.\d+)?)\s*mg\/dL/i, extract: (match) => Number(match[1]) },
  { key: 'alt', label: 'ALT', regex: /alt\s*[:=]\s*(\d+(?:\.\d+)?)\s*U\/L/i, extract: (match) => Number(match[1]) },
  { key: 'ast', label: 'AST', regex: /ast\s*[:=]\s*(\d+(?:\.\d+)?)\s*U\/L/i, extract: (match) => Number(match[1]) },
];

export function parseMedicalParameters(text: string) {
  const extractedParameters: ParsedParameter[] = [];
  const lowerText = text.toLowerCase();

  for (const pattern of metricPatterns) {
    const match = pattern.regex.exec(text);
    if (!match) {
      continue;
    }

    const value = pattern.extract(match);
    const range = medicalReferenceRanges[pattern.key];
    const isNumeric = typeof value === 'number';
    const isAbnormal = Boolean(range && isNumeric && ((typeof range.min === 'number' && value < range.min) || (typeof range.max === 'number' && value > range.max)));
    const referenceRange = range ? `${range.min ?? 'varies'} - ${range.max ?? 'varies'} ${range.unit}`.trim() : 'Lab-specific reference range';

    extractedParameters.push({
      key: pattern.key,
      label: pattern.label,
      value,
      unit: range?.unit ?? '',
      referenceRange,
      isAbnormal,
      note: range?.note,
    });
  }

  if (/blood pressure|bp|mmhg/.test(lowerText)) {
    const bpMatch = text.match(/(\d{2,3})\s*\/\s*(\d{2,3})\s*mmhg/i);
    if (bpMatch) {
      const systolic = Number(bpMatch[1]);
      const diastolic = Number(bpMatch[2]);
      extractedParameters.push({
        key: 'bloodPressureSystolic',
        label: 'Blood Pressure Systolic',
        value: systolic,
        unit: 'mmHg',
        referenceRange: '90 - 120 mmHg',
        isAbnormal: systolic > 120,
      });
      extractedParameters.push({
        key: 'bloodPressureDiastolic',
        label: 'Blood Pressure Diastolic',
        value: diastolic,
        unit: 'mmHg',
        referenceRange: '60 - 80 mmHg',
        isAbnormal: diastolic > 80,
      });
    }
  }

  return extractedParameters;
}

export function identifyAbnormalParameters(parameters: ParsedParameter[]) {
  return parameters
    .filter((parameter) => parameter.isAbnormal)
    .map((parameter) => ({
      key: parameter.key,
      label: parameter.label,
      value: parameter.value,
      unit: parameter.unit,
      reason: 'Outside the configured informational reference range',
    }));
}
