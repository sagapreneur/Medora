import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  HeartPulse,
  Calendar,
  UserRound,
  FileText,
  FlaskConical,
  MessageSquare,
  User,
  Shield,
  Activity,
} from 'lucide-react';

export const PatientNavbar: React.FC = () => {
  const { currentRoute, navigate, currentPatient, conversations } = useApp();

  const unreadCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const navLinks = [
    { label: 'Home', path: '/patient', icon: Activity },
    { label: 'Appointments', path: '/patient/appointments', icon: Calendar },
    { label: 'Doctors', path: '/patient/doctors', icon: UserRound },
    { label: 'Records', path: '/patient/records', icon: FileText },
    { label: 'Prescriptions', path: '/patient/prescriptions', icon: FileText },
    { label: 'Reports', path: '/patient/reports', icon: FlaskConical },
    {
      label: 'Messages',
      path: '/patient/messages',
      icon: MessageSquare,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { label: 'Profile', path: '/patient/profile', icon: User },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/patient')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-8 h-8 rounded-md bg-[#0D9488] text-white flex items-center justify-center font-bold shadow-xs">
                M
              </div>
              <div>
                <span className="font-bold text-base text-[#1E293B] tracking-tight flex items-center gap-1.5">
                  Medora
                  <span className="text-[10px] uppercase font-semibold tracking-wider bg-teal-50 text-[#0D9488] px-2 py-0.5 rounded-full border border-teal-200">
                    Patient Portal
                  </span>
                </span>
                <p className="text-[11px] text-slate-500 font-medium">Health & Care Center</p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = currentRoute === link.path;

              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all relative ${
                    active
                      ? 'bg-[#0D9488] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-slate-500'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Patient Quick Profile Header */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-right">
              <div>
                <h4 className="text-xs font-bold text-slate-900">{currentPatient.name}</h4>
                <p className="text-[11px] text-slate-500 font-mono">
                  ID: #{currentPatient.id.toUpperCase()} • {currentPatient.bloodGroup}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/patient/profile')}
              className="p-0.5 rounded-xl border border-slate-200 hover:border-teal-400 transition-colors"
            >
              <img
                src={currentPatient.avatar}
                alt={currentPatient.name}
                className="w-9 h-9 rounded-xl object-cover"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
