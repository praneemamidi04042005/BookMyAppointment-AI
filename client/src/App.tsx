import { Route, Routes, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { HospitalsPage } from './pages/HospitalsPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { TrendsPage } from './pages/TrendsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useToast } from './context/ToastContext';
import { ToastStack } from './components/ui';

export default function App() {
  const { toasts, dismissToast } = useToast();

  return (
    <>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="hospitals" element={<HospitalsPage />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="trends" element={<TrendsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
