import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CalendarDays,
  Stethoscope,
  FileText,
  FlaskConical,
  MessageSquare,
  BarChart3,
  Settings,
  HeartPulse,
  LogOut,
  ChevronRight,
} from 'lucide-react';

export const DoctorSidebar: React.FC = () => {
  const { currentRoute, navigate, appointments, conversations } = useApp();

  const waitingAppointmentsCount = appointments.filter((a) => a.status === 'Waiting').length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Patients', path: '/patients', icon: Users },
    {
      label: 'Appointments',
      path: '/appointments',
      icon: Calendar,
      badge: waitingAppointmentsCount > 0 ? `${waitingAppointmentsCount}` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    { label: 'Calendar', path: '/calendar', icon: CalendarDays },
    { label: 'Consultations', path: '/consultations', icon: Stethoscope },
    { label: 'Prescriptions', path: '/prescriptions', icon: FileText },
    { label: 'Lab Reports', path: '/lab-reports', icon: FlaskConical },
    {
      label: 'Messages',
      path: '/messages',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? `${unreadMessagesCount}` : undefined,
      badgeColor: 'bg-[#0D9488]/30 text-teal-300 border-teal-500/40',
    },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const isCurrent = (path: string) => {
    if (path === '/dashboard') return currentRoute === '/dashboard' || currentRoute === '/';
    if (path === '/consultations') return currentRoute.startsWith('/consultations');
    if (path === '/patients') return currentRoute.startsWith('/patients');
    if (path === '/lab-reports') return currentRoute.startsWith('/lab-reports');
    return currentRoute === path;
  };

  return (
    <aside
      id="doctor-sidebar"
      className="w-64 bg-[#0F172A] flex flex-col justify-between shrink-0 select-none text-slate-300 min-h-[calc(100vh-36px)] border-r border-slate-800"
    >
      {/* Brand logo & workspace info */}
      <div>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#0D9488] rounded-md flex items-center justify-center font-bold text-white shadow-sm">
            M
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Medora</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium truncate max-w-[140px]">
              Clinical Workspace
            </p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrent(item.path);

            return (
              <button
                key={item.path}
                id={`sidebar-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#0D9488] text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.badge ? (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                ) : active ? (
                  <ChevronRight className="w-3.5 h-3.5 text-teal-200 opacity-80" />
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Doctor profile card at bottom */}
      <div className="p-4 border-t border-slate-800 bg-[#0B1120]/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
            VM
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">Dr. Vikram Mehta</h4>
            <p className="text-[11px] text-[#2DD4BF] truncate">Cardiology Suite 302</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              <span className="text-[10px] text-slate-400 font-medium">On Duty</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/login')}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
