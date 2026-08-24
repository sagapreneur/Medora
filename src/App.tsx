import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DoctorLayout } from './components/layout/DoctorLayout';
import { PatientLayout } from './components/layout/PatientLayout';

// Doctor Pages
import { DashboardPage } from './pages/doctor/DashboardPage';
import { PatientsPage } from './pages/doctor/PatientsPage';
import { PatientProfilePage } from './pages/doctor/PatientProfilePage';
import { ConsultationWorkspacePage } from './pages/doctor/ConsultationWorkspacePage';
import { AppointmentsPage } from './pages/doctor/AppointmentsPage';
import { CalendarPage } from './pages/doctor/CalendarPage';
import { PrescriptionsPage } from './pages/doctor/PrescriptionsPage';
import { LabReportsPage } from './pages/doctor/LabReportsPage';
import { LabReportDetailPage } from './pages/doctor/LabReportDetailPage';
import { MessagesPage } from './pages/doctor/MessagesPage';
import { AnalyticsPage } from './pages/doctor/AnalyticsPage';
import { SettingsPage } from './pages/doctor/SettingsPage';

// Patient Pages
import { PatientHomePage } from './pages/patient/PatientHomePage';
import { PatientAppointmentsPage } from './pages/patient/PatientAppointmentsPage';
import { PatientDoctorsPage } from './pages/patient/PatientDoctorsPage';
import { PatientRecordsPage } from './pages/patient/PatientRecordsPage';
import { PatientPrescriptionsPage } from './pages/patient/PatientPrescriptionsPage';
import { PatientReportsPage } from './pages/patient/PatientReportsPage';
import { PatientMessagesPage } from './pages/patient/PatientMessagesPage';
import { PatientProfilePage as PatientSelfProfilePage } from './pages/patient/PatientProfilePage';

// Auth Page
import { LoginPage } from './pages/auth/LoginPage';

// Toast Notifications Component
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border border-slate-800 flex items-start justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-start gap-2.5">
            {toast.type === 'success' && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            {toast.type === 'info' && (
              <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h5 className="text-xs font-bold text-slate-100">{toast.title}</h5>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toast.message}</p>
            </div>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

const MainRouter: React.FC = () => {
  const { currentRoute, currentUserRole } = useApp();

  // Login page route
  if (currentRoute === '/login') {
    return <LoginPage />;
  }

  // Doctor routes
  if (currentUserRole === 'doctor') {
    let content = <DashboardPage />;

    if (currentRoute === '/dashboard' || currentRoute === '/') {
      content = <DashboardPage />;
    } else if (currentRoute === '/patients') {
      content = <PatientsPage />;
    } else if (currentRoute.startsWith('/patients/')) {
      const patientId = currentRoute.split('/patients/')[1];
      content = <PatientProfilePage patientId={patientId} />;
    } else if (currentRoute.startsWith('/consultations/')) {
      const patientId = currentRoute.split('/consultations/')[1];
      content = <ConsultationWorkspacePage patientId={patientId} />;
    } else if (currentRoute === '/appointments') {
      content = <AppointmentsPage />;
    } else if (currentRoute === '/calendar') {
      content = <CalendarPage />;
    } else if (currentRoute === '/prescriptions') {
      content = <PrescriptionsPage />;
    } else if (currentRoute === '/lab-reports') {
      content = <LabReportsPage />;
    } else if (currentRoute.startsWith('/lab-reports/')) {
      const reportId = currentRoute.split('/lab-reports/')[1];
      content = <LabReportDetailPage reportId={reportId} />;
    } else if (currentRoute === '/messages') {
      content = <MessagesPage />;
    } else if (currentRoute === '/analytics') {
      content = <AnalyticsPage />;
    } else if (currentRoute === '/settings') {
      content = <SettingsPage />;
    }

    return (
      <DoctorLayout>
        {content}
        <ToastContainer />
      </DoctorLayout>
    );
  }

  // Patient routes
  let patientContent = <PatientHomePage />;

  if (currentRoute === '/patient' || currentRoute === '/patient/home' || currentRoute === '/') {
    patientContent = <PatientHomePage />;
  } else if (currentRoute === '/patient/appointments') {
    patientContent = <PatientAppointmentsPage />;
  } else if (currentRoute === '/patient/doctors') {
    patientContent = <PatientDoctorsPage />;
  } else if (currentRoute === '/patient/records') {
    patientContent = <PatientRecordsPage />;
  } else if (currentRoute === '/patient/prescriptions') {
    patientContent = <PatientPrescriptionsPage />;
  } else if (currentRoute === '/patient/reports') {
    patientContent = <PatientReportsPage />;
  } else if (currentRoute === '/patient/messages') {
    patientContent = <PatientMessagesPage />;
  } else if (currentRoute === '/patient/profile') {
    patientContent = <PatientSelfProfilePage />;
  }

  return (
    <PatientLayout>
      {patientContent}
      <ToastContainer />
    </PatientLayout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
