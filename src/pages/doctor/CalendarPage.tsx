import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  User,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { AppointmentModal } from '../../components/ui/AppointmentModal';

export const CalendarPage: React.FC = () => {
  const { appointments, navigate } = useApp();
  const [viewMode, setViewMode] = useState<'Day' | 'Week' | 'Month'>('Week');
  const [selectedDate, setSelectedDate] = useState('2026-08-24');
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const daysOfWeek = [
    { name: 'Mon', date: '2026-08-24', isToday: true },
    { name: 'Tue', date: '2026-08-25', isToday: false },
    { name: 'Wed', date: '2026-08-26', isToday: false },
    { name: 'Thu', date: '2026-08-27', isToday: false },
    { name: 'Fri', date: '2026-08-28', isToday: false },
    { name: 'Sat', date: '2026-08-29', isToday: false },
    { name: 'Sun', date: '2026-08-30', isToday: false },
  ];

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Master Clinical Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Calendar</h1>
          <p className="text-sm text-slate-500 mt-1">
            View room allocations, clinical shifts, and patient consult appointments across days and weeks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View mode toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['Day', 'Week', 'Month'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === mode
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAppointmentModalOpen(true)}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Slot</span>
          </button>
        </div>
      </div>

      {/* Week Header Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-slate-900">
            August 24 – August 30, 2026
          </h2>
          <span className="text-xs bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-semibold border border-teal-200">
            Week 35
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSelectedDate('2026-08-24')}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
          >
            Today
          </button>
          <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50/80 text-center text-xs">
          <div className="p-3 border-r border-slate-200 font-bold text-slate-400">Time</div>
          {daysOfWeek.map((day) => (
            <div
              key={day.date}
              className={`p-3 border-r border-slate-200 last:border-r-0 cursor-pointer ${
                day.isToday ? 'bg-teal-50/70 text-teal-900 font-bold' : 'text-slate-700'
              }`}
              onClick={() => setSelectedDate(day.date)}
            >
              <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                {day.name}
              </span>
              <span
                className={`inline-block mt-0.5 text-sm font-bold w-7 h-7 leading-7 rounded-full ${
                  day.isToday ? 'bg-teal-700 text-white shadow-xs' : ''
                }`}
              >
                {day.date.split('-')[2]}
              </span>
            </div>
          ))}
        </div>

        {/* Time Slots Grid */}
        <div className="divide-y divide-slate-100">
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-8 min-h-[72px]">
              {/* Left Time label */}
              <div className="p-2 border-r border-slate-100 text-[11px] font-mono font-semibold text-slate-400 flex items-start justify-center">
                {time}
              </div>

              {/* Day cells */}
              {daysOfWeek.map((day) => {
                const matchedApts = appointments.filter(
                  (a) => a.date === day.date && a.time.includes(time.substring(0, 5))
                );

                return (
                  <div
                    key={day.date + time}
                    className="p-1 border-r border-slate-100 last:border-r-0 hover:bg-slate-50/60 transition-colors relative"
                  >
                    {matchedApts.map((apt) => (
                      <div
                        key={apt.id}
                        onClick={() => navigate(`/patients/${apt.patientId}`)}
                        className="p-2 bg-teal-50 border border-teal-200 hover:border-teal-400 rounded-xl text-left cursor-pointer transition-all shadow-2xs hover:shadow-xs group"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <strong className="text-slate-900 group-hover:text-teal-800 truncate">
                            {apt.patientName}
                          </strong>
                          <span className="text-[9px] font-bold text-teal-800 bg-teal-100 px-1 py-0.2 rounded">
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{apt.type}</p>
                        <div className="text-[9px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{apt.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
    </div>
  );
};
