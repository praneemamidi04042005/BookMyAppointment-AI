import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const dataPointSchema = new Schema(
  {
    date: { type: String, required: true },
    value: { type: Number, required: true },
    unit: { type: String, default: '' },
    sourceReportId: { type: String, default: '' },
  },
  { _id: false },
);

const healthTrendSchema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    metric: { type: String, required: true },
    label: { type: String, required: true },
    unit: { type: String, default: '' },
    dataPoints: [dataPointSchema],
  },
  { timestamps: true },
);

healthTrendSchema.index({ patientId: 1, metric: 1 }, { unique: true });

export type HealthTrend = InferSchemaType<typeof healthTrendSchema>;

export const HealthTrendModel = (mongoose.models.HealthTrend as Model<HealthTrend>) || mongoose.model<HealthTrend>('HealthTrend', healthTrendSchema);
