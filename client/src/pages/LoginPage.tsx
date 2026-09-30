import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button, Card, Input, Label } from '../components/ui';

export function LoginPage() {
  const [email, setEmail] = useState('patient@bookmyappointment.ai');
  const [password, setPassword] = useState('Password@123');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { pushToast } = useToast();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      pushToast({ title: 'Welcome back', message: 'You are now signed in.', variant: 'success' });
      navigate('/dashboard');
    } catch (error: any) {
      pushToast({ title: 'Login failed', message: error?.response?.data?.message || 'Unable to sign in.', variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_26%),linear-gradient(to_bottom,_#f8fbff,_#eef8fb)] px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="text-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-teal-500 text-white">
              <Activity size={22} />
            </div>
            <div>
              <div className="brand-heading text-lg font-semibold">BookMyAppointment AI</div>
              <div className="text-sm text-slate-500">Secure sign in</div>
            </div>
          </div>
          <h1 className="mt-6 max-w-lg text-5xl font-semibold tracking-tight">Access your dashboard, reports and appointments.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">Use the demo accounts seeded into the backend, or sign in with your own patient, doctor or hospital admin account.</p>
          <div className="mt-8 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-halo backdrop-blur">
            <div className="text-sm font-semibold text-slate-900">Demo credentials</div>
            <div className="mt-2 grid gap-2 text-sm text-slate-600">
              <div>Patient: patient@bookmyappointment.ai / Password@123</div>
              <div>Doctor: doctor1@bookmyappointment.ai / Password@123</div>
              <div>Admin: admin@bookmyappointment.ai / Password@123</div>
            </div>
          </div>
        </div>

        <Card className="mx-auto w-full max-w-xl">
          <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
          <p className="mt-2 text-sm text-slate-500">Protected access for patients, doctors and hospital admins.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)} type="email" />
            </div>
            <div>
              <Label>Password</Label>
              <Input value={password} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)} type="password" />
            </div>
            <Button disabled={loading} className="w-full py-3 text-base">
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <p className="mt-6 text-sm text-slate-500">
            New here? <Link to="/register" className="font-semibold text-brand-700 hover:underline">Create an account</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
