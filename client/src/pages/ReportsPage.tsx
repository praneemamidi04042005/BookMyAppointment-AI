import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button, Card, Input, Label, SectionHeading, Textarea } from '../components/ui';

type Report = { _id: string; reportId: string; reportType: string; aiSummary?: { summary?: string; riskCategory?: string; recommendedSpecialist?: string }; abnormalParameters?: Array<{ label: string; value: string | number; unit: string }> };

export function ReportsPage() {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [reportType, setReportType] = useState('CBC');
  const [symptoms, setSymptoms] = useState('');

  async function loadReports() {
    if (!user?._id) return;
    const response = await api.get(`/reports/user/${user._id}`);
    setReports(response.data);
  }

  useEffect(() => { loadReports(); }, [user]);

  async function upload() {
    if (!file || !user?._id) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', user._id);
    formData.append('reportType', reportType);
    formData.append('symptoms', symptoms);
    await api.post('/reports/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    pushToast({ title: 'Report submitted', message: 'The report has been processed.', variant: 'success' });
    await loadReports();
  }

  return (
    <div className="space-y-6">
      <Card>
        <SectionHeading title="Upload medical report" subtitle="PDF, JPG, JPEG or PNG. The pipeline extracts parameters and generates an informational summary." />
        <div className="grid gap-4 md:grid-cols-2">
          <div><Label>Report type</Label><Input value={reportType} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReportType(e.target.value)} /></div>
          <div><Label>Symptoms or context</Label><Input value={symptoms} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSymptoms(e.target.value)} /></div>
          <div className="md:col-span-2"><Label>File</Label><Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] ?? null)} /></div>
        </div>
        <Button className="mt-4" onClick={upload}>Upload report</Button>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {reports.map((report) => (
          <Card key={report._id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-slate-900">{report.reportType}</div>
                <div className="text-sm text-slate-500">{report.reportId}</div>
              </div>
              <div className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{report.aiSummary?.riskCategory || 'Informational'}</div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{report.aiSummary?.summary || 'No summary available.'}</p>
            <div className="mt-4 text-sm text-slate-600">Recommended specialist: {report.aiSummary?.recommendedSpecialist || 'General Physician'}</div>
            {report.abnormalParameters?.length ? <Textarea readOnly value={report.abnormalParameters.map((parameter) => `${parameter.label}: ${parameter.value} ${parameter.unit}`.trim()).join('\n')} className="mt-4 min-h-[96px]" /> : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
