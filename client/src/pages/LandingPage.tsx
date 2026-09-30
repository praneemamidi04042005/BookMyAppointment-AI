import { ArrowRight, Activity, ShieldCheck, MapPinned, ScanSearch, CalendarDays, Brain, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../components/ui';

const featureCards = [
  { icon: Brain, title: 'AI report explanation', text: 'Upload medical reports and get a grounded, simple-English summary with abnormal-value highlighting.' },
  { icon: Stethoscope, title: 'Specialist recommendation', text: 'Rule-based and AI-assisted referral guidance that stays informational, not diagnostic.' },
  { icon: MapPinned, title: 'Nearby care discovery', text: 'Search hospitals and doctors by city, area or pincode with a clean healthcare directory.' },
  { icon: CalendarDays, title: 'Appointment booking', text: 'Select hospital, doctor, date and slot with double-booking protection.' },
  { icon: ScanSearch, title: 'OCR pipeline', text: 'Supports PDF and image uploads with OCR extraction and configurable parameter rules.' },
  { icon: ShieldCheck, title: 'Role-based access', text: 'Separate dashboards for patient, doctor and hospital admin roles with secure endpoints.' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(20,184,166,0.18),_transparent_22%),linear-gradient(to_bottom,_#f9fcff,_#eef8fb)] text-slate-900">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-teal-500 text-white shadow-lg shadow-brand-600/20">
            <Activity size={22} />
          </div>
          <div>
            <div className="brand-heading text-lg font-semibold">BookMyAppointment AI</div>
            <div className="text-xs text-slate-500">Healthcare appointments and report analysis</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white">Login</Link>
          <Button className="px-5 py-2.5">
            <Link to="/register" className="inline-flex items-center gap-2">Get started <ArrowRight size={16} /></Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-8 lg:pb-24 lg:pt-14">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-brand-200 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm">
              AI-assisted healthcare workflow for patients, doctors and hospitals
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-slate-950 lg:text-6xl">
              Understand reports, find the right specialist, and book care in one place.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              BookMyAppointment AI helps patients upload reports, review abnormal parameters, discover nearby hospitals and doctors, and reserve appointment slots without pretending to provide a diagnosis.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700">
                Create account <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50">
                Sign in
              </Link>
            </div>
            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              {[
                ['5 hospitals', 'demo dataset'],
                ['10 doctors', 'multi-specialty'],
                ['OCR + RAG', 'analysis pipeline'],
              ].map(([value, label]) => (
                <div key={value} className="rounded-3xl border border-white/70 bg-white/70 p-4 shadow-halo backdrop-blur">
                  <div className="text-2xl font-semibold text-slate-900">{value}</div>
                  <div className="text-sm text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <Card className="relative overflow-hidden border-white/70 bg-white/80 backdrop-blur">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-200/40 blur-3xl" />
            <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-teal-200/40 blur-3xl" />
            <div className="relative space-y-4">
              <div className="rounded-3xl bg-slate-950 p-5 text-white shadow-2xl">
                <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Patient snapshot</div>
                <div className="mt-3 text-2xl font-semibold">Upcoming appointment</div>
                <div className="mt-2 text-sm text-slate-300">Cardiology consultation with Dr. Ananya Rao</div>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-white/10 p-3">10:00 AM</div>
                  <div className="rounded-2xl bg-white/10 p-3">Aarogyam Care</div>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-4">
                  <div className="text-sm text-slate-500">Latest report</div>
                  <div className="mt-1 font-semibold">HbA1c analysis</div>
                  <div className="text-sm text-slate-600">Informational summary and trend comparison</div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-4">
                  <div className="text-sm text-slate-500">Recommended specialist</div>
                  <div className="mt-1 font-semibold">Endocrinologist</div>
                  <div className="text-sm text-slate-600">Rule-based and grounded AI recommendation</div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="mt-20 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((feature) => (
            <Card key={feature.title} className="bg-white/85 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
              <feature.icon className="text-brand-600" size={28} />
              <h2 className="mt-4 text-xl font-semibold">{feature.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{feature.text}</p>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
