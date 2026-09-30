export type SpecialistRecommendation = {
  specialist: string;
  reason: string;
  confidence: 'low' | 'moderate' | 'high';
  disclaimer: string;
};

const symptomRules: Array<{ keywords: string[]; specialist: string; reason: string }> = [
  { keywords: ['chest pain', 'palpitations', 'bp', 'blood pressure', 'hypertension', 'pressure'], specialist: 'Cardiologist', reason: 'Cardiac or blood-pressure related symptoms or findings were mentioned.' },
  { keywords: ['sugar', 'glucose', 'diabetes', 'hba1c'], specialist: 'Endocrinologist / Diabetologist', reason: 'Blood sugar related symptoms or lab findings were mentioned.' },
  { keywords: ['creatinine', 'kidney', 'renal', 'urea'], specialist: 'Nephrologist', reason: 'Kidney related abnormalities were mentioned.' },
  { keywords: ['liver', 'alt', 'ast', 'bilirubin', 'hepatitis'], specialist: 'Gastroenterologist / Hepatologist', reason: 'Liver related symptoms or labs were mentioned.' },
  { keywords: ['skin', 'rash', 'itching', 'acne'], specialist: 'Dermatologist', reason: 'Skin related symptoms were mentioned.' },
  { keywords: ['eye', 'vision', 'blurred vision'], specialist: 'Ophthalmologist', reason: 'Eye or vision symptoms were mentioned.' },
  { keywords: ['joint', 'bone', 'back pain', 'orthopedic'], specialist: 'Orthopedist', reason: 'Bone or joint symptoms were mentioned.' },
  { keywords: ['headache', 'seizure', 'numbness', 'neurologic', 'dizziness'], specialist: 'Neurologist', reason: 'Neurological symptoms were mentioned.' },
];

export function recommendSpecialistFromSymptoms(input: string): SpecialistRecommendation {
  const lower = input.toLowerCase();
  for (const rule of symptomRules) {
    if (rule.keywords.some((keyword) => lower.includes(keyword))) {
      return {
        specialist: rule.specialist,
        reason: rule.reason,
        confidence: 'moderate',
        disclaimer: 'This is an informational specialist recommendation and not a medical diagnosis.',
      };
    }
  }

  return {
    specialist: 'General Physician',
    reason: 'The symptoms are unclear or do not match a narrower specialty with confidence.',
    confidence: 'low',
    disclaimer: 'This is an informational specialist recommendation and not a medical diagnosis.',
  };
}
