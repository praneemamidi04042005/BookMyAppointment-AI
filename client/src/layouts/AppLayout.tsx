import type { ReactNode } from 'react';
import { Activity, CalendarDays, FileText, HeartPulse, Hospital, LayoutDashboard, LogOut, Search, ShieldPlus, UserRound } from 'lucide-react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/hospitals', label: 'Hospitals', icon: Hospital },
  { to: '/doctors', label: 'Doctors', icon: UserRound },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/trends', label: 'Trends', icon: HeartPulse },
];

export function AppLayout({ children }: { children?: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(20,184,166,0.10),_transparent_30%),linear-gradient(to_bottom,_#f8fbff,_#f5fafc)] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <aside className="hidden w-72 flex-col border-r border-slate-200/80 bg-white/80 p-6 backdrop-blur xl:flex">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-teal-500 text-white shadow-lg shadow-brand-600/20">
              <Activity size={22} />
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">BookMyAppointment AI</div>
              <div className="text-xs text-slate-500">Healthcare orchestration</div>
            </div>
          </Link>

          <nav className="mt-10 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`
                }
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-3xl bg-slate-900 p-4 text-white shadow-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Signed in as</div>
            <div className="mt-1 text-lg font-semibold">{user?.name ?? 'Guest'}</div>
            <div className="text-sm text-slate-300">{user?.role ?? 'PATIENT'}</div>
          </div>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div>
                <h1 className="text-xl font-semibold text-slate-900">{user?.role === 'DOCTOR' ? 'Doctor Dashboard' : user?.role === 'HOSPITAL_ADMIN' ? 'Hospital Dashboard' : 'Patient Dashboard'}</h1>
                <p className="text-sm text-slate-500">AI-assisted appointment and report management</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 md:inline-flex"
                  onClick={() => pushToast({ title: 'Search', message: 'Use the dashboard panels to search doctors or hospitals.', variant: 'info' })}
                >
                  <Search size={16} /> Search tips
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-200 hover:bg-rose-50"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6 lg:p-8">{children ?? <Outlet />}</div>
        </main>
      </div>
    </div>
  );
}
