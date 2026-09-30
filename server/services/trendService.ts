import { MedicalReportModel } from '../models/MedicalReport.js';

const trendKeys = [
  { metric: 'hba1c', label: 'HbA1c', unit: '%' },
  { metric: 'fastingGlucose', label: 'Fasting Glucose', unit: 'mg/dL' },
  { metric: 'randomGlucose', label: 'Random Glucose', unit: 'mg/dL' },
  { metric: 'hemoglobin', label: 'Hemoglobin', unit: 'g/dL' },
  { metric: 'cholesterol', label: 'Cholesterol', unit: 'mg/dL' },
  { metric: 'creatinine', label: 'Creatinine', unit: 'mg/dL' },
  { metric: 'bloodPressureSystolic', label: 'Blood Pressure Systolic', unit: 'mmHg' },
  { metric: 'bloodPressureDiastolic', label: 'Blood Pressure Diastolic', unit: 'mmHg' },
];

export async function buildHealthTrends(patientId: string) {
  const reports = await MedicalReportModel.find({ patientId }).sort({ uploadDate: 1 }).lean();

  return trendKeys.map((trend) => {
    const dataPoints = reports
      .flatMap((report) =>
        report.extractedParameters
          .filter((parameter) => parameter.key === trend.metric)
          .map((parameter) => ({
            date: report.uploadDate,
            value: Number(parameter.value),
            unit: parameter.unit || trend.unit,
            reportId: report.reportId,
          })),
      )
      .filter((point) => !Number.isNaN(point.value));

    return {
      metric: trend.metric,
      label: trend.label,
      unit: trend.unit,
      dataPoints,
    };
  });
}
