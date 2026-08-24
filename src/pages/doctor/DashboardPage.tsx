import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppointmentStatus } from '../../types';
import {
  Calendar,
  Clock,
  UserCheck,
  FileCheck2,
  Users,
  ChevronRight,
  Play,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  ArrowUpRight,
  FileText,
  Activity,
  HeartPulse,
} from 'lucide-react';
import { AppointmentModal } from '../../components/ui/AppointmentModal';

export const DashboardPage: React.FC = () => {
  const {
    appointments,
    updateAppointmentStatus,
    navigate,
    patients,
    labReports,
    setActiveConsultationPatientId,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  // Today's appointments (filter for today's date: 2026-08-24 or top appointments)
  const todaysAppointments = appointments.filter(
    (a) => a.date === '2026-08-24' || a.date === 'Today'
  );

  const waitingCount = todaysAppointments.filter((a) => a.status === 'Waiting').length;
  const inConsultCount = todaysAppointments.filter((a) => a.status === 'In Consultation').length;
  const completedCount = todaysAppointments.filter((a) => a.status === 'Completed').length;
  const followUpCount = todaysAppointments.filter((a) => a.type === 'Follow-up').length;

  const filteredList = todaysAppointments.filter((a) => {
    if (statusFilter === 'All') return true;
    return a.status === statusFilter;
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Waiting':
        return 'bg-amber-50 text-amber-700';
      case 'In Consultation':
        return 'bg-blue-50 text-blue-700 tracking-tighter';
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700';
      case 'Completed':
        return 'bg-slate-100 text-slate-600';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const handleStartConsultation = (appointment: typeof appointments[0]) => {
    updateAppointmentStatus(appointment.id, 'In Consultation');
    setActiveConsultationPatientId(appointment.patientId);
    navigate(`/consultations/${appointment.patientId}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Grid (Design HTML pattern) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today&apos;s Apps</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-[#1E293B]">18</span>
            <span className="text-xs text-green-600 font-medium">+3 from yesterday</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Waiting Patients</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-[#1E293B]">{waitingCount || 4}</span>
            <span className="text-xs text-amber-600 font-medium">Immediate attention</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Reports</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-[#1E293B]">7</span>
            <span className="text-xs text-blue-600 font-medium">Review required</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Follow-ups</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-[#1E293B]">12</span>
            <span className="text-xs text-slate-400 font-medium">This week</span>
          </div>
        </div>
      </div>

      {/* Main Flex/Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Appointments Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-0">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-800 text-base">Today&apos;s Appointments</h2>
              <p className="text-xs text-slate-500 mt-0.5">Live clinical triage and schedule timeline</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                {['All', 'Waiting', 'Confirmed', 'In Consultation'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-2.5 py-1 rounded-md font-medium text-xs transition-all ${
                      statusFilter === s
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                onClick={() => navigate('/appointments')}
                className="text-xs font-semibold text-[#0D9488] hover:underline shrink-0"
              >
                View All
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white">
                <tr className="text-xs font-semibold text-slate-400 uppercase border-b border-slate-50">
                  <th className="p-4 pl-6">Patient</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-50">
                {filteredList.length > 0 ? (
                  filteredList.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={apt.patientAvatar}
                            alt={apt.patientName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <button
                              onClick={() => navigate(`/patients/${apt.patientId}`)}
                              className="font-semibold text-slate-900 hover:text-[#0D9488] text-left text-xs sm:text-sm"
                            >
                              {apt.patientName}
                            </button>
                            <p className="text-[10px] text-slate-400">
                              {apt.patientAge}y • {apt.patientBloodGroup || 'O+'} • {apt.reason}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 text-xs">{apt.type}</td>
                      <td className="p-4 font-mono text-xs text-slate-700">{apt.time}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase inline-block ${getStatusBadge(
                            apt.status
                          )}`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {apt.status === 'Waiting' && (
                            <button
                              onClick={() => handleStartConsultation(apt)}
                              className="px-2.5 py-1 bg-[#0D9488] hover:bg-teal-700 text-white rounded-md text-xs font-semibold shadow-xs flex items-center gap-1"
                              title="Call patient and open consultation notes"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Start</span>
                            </button>
                          )}
                          {apt.status === 'In Consultation' && (
                            <button
                              onClick={() => {
                                setActiveConsultationPatientId(apt.patientId);
                                navigate(`/consultations/${apt.patientId}`);
                              }}
                              className="px-2.5 py-1 bg-[#0F172A] hover:bg-slate-800 text-white rounded-md text-xs font-semibold flex items-center gap-1"
                            >
                              <span>Resume</span>
                            </button>
                          )}
                          {apt.status === 'Confirmed' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'Waiting')}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium"
                              title="Mark as arrived"
                            >
                              Waiting
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/patients/${apt.patientId}`)}
                            className="text-slate-400 hover:text-slate-700 p-1"
                            title="View Chart"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-xs text-slate-400">
                      No appointments found matching this status filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Recent Activity & Medora AI Assistant Card */}
        <div className="space-y-6 flex flex-col">
          {/* Recent Activity Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-bold text-slate-800 mb-4 text-sm">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-[#0D9488] mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Prescription sent to Rohan K.</p>
                  <p className="text-[10px] text-slate-400">12 minutes ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Lab results uploaded: Sanya Khan</p>
                  <p className="text-[10px] text-slate-400">45 minutes ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Appt updated: Amit Jain</p>
                  <p className="text-[10px] text-slate-400">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Medora AI Assistant Card (Natural Tones Design Highlight) */}
          <div className="bg-[#0D9488] rounded-xl shadow-sm p-5 text-white flex-1 flex flex-col justify-between min-h-[220px]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-teal-200" />
                <h2 className="font-bold text-lg leading-tight text-white">Medora AI Assistant</h2>
              </div>
              <p className="text-xs text-white/85 leading-relaxed">
                7 patients are overdue for their chronic care follow-up. Would you like to send reminders?
              </p>
            </div>
            <div className="space-y-2 mt-4">
              <button
                onClick={() => navigate('/patients')}
                className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold transition-colors text-white text-center"
              >
                Review List
              </button>
              <button
                onClick={() => navigate('/messages')}
                className="w-full py-2 bg-white text-[#0D9488] hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors shadow-xs text-center"
              >
                Send Auto-Reminders
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Scheduler Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
    </div>
  );
};
