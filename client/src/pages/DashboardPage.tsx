import { useEffect, useState } from 'react';
import { Search, Upload, CalendarDays, FileText, HeartPulse, MapPinned, Stethoscope, Users } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button, Card, Input, Label, Select, SectionHeading, Spinner, StatCard, Textarea } from '../components/ui';
import { TrendChart } from '../components/TrendChart';

type Hospital = { _id: string; name: string; city: string; state: string; address: string; departments: string[] };
type Doctor = { _id: string; name: string; specialization: string; hospitalName: string; consultationFee: number; availability: Array<{ date: string; slots: string[] }> };
type Report = { _id: string; reportId: string; reportType: string; recommendedSpecialist: string; uploadDate: string; aiSummary?: { summary?: string; riskCategory?: string } };
type Appointment = { _id: string; appointmentId: string; date: string; startTime: string; endTime: string; status: string; doctorId: { name?: string; specialization?: string } | string };

export function DashboardPage() {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [symptoms, setSymptoms] = useState('chest pain and palpitations');
  const [specialistResult, setSpecialistResult] = useState<{ specialist: string; reason: string; disclaimer: string } | null>(null);
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportType, setReportType] = useState('CBC');
  const [booking, setBooking] = useState({ hospitalId: '', doctorId: '', date: '2026-10-01', startTime: '10:00 AM', endTime: '10:30 AM', reason: '' });

  useEffect(() => {
    async function load() {
      try {
        const [hospitalRes, doctorRes, reportRes, appointmentRes, trendRes] = await Promise.all([
          api.get('/hospitals'),
          api.get('/doctors'),
          api.get(`/reports/user/${user?._id}`),
          api.get('/appointments'),
          user?._id ? api.get(`/health-trends/${user._id}`) : Promise.resolve({ data: [] }),
        ]);
        setHospitals(hospitalRes.data);
        setDoctors(doctorRes.data);
        setReports(reportRes.data);
        setAppointments(appointmentRes.data);
        setTrends(trendRes.data);
        if (hospitalRes.data[0] && doctorRes.data[0]) {
          setBooking((current) => ({ ...current, hospitalId: hospitalRes.data[0]._id, doctorId: doctorRes.data[0]._id }));
        }
      } catch {
        pushToast({ title: 'Dashboard load issue', message: 'Some data could not be loaded yet.', variant: 'info' });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [pushToast, user]);

  async function recommendSpecialist() {
    const response = await api.post('/symptoms/recommend-specialist', { symptoms });
    setSpecialistResult(response.data);
  }

  async function uploadReport() {
    if (!reportFile || !user?._id) return;
    const formData = new FormData();
    formData.append('file', reportFile);
    formData.append('patientId', user._id);
    formData.append('reportType', reportType);
    formData.append('language', user.preferredLanguage || 'English');
    formData.append('symptoms', symptoms);
    await api.post('/reports/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    pushToast({ title: 'Report uploaded', message: 'The OCR and analysis pipeline has started.', variant: 'success' });
  }

  async function bookSlot() {
    await api.post('/appointments/book', { ...booking, patientId: user?._id });
    pushToast({ title: 'Appointment booked', message: 'Your slot has been reserved.', variant: 'success' });
  }

  const upcomingAppointment = appointments[0];
  const recentReport = reports[0];
  const patientTrends = trends.filter((trend) => trend.dataPoints?.length > 0).slice(0, 3);

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Spinner /></div>;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-4">
        <StatCard label="Welcome" value={user?.name ?? 'Patient'} hint={user?.location?.city ? `${user.location.city}, ${user.location.state}` : 'Select your location'} />
        <StatCard label="Upcoming appointment" value={upcomingAppointment ? '1' : '0'} hint={upcomingAppointment ? `${upcomingAppointment.date} at ${upcomingAppointment.startTime}` : 'No appointment booked yet'} />
        <StatCard label="Recent reports" value={String(reports.length)} hint={recentReport ? recentReport.reportType : 'Upload your first report'} />
        <StatCard label="Trend series" value={String(patientTrends.length)} hint="Blood glucose, HbA1c and other tracked values" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <SectionHeading title="Report analysis" subtitle="Upload a PDF or image to extract parameters and generate an informational summary." />
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Report type</Label>
              <Select value={reportType} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setReportType(event.target.value)}>
                <option>CBC</option>
                <option>HbA1c</option>
                <option>Liver Function Test</option>
                <option>Kidney Function Test</option>
                <option>Blood Pressure Report</option>
              </Select>
            </div>
            <div>
              <Label>Symptoms</Label>
              <Input value={symptoms} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSymptoms(event.target.value)} placeholder="Enter symptoms or report context" />
            </div>
            <div className="md:col-span-2">
              <Label>Report file</Label>
              <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event: React.ChangeEvent<HTMLInputElement>) => setReportFile(event.target.files?.[0] ?? null)} />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={uploadReport}><Upload size={16} className="mr-2" /> Upload report</Button>
            <Button variant="secondary" className="bg-slate-900 text-white hover:bg-slate-800 hover:text-white" onClick={recommendSpecialist}><Stethoscope size={16} className="mr-2" /> Get specialist recommendation</Button>
          </div>
          {specialistResult ? (
            <div className="mt-4 rounded-3xl border border-brand-200 bg-brand-50 p-4">
              <div className="text-sm font-semibold text-brand-700">Recommended specialist</div>
              <div className="mt-1 text-xl font-semibold text-slate-900">{specialistResult.specialist}</div>
              <div className="mt-2 text-sm text-slate-600">{specialistResult.reason}</div>
              <div className="mt-3 text-xs text-slate-500">{specialistResult.disclaimer}</div>
            </div>
          ) : null}
        </Card>

        <Card>
          <SectionHeading title="Booking" subtitle="Choose a hospital, doctor, date and slot." />
          <div className="grid gap-4">
            <div>
              <Label>Hospital</Label>
              <Select value={booking.hospitalId} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setBooking({ ...booking, hospitalId: event.target.value })}>
                {hospitals.map((hospital) => <option key={hospital._id} value={hospital._id}>{hospital.name}</option>)}
              </Select>
            </div>
            <div>
              <Label>Doctor</Label>
              <Select value={booking.doctorId} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setBooking({ ...booking, doctorId: event.target.value })}>
                {doctors.map((doctor) => <option key={doctor._id} value={doctor._id}>{doctor.name} - {doctor.specialization}</option>)}
              </Select>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>Date</Label><Input value={booking.date} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setBooking({ ...booking, date: event.target.value })} /></div>
              <div><Label>Start time</Label><Input value={booking.startTime} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setBooking({ ...booking, startTime: event.target.value })} /></div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>End time</Label><Input value={booking.endTime} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setBooking({ ...booking, endTime: event.target.value })} /></div>
              <div><Label>Reason</Label><Input value={booking.reason} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setBooking({ ...booking, reason: event.target.value })} /></div>
            </div>
            <Button onClick={bookSlot}><CalendarDays size={16} className="mr-2" /> Book appointment</Button>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <SectionHeading title="Recent reports" subtitle="Uploaded reports with informational summaries." />
          <div className="space-y-3">
            {reports.length ? reports.map((report) => (
              <div key={report._id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-900">{report.reportType}</div>
                    <div className="text-sm text-slate-500">{report.reportId}</div>
                  </div>
                  <div className="text-sm font-medium text-brand-700">{report.aiSummary?.riskCategory || 'Informational'}</div>
                </div>
                <p className="mt-2 text-sm text-slate-600">{report.aiSummary?.summary || 'No summary yet.'}</p>
              </div>
            )) : <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">No reports yet.</div>}
          </div>
        </Card>

        <Card>
          <SectionHeading title="Health trends" subtitle="Graphing previous report values over time." />
          <TrendChart series={patientTrends} />
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card><SectionHeading title="Nearby hospitals" subtitle={`${hospitals.length} facilities found`} /><div className="space-y-3">{hospitals.slice(0, 3).map((hospital) => <div key={hospital._id} className="rounded-2xl bg-slate-50 p-4"><div className="font-semibold text-slate-900">{hospital.name}</div><div className="text-sm text-slate-500">{hospital.city}, {hospital.state}</div><div className="mt-1 text-xs text-slate-500">{hospital.departments.join(', ')}</div></div>)}</div></Card>
        <Card><SectionHeading title="Available doctors" subtitle={`${doctors.length} doctors found`} /><div className="space-y-3">{doctors.slice(0, 3).map((doctor) => <div key={doctor._id} className="rounded-2xl bg-slate-50 p-4"><div className="font-semibold text-slate-900">{doctor.name}</div><div className="text-sm text-slate-500">{doctor.specialization}</div><div className="mt-1 text-xs text-slate-500">{doctor.hospitalName} • Fee ₹{doctor.consultationFee}</div></div>)}</div></Card>
        <Card><SectionHeading title="Quick actions" subtitle="Common patient flow shortcuts" /><div className="space-y-3 text-sm text-slate-600"><div className="rounded-2xl bg-brand-50 p-4"><MapPinned className="mb-2 text-brand-600" size={18} />Search doctors near your location.</div><div className="rounded-2xl bg-teal-50 p-4"><FileText className="mb-2 text-teal-600" size={18} />Upload a report and review findings.</div><div className="rounded-2xl bg-sky-50 p-4"><Users className="mb-2 text-sky-600" size={18} />Compare values over time.</div></div></Card>
      </section>
    </div>
  );
}
