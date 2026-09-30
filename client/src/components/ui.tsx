import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import type { ToastItem } from '../context/ToastContext';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

export function Button({ children, className = '', variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: ButtonVariant }) {
  const variantClassName =
    variant === 'secondary'
      ? 'border border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:bg-brand-50'
      : variant === 'danger'
        ? 'bg-rose-600 text-white hover:bg-rose-700'
        : 'bg-brand-600 text-white hover:bg-brand-700';

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold shadow-lg shadow-brand-600/20 transition disabled:cursor-not-allowed disabled:opacity-50 ${variantClassName} ${className}`}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-halo ${className}`}>{children}</div>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100 ${props.className ?? ''}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100 ${props.className ?? ''}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100 ${props.className ?? ''}`} />;
}

export function Label({ children }: { children: ReactNode }) {
  return <label className="mb-2 block text-sm font-semibold text-slate-700">{children}</label>;
}

export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
    </div>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card className="bg-gradient-to-br from-white to-brand-50/70">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-slate-900">{value}</div>
      {hint ? <div className="mt-2 text-xs text-slate-500">{hint}</div> : null}
    </Card>
  );
}

export function ToastStack({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed right-4 top-4 z-50 flex w-[min(420px,calc(100vw-2rem))] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-2xl border bg-white p-4 shadow-xl ${toast.variant === 'success' ? 'border-emerald-200' : toast.variant === 'error' ? 'border-rose-200' : 'border-sky-200'}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-slate-900">{toast.title}</div>
              <div className="mt-1 text-sm text-slate-600">{toast.message}</div>
            </div>
            <button className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" onClick={() => onDismiss(toast.id)}>
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Spinner() {
  return <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />;
}
