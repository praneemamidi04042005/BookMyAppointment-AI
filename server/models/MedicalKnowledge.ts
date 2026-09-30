import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const medicalKnowledgeSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    source: { type: String, default: 'internal' },
    embedding: [{ type: Number }],
  },
  { timestamps: true },
);

medicalKnowledgeSchema.index({ category: 1 });

export type MedicalKnowledge = InferSchemaType<typeof medicalKnowledgeSchema>;

export const MedicalKnowledgeModel = (mongoose.models.MedicalKnowledge as Model<MedicalKnowledge>) || mongoose.model<MedicalKnowledge>('MedicalKnowledge', medicalKnowledgeSchema);
