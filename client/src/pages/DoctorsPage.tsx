import { useEffect, useState } from 'react';
import api from '../services/api';
import { Card, Input, Label, SectionHeading } from '../components/ui';

type Doctor = { _id: string; name: string; specialization: string; hospitalName: string; consultationFee: number; experienceYears: number; availability: Array<{ date: string; slots: string[] }> };

export function DoctorsPage() {
  const [query, setQuery] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    api.get('/doctors', { params: { query } }).then((response: { data: Doctor[] }) => setDoctors(response.data));
  }, [query]);

  return (
    <div className="space-y-6">
      <Card>
        <SectionHeading title="Doctor search" subtitle="Search by name, specialization or hospital." />
        <div className="max-w-xl">
          <Label>Search doctors</Label>
          <Input value={query} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} placeholder="Search doctors" />
        </div>
      </Card>
      <div className="grid gap-4 xl:grid-cols-2">
        {doctors.map((doctor) => (
          <Card key={doctor._id}>
            <div className="text-lg font-semibold text-slate-900">{doctor.name}</div>
            <div className="mt-1 text-sm text-slate-500">{doctor.specialization}</div>
            <div className="mt-1 text-sm text-slate-500">{doctor.hospitalName}</div>
            <div className="mt-4 text-sm text-slate-600">Experience: {doctor.experienceYears} years</div>
            <div className="mt-1 text-sm text-slate-600">Consultation fee: ₹{doctor.consultationFee}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {doctor.availability?.[0]?.slots?.map((slot) => <span key={slot} className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">{slot}</span>)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
