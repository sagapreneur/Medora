import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppointmentStatus } from '../../types';
import {
  Calendar,
  Clock,
  Plus,
  MapPin,
  Stethoscope,
  XCircle,
  RotateCcw,
  CheckCircle2,
  CalendarCheck,
} from 'lucide-react';
import { AppointmentModal } from '../../components/ui/AppointmentModal';

export const PatientAppointmentsPage: React.FC = () => {
  const { currentPatient, appointments, updateAppointmentStatus } = useApp();
  const [tabFilter, setTabFilter] = useState<'Upcoming' | 'Past' | 'Cancelled'>('Upcoming');
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [reschedulingId, setReschedulingId] = useState<string | undefined>(undefined);

  const patientAppointments = appointments.filter((a) => a.patientId === currentPatient.id);

  const filteredAppointments = patientAppointments.filter((a) => {
    if (tabFilter === 'Cancelled') return a.status === 'Cancelled';
    if (tabFilter === 'Past') return a.status === 'Completed';
    return a.status === 'Confirmed' || a.status === 'Waiting' || a.status === 'In Consultation';
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Personal Health Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            My Appointments
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review your upcoming hospital appointments, book consultations with specialists, or reschedule slots.
          </p>
        </div>

        <button
          onClick={() => {
            setReschedulingId(undefined);
            setIsAppointmentModalOpen(true);
          }}
          className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Filter Tabs (Section 29) */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs max-w-md">
        {(['Upcoming', 'Past', 'Cancelled'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setTabFilter(tab)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center ${
              tabFilter === tab
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Appointments Cards List */}
      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              {/* Doctor & Clinic Meta */}
              <div className="flex items-start gap-4">
                <img
                  src={apt.doctorAvatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80'}
                  alt={apt.doctorName}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900">{apt.doctorName}</h3>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                      {apt.type}
                    </span>
                  </div>
                  <p className="text-xs text-teal-700 font-semibold">{apt.doctorSpecialty}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{apt.room || 'Suite 302, Heart Center'} • Reason: {apt.reason}</span>
                  </p>
                </div>
              </div>

              {/* Time & Action Group */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between md:justify-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-left sm:text-right">
                  <div className="text-xs font-bold text-slate-900 flex items-center sm:justify-end gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-700" />
                    <span>{apt.date}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-600 flex items-center sm:justify-end gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{apt.time}</span>
                  </div>
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded mt-1 inline-block">
                    Status: {apt.status}
                  </span>
                </div>

                {/* Patient actions */}
                {tabFilter === 'Upcoming' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setReschedulingId(apt.id);
                        setIsAppointmentModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reschedule</span>
                    </button>
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                      className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-500 text-xs">
            No {tabFilter.toLowerCase()} appointments found for your patient profile.
          </div>
        )}
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        initialPatientId={currentPatient.id}
        rescheduleAppointmentId={reschedulingId}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
    </div>
  );
};
