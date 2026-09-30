import { useEffect, useState } from 'react';
import api from '../services/api';
import { Card, Input, Label, SectionHeading } from '../components/ui';

type Hospital = { _id: string; name: string; city: string; state: string; address: string; departments: string[]; contactNumber: string };

export function HospitalsPage() {
  const [query, setQuery] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  useEffect(() => {
    api.get('/hospitals', { params: { query } }).then((response: { data: Hospital[] }) => setHospitals(response.data));
  }, [query]);

  return (
    <div className="space-y-6">
      <Card>
        <SectionHeading title="Hospital search" subtitle="Find nearby facilities by name, city or department." />
        <div className="max-w-xl">
          <Label>Search hospitals</Label>
          <Input value={query} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} placeholder="Search hospitals" />
        </div>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        {hospitals.map((hospital) => (
          <Card key={hospital._id}>
            <div className="text-lg font-semibold text-slate-900">{hospital.name}</div>
            <div className="mt-1 text-sm text-slate-500">{hospital.address}</div>
            <div className="mt-1 text-sm text-slate-500">{hospital.city}, {hospital.state}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {hospital.departments.map((department) => <span key={department} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">{department}</span>)}
            </div>
            <div className="mt-4 text-sm text-slate-600">Contact: {hospital.contactNumber}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
