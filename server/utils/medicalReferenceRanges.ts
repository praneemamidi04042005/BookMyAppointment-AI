export type ReferenceRange = {
  min?: number;
  max?: number;
  unit: string;
  note?: string;
};

export type ReferenceRanges = Record<string, ReferenceRange>;

export const medicalReferenceRanges: ReferenceRanges = {
  hemoglobin: { min: 12, max: 17.5, unit: 'g/dL', note: 'Ranges vary by age, sex and laboratory.' },
  wbc: { min: 4000, max: 11000, unit: '/uL', note: 'Ranges vary by laboratory.' },
  platelets: { min: 150000, max: 450000, unit: '/uL' },
  hba1c: { max: 5.6, unit: '%', note: 'Prediabetes and diabetes cutoffs are informational only.' },
  fastingGlucose: { min: 70, max: 99, unit: 'mg/dL' },
  randomGlucose: { min: 70, max: 140, unit: 'mg/dL' },
  creatinine: { min: 0.6, max: 1.3, unit: 'mg/dL' },
  cholesterol: { max: 200, unit: 'mg/dL' },
  bloodPressureSystolic: { max: 120, unit: 'mmHg' },
  bloodPressureDiastolic: { max: 80, unit: 'mmHg' },
  alt: { max: 55, unit: 'U/L' },
  ast: { max: 40, unit: 'U/L' },
};
