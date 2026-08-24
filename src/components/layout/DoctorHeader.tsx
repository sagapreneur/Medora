import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Plus,
  FilePlus,
  Shield,
  CheckCheck,
  X,
  Menu,
  Stethoscope,
} from 'lucide-react';
import { AppointmentModal } from '../ui/AppointmentModal';

interface DoctorHeaderProps {
  onToggleMobileMenu?: () => void;
}

export const DoctorHeader: React.FC<DoctorHeaderProps> = ({ onToggleMobileMenu }) => {
  const {
    patients,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    navigate,
    isMaskingSensitiveData,
    toggleSensitiveDataMask,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredPatients = searchQuery.trim()
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.phone.includes(searchQuery)
      )
    : [];

  return (
    <>
      <header
        id="doctor-header"
        className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs shrink-0"
      >
        {/* Left side: Mobile menu toggle + Greeting / Practice Overview info */}
        <div className="flex items-center gap-4 min-w-0">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="hidden sm:block">
            <h1 className="text-base sm:text-lg font-semibold text-slate-900 leading-tight truncate">
              Good morning, Dr. Mehta
            </h1>
            <p className="text-xs text-slate-500">Monday, 24 August 2026 • Practice Overview</p>
          </div>
        </div>

        {/* Center/Right: Search bar + Actions + Avatar */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 justify-end max-w-xl">
          <div className="relative w-full max-w-xs">
            <div className="relative flex items-center">
              <input
                id="global-patient-search"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                placeholder="Search patients..."
                className="bg-slate-100 border-none rounded-full py-1.5 pl-10 pr-8 text-sm w-full focus:ring-2 focus:ring-[#0D9488] focus:bg-white text-slate-800 placeholder-slate-400 transition-all outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Autocomplete Dropdown */}
            {showSearchResults && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto">
                <div className="p-2.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Matching Patients ({filteredPatients.length})
                </div>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        navigate(`/patients/${p.id}`);
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                      className="w-full p-2.5 hover:bg-slate-50 flex items-center justify-between text-left transition-colors border-b border-slate-50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                            <span>{p.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">#{p.id.toUpperCase()}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {p.age}y, {p.gender} • {p.bloodGroup} • {p.chronicConditions.join(', ') || 'No chronic records'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-[#0D9488] bg-teal-50 px-2 py-0.5 rounded-md">
                        View Chart
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No matching patient records found for &quot;{searchQuery}&quot;.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Privacy masking badge */}
          <button
            onClick={toggleSensitiveDataMask}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
              isMaskingSensitiveData
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
            title="Privacy status"
          >
            <Shield className="w-3.5 h-3.5 text-[#0D9488]" />
            <span>{isMaskingSensitiveData ? 'PHI Masked' : 'PHI Live'}</span>
          </button>

          {/* Quick Schedule Appointment */}
          <button
            id="header-btn-schedule-appointment"
            onClick={() => setIsAppointmentModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#0D9488] hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Schedule</span>
          </button>

          {/* Notifications button & dropdown */}
          <div className="relative">
            <button
              id="header-notifications-bell"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#0D9488] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Clinical Alerts</h4>
                    <span className="bg-teal-100 text-[#0D9488] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount} unread
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-[#0D9488] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.link) {
                          navigate(notif.link);
                          setShowNotifications(false);
                        }
                      }}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-xs flex gap-3 ${
                        !notif.read ? 'bg-teal-50/50' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            !notif.read ? 'bg-[#0D9488]' : 'bg-slate-300'
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-slate-900">{notif.title}</h5>
                          <span className="text-[10px] text-slate-400">{notif.time}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5">{notif.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/messages');
                    }}
                    className="text-xs font-semibold text-[#0D9488] hover:underline"
                  >
                    View Internal Communications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar Pill */}
          <div className="w-8 h-8 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center text-xs font-bold border border-slate-300 shrink-0">
            VM
          </div>
        </div>
      </header>

      {/* Reusable Appointment Scheduler Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
    </>
  );
};
