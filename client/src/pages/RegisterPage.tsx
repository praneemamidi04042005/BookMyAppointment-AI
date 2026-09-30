import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button, Card, Input, Label, Select } from '../components/ui';

export function RegisterPage() {
  const [form, setForm] = useState({
    name: 'Demo Patient',
    email: 'newpatient@bookmyappointment.ai',
    password: 'Password@123',
    role: 'PATIENT',
    phone: '',
    preferredLanguage: 'English',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { pushToast } = useToast();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/register', form);
      login(response.data.token, response.data.user);
      pushToast({ title: 'Account created', message: 'Your account is ready.', variant: 'success' });
      navigate('/dashboard');
    } catch (error: any) {
      pushToast({ title: 'Registration failed', message: error?.response?.data?.message || 'Unable to create account.', variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_26%),linear-gradient(to_bottom,_#f8fbff,_#eef8fb)] px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <div className="brand-heading text-sm font-semibold uppercase tracking-[0.3em] text-brand-700">Create account</div>
          <h1 className="mt-4 max-w-lg text-5xl font-semibold tracking-tight text-slate-900">Join the healthcare workflow designed for patients and providers.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">Register once and use the same platform for report review, specialist discovery, and appointment booking.</p>
        </div>

        <Card className="mx-auto w-full max-w-xl">
          <h2 className="text-2xl font-semibold text-slate-900">Register</h2>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: event.target.value })} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: event.target.value })} type="email" />
            </div>
            <div>
              <Label>Password</Label>
              <Input value={form.password} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, password: event.target.value })} type="password" />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={form.role} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, role: event.target.value })}>
                <option value="PATIENT">Patient</option>
                <option value="DOCTOR">Doctor</option>
                <option value="HOSPITAL_ADMIN">Hospital Admin</option>
              </Select>
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, phone: event.target.value })} />
            </div>
            <div>
              <Label>Preferred language</Label>
              <Select value={form.preferredLanguage} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, preferredLanguage: event.target.value })}>
                <option>English</option>
                <option>Telugu</option>
              </Select>
            </div>
            <Button disabled={loading} className="w-full py-3 text-base">
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          <p className="mt-6 text-sm text-slate-500">
            Already have an account? <Link to="/login" className="font-semibold text-brand-700 hover:underline">Sign in</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
