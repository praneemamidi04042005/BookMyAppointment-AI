import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';
import { ProcessingStatuses } from '../utils/constants.js';

const parameterSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
    unit: { type: String, default: '' },
    referenceRange: { type: String, default: '' },
    isAbnormal: { type: Boolean, default: false },
    note: { type: String, default: '' },
  },
  { _id: false },
);

const abnormalParameterSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
    unit: { type: String, default: '' },
    reason: { type: String, default: '' },
  },
  { _id: false },
);

const medicalReportSchema = new Schema(
  {
    reportId: { type: String, required: true, unique: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    uploadedByRole: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileName: { type: String, default: '' },
    reportType: { type: String, default: 'General Report' },
    uploadDate: { type: Date, default: Date.now },
    extractedText: { type: String, default: '' },
    extractedParameters: [parameterSchema],
    aiSummary: {
      summary: { type: String, default: '' },
      explanation: { type: String, default: '' },
      riskCategory: { type: String, default: 'Informational' },
      recommendedSpecialist: { type: String, default: 'General Physician' },
      disclaimer: { type: String, default: 'This application is an AI-assisted informational tool.' },
    },
    abnormalParameters: [abnormalParameterSchema],
    recommendedSpecialist: { type: String, default: 'General Physician' },
    processingStatus: { type: String, enum: Object.values(ProcessingStatuses), default: ProcessingStatuses.PENDING },
    language: { type: String, default: 'English' },
  },
  { timestamps: true },
);

medicalReportSchema.index({ patientId: 1, uploadDate: -1 });

export type MedicalReport = InferSchemaType<typeof medicalReportSchema>;

export const MedicalReportModel = (mongoose.models.MedicalReport as Model<MedicalReport>) || mongoose.model<MedicalReport>('MedicalReport', medicalReportSchema);
