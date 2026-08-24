import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, Calendar, FileText, MessageSquare, User } from 'lucide-react';

export const PatientBottomNav: React.FC = () => {
  const { currentRoute, navigate, conversations } = useApp();

  const unreadCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const navItems = [
    { label: 'Home', path: '/patient', icon: Activity },
    { label: 'Appointments', path: '/patient/appointments', icon: Calendar },
    { label: 'Records', path: '/patient/records', icon: FileText },
    {
      label: 'Messages',
      path: '/patient/messages',
      icon: MessageSquare,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { label: 'Profile', path: '/patient/profile', icon: User },
  ];

  return (
    <nav
      id="patient-mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-2 py-1.5 shadow-lg flex items-center justify-around"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = currentRoute === item.path;

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all relative ${
              active ? 'text-[#0D9488] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${active ? 'text-[#0D9488]' : 'text-slate-500'}`} />
              {item.badge && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
