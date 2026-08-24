import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AppointmentStatus, AppointmentType } from '../../types';
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Plus,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  CalendarCheck,
} from 'lucide-react';
import { AppointmentModal } from '../../components/ui/AppointmentModal';

export const AppointmentsPage: React.FC = () => {
  const {
    appointments,
    updateAppointmentStatus,
    navigate,
    setActiveConsultationPatientId,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('All');
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [reschedulingId, setReschedulingId] = useState<string | undefined>(undefined);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const matchesSearch =
        a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.patientId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
      const matchesType = typeFilter === 'All' || a.type === typeFilter;
      const matchesDate =
        dateFilter === 'All' ||
        (dateFilter === 'Today' && a.date === '2026-08-24') ||
        (dateFilter === 'Upcoming' && a.date >= '2026-08-24');

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [appointments, searchQuery, statusFilter, typeFilter, dateFilter]);

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Waiting':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'In Consultation':
        return 'bg-teal-50 text-teal-800 border-teal-200 animate-pulse';
      case 'Confirmed':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Clinical Appointments & Triage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Appointments</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage scheduled patient visits, waiting queue, telemedicine consultations, and doctor calendars.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setReschedulingId(undefined);
              setIsAppointmentModalOpen(true);
            }}
            className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Appointment</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by patient name, doctor, reason, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Waiting">Waiting (In Clinic)</option>
              <option value="In Consultation">In Consultation</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            >
              <option value="All">All Visit Types</option>
              <option value="Consultation">Consultation</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Routine Checkup">Routine Checkup</option>
              <option value="Telehealth">Telehealth</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
        </div>

        {/* Date chips */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Date Scope:</span>
          {['All', 'Today', 'Upcoming'].map((d) => (
            <button
              key={d}
              onClick={() => setDateFilter(d)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                dateFilter === d
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="p-4">Patient</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Attending Doctor</th>
                <th className="p-4">Visit Type & Reason</th>
                <th className="p-4">Room</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Patient */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={apt.patientAvatar}
                          alt={apt.patientName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <button
                            onClick={() => navigate(`/patients/${apt.patientId}`)}
                            className="font-bold text-slate-900 text-sm hover:text-teal-700 text-left block"
                          >
                            {apt.patientName}
                          </button>
                          <span className="text-[11px] text-slate-500 font-mono">
                            #{apt.patientId.toUpperCase()} • {apt.patientAge}y
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{apt.date}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{apt.time}</span>
                      </div>
                    </td>

                    {/* Attending Doctor */}
                    <td className="p-4 font-semibold text-slate-900">{apt.doctorName}</td>

                    {/* Visit Type & Reason */}
                    <td className="p-4 max-w-xs">
                      <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded text-[10px] uppercase">
                        {apt.type}
                      </span>
                      <p className="text-xs text-slate-600 mt-1 truncate">{apt.reason}</p>
                    </td>

                    {/* Room */}
                    <td className="p-4 font-medium text-slate-600">{apt.room || 'Suite 302'}</td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                          apt.status
                        )}`}
                      >
                        {apt.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {apt.status === 'Waiting' && (
                          <button
                            onClick={() => {
                              updateAppointmentStatus(apt.id, 'In Consultation');
                              setActiveConsultationPatientId(apt.patientId);
                              navigate(`/consultations/${apt.patientId}`);
                            }}
                            className="px-2.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-2xs"
                            title="Call Patient to Consult"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Start</span>
                          </button>
                        )}

                        {apt.status === 'Confirmed' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'Waiting')}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold"
                            title="Mark Patient Checked In"
                          >
                            Check In
                          </button>
                        )}

                        {apt.status === 'In Consultation' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold"
                            title="Mark Completed"
                          >
                            Complete
                          </button>
                        )}

                        {/* Reschedule Button */}
                        {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                          <button
                            onClick={() => {
                              setReschedulingId(apt.id);
                              setIsAppointmentModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Reschedule Appointment"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Cancel button */}
                        {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Cancel Appointment"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500 text-xs">
                    No appointments matched the current filter configuration.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        rescheduleAppointmentId={reschedulingId}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
    </div>
  );
};
