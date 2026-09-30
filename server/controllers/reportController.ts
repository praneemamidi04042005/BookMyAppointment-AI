import type { Request, Response } from 'express';
import { MedicalReportModel } from '../models/MedicalReport.js';
import { AppError } from '../utils/appError.js';
import { analyzeAndStoreReport } from '../services/reportService.js';
import { ProcessingStatuses } from '../utils/constants.js';

export async function uploadReport(req: Request, res: Response) {
  if (!req.file) {
    throw new AppError('A report file is required', 400);
  }

  const report = await analyzeAndStoreReport({
    filePath: req.file.path,
    mimeType: req.file.mimetype,
    fileName: req.file.originalname,
    patientId: String(req.body.patientId),
    uploadedBy: req.user?.id ?? req.body.patientId,
    uploadedByRole: req.user?.role ?? 'PATIENT',
    reportType: req.body.reportType || 'General Report',
    language: req.body.language || 'English',
    symptoms: req.body.symptoms || '',
  });

  res.status(201).json(report);
}

export async function getReportById(req: Request, res: Response) {
  const report = await MedicalReportModel.findById(req.params.id);
  if (!report) {
    throw new AppError('Report not found', 404);
  }

  if (String(report.patientId) !== req.user?.id && String(report.uploadedBy) !== req.user?.id && req.user?.role === 'PATIENT') {
    throw new AppError('Forbidden', 403);
  }

  res.json(report);
}

export async function getReportsForUser(req: Request, res: Response) {
  const reports = await MedicalReportModel.find({ patientId: req.params.userId }).sort({ uploadDate: -1 });
  res.json(reports);
}

export async function analyzeReport(req: Request, res: Response) {
  const report = await MedicalReportModel.findById(req.params.id);
  if (!report) {
    throw new AppError('Report not found', 404);
  }

  report.processingStatus = ProcessingStatuses.PROCESSING;
  await report.save();

  res.json(report);
}
