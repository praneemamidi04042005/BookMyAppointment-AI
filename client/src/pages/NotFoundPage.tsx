import { Link } from 'react-router-dom';
import { Card } from '../components/ui';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Card className="max-w-xl text-center">
        <div className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">404</div>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-600">The page you are looking for does not exist in this workspace.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700">
            Return home
          </Link>
        </div>
      </Card>
    </div>
  );
}
