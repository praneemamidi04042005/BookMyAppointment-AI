import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button, Card, Input, Label, SectionHeading, Select } from '../components/ui';

type Appointment = { _id: string; appointmentId: string; date: string; startTime: string; endTime: string; status: string; reason: string; doctorId: { name?: string; specialization?: string } | string };

type Hospital = { _id: string; name: string };
type Doctor = { _id: string; name: string; specialization: string; hospitalName: string };

export function AppointmentsPage() {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState({ hospitalId: '', doctorId: '', date: '2026-10-01', startTime: '10:00 AM', endTime: '10:30 AM', reason: '' });

  useEffect(() => {
    Promise.all([api.get('/appointments'), api.get('/hospitals'), api.get('/doctors')]).then(([appointmentRes, hospitalRes, doctorRes]) => {
      setAppointments(appointmentRes.data);
      setHospitals(hospitalRes.data);
      setDoctors(doctorRes.data);
      setForm((current) => ({ ...current, hospitalId: hospitalRes.data[0]?._id ?? '', doctorId: doctorRes.data[0]?._id ?? '' }));
    });
  }, []);

  async function book() {
    await api.post('/appointments/book', { ...form, patientId: user?._id });
    pushToast({ title: 'Appointment booked', message: 'The selected slot is now reserved.', variant: 'success' });
  }

  async function cancel(appointmentId: string) {
    await api.patch(`/appointments/${appointmentId}/cancel`);
    pushToast({ title: 'Appointment cancelled', message: 'The selected appointment was cancelled.', variant: 'info' });
    const response = await api.get('/appointments');
    setAppointments(response.data);
  }

  return (
    <div className="space-y-6">
      <Card>
        <SectionHeading title="Book appointment" subtitle="Choose hospital, doctor, date and slot." />
        <div className="grid gap-4 md:grid-cols-2">
          <div><Label>Hospital</Label><Select value={form.hospitalId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, hospitalId: e.target.value })}>{hospitals.map((hospital) => <option key={hospital._id} value={hospital._id}>{hospital.name}</option>)}</Select></div>
          <div><Label>Doctor</Label><Select value={form.doctorId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, doctorId: e.target.value })}>{doctors.map((doctor) => <option key={doctor._id} value={doctor._id}>{doctor.name} - {doctor.specialization}</option>)}</Select></div>
          <div><Label>Date</Label><Input value={form.date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, date: e.target.value })} /></div>
          <div><Label>Start time</Label><Input value={form.startTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, startTime: e.target.value })} /></div>
          <div><Label>End time</Label><Input value={form.endTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, endTime: e.target.value })} /></div>
          <div><Label>Reason</Label><Input value={form.reason} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, reason: e.target.value })} /></div>
        </div>
        <Button className="mt-4" onClick={book}>Confirm slot</Button>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {appointments.map((appointment) => (
          <Card key={appointment._id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-slate-900">{appointment.appointmentId}</div>
                <div className="text-sm text-slate-500">{appointment.date} • {appointment.startTime} - {appointment.endTime}</div>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{appointment.status}</div>
            </div>
            <div className="mt-4 text-sm text-slate-600">Reason: {appointment.reason || 'Not provided'}</div>
            <div className="mt-4 flex gap-3">
              <Button className="bg-rose-600 hover:bg-rose-700" onClick={() => cancel(appointment.appointmentId)}>Cancel</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
