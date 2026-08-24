import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  Pill,
  FlaskConical,
  UserRound,
  MessageSquare,
  ChevronRight,
  HeartPulse,
  Activity,
  Plus,
  Phone,
  MapPin,
  FileText,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { AppointmentModal } from '../../components/ui/AppointmentModal';
import { PrescriptionSlipModal } from '../../components/ui/PrescriptionSlipModal';
import { Prescription } from '../../types';

export const PatientHomePage: React.FC = () => {
  const {
    currentPatient,
    appointments,
    prescriptions,
    labReports,
    doctors,
    navigate,
    addToast,
  } = useApp();

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  // Patient appointments & prescriptions
  const patientAppointments = appointments.filter((a) => a.patientId === currentPatient.id);
  const nextAppointment = patientAppointments.find(
    (a) => a.status === 'Confirmed' || a.status === 'Waiting'
  ) || patientAppointments[0];

  const patientPrescriptions = prescriptions.filter((p) => p.patientId === currentPatient.id);
  const latestPrescription = patientPrescriptions[0];

  const patientReports = labReports.filter((r) => r.patientId === currentPatient.id);

  return (
    <div className="space-y-6">
      {/* Patient Welcome Banner (Section 24) */}
      <div className="bg-linear-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Medora Health Hub • Patient Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Good morning, {currentPatient.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-teal-100/90 mt-1 leading-relaxed">
            Welcome to your personalized healthcare dashboard. Review your upcoming clinical consultations, active prescription schedules, and verified lab results.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="px-4 py-2.5 bg-white text-teal-900 hover:bg-teal-50 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-teal-700" />
              <span>Book Appointment</span>
            </button>
            <button
              onClick={() => navigate('/patient/doctors')}
              className="px-4 py-2.5 bg-teal-800/80 hover:bg-teal-700 text-white border border-teal-600 rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
            >
              <UserRound className="w-4 h-4" />
              <span>Find Specialists</span>
            </button>
          </div>
        </div>

        {/* Decorative background pulse icon */}
        <HeartPulse className="absolute -right-8 -bottom-8 w-64 h-64 text-white/5 pointer-events-none" />
      </div>

      {/* Quick Action Shortcuts Grid (Section 26) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setIsAppointmentModalOpen(true)}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-teal-500 hover:shadow-xs transition-all text-left flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-colors">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-xs font-bold text-slate-900 block group-hover:text-teal-800">
              Book Visit
            </strong>
            <span className="text-[11px] text-slate-500">Pick doctor & time</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/patient/prescriptions')}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-teal-500 hover:shadow-xs transition-all text-left flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white transition-colors">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-xs font-bold text-slate-900 block group-hover:text-teal-800">
              Prescriptions
            </strong>
            <span className="text-[11px] text-slate-500">
              {patientPrescriptions.length} Active Rx
            </span>
          </div>
        </button>

        <button
          onClick={() => navigate('/patient/reports')}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-teal-500 hover:shadow-xs transition-all text-left flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-700 group-hover:text-white transition-colors">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-xs font-bold text-slate-900 block group-hover:text-teal-800">
              Lab Reports
            </strong>
            <span className="text-[11px] text-slate-500">{patientReports.length} Reports</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/patient/messages')}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-teal-500 hover:shadow-xs transition-all text-left flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-xs font-bold text-slate-900 block group-hover:text-teal-800">
              Doctor Chat
            </strong>
            <span className="text-[11px] text-slate-500">Direct clinic inquiry</span>
          </div>
        </button>
      </div>

      {/* Main Grid: Next Upcoming Appointment + Active Prescriptions + Vitals (Section 25, 27, 28) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Next Upcoming Appointment Card (Section 25) (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Next Scheduled Appointment</span>
              </span>
              <span className="text-[10px] bg-teal-50 text-teal-800 font-bold px-2 py-0.5 rounded-full border border-teal-200">
                {nextAppointment?.status || 'Confirmed'}
              </span>
            </div>

            {nextAppointment ? (
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <img
                    src={nextAppointment.doctorAvatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80'}
                    alt={nextAppointment.doctorName}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{nextAppointment.doctorName}</h3>
                    <p className="text-xs text-teal-700 font-semibold">{nextAppointment.doctorSpecialty}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{nextAppointment.room || 'Suite 302, Heart Center'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-center sm:text-right">
                  <div className="text-xs font-bold text-slate-900 flex items-center justify-center sm:justify-end gap-1.5">
                    <Clock className="w-4 h-4 text-teal-700" />
                    <span>{nextAppointment.date}</span>
                  </div>
                  <span className="text-sm font-extrabold text-teal-800 block mt-0.5">
                    {nextAppointment.time}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{nextAppointment.type}</span>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                No upcoming consultations scheduled.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Checked in via Digital Verification</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAppointmentModalOpen(true)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Reschedule
              </button>
              <button
                onClick={() => addToast('Check In', 'You are marked waiting in clinic lounge.', 'success')}
                className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-all"
              >
                Clinic Check-In
              </button>
            </div>
          </div>
        </div>

        {/* Health Vitals Summary Card (Section 28) (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>Personal Vitals Baseline</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Recorded {currentPatient.vitals.recordedAt}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Blood Pressure</span>
              <strong className="text-base font-bold text-slate-900">{currentPatient.vitals.bloodPressure}</strong>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Optimal Range</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Heart Rate</span>
              <strong className="text-base font-bold text-slate-900">{currentPatient.vitals.heartRate} bpm</strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">Resting Normal</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Blood Group</span>
              <strong className="text-base font-bold text-teal-800">{currentPatient.bloodGroup}</strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">Rh Positive</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Body Weight</span>
              <strong className="text-base font-bold text-slate-900">{currentPatient.vitals.weight} kg</strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">BMI: {currentPatient.vitals.bmi}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Prescription Reminders & Recent Lab Results (Section 27) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Prescriptions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Pill className="w-4 h-4 text-teal-600" />
              <span>Active Prescription Schedule</span>
            </h3>
            <button
              onClick={() => navigate('/patient/prescriptions')}
              className="text-xs text-teal-700 hover:underline font-semibold"
            >
              View All ({patientPrescriptions.length})
            </button>
          </div>

          {latestPrescription ? (
            <div className="space-y-2.5">
              <div className="text-xs text-slate-500 flex items-center justify-between">
                <span>Prescribed by {latestPrescription.doctorName}</span>
                <span className="font-mono">{latestPrescription.date}</span>
              </div>

              {latestPrescription.medications.map((med) => (
                <div
                  key={med.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <strong className="text-slate-900 block">{med.name}</strong>
                    <span className="text-slate-500 text-[11px]">{med.instructions}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                      {med.frequency}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{med.duration}</span>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setSelectedPrescription(latestPrescription)}
                className="w-full py-2 bg-slate-50 hover:bg-teal-50 border border-slate-200 text-teal-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Official Prescription Slip</span>
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-4">No active prescriptions.</p>
          )}
        </div>

        {/* Recent Lab Diagnostics */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-teal-600" />
              <span>Recent Diagnostic Reports</span>
            </h3>
            <button
              onClick={() => navigate('/patient/reports')}
              className="text-xs text-teal-700 hover:underline font-semibold"
            >
              View Reports
            </button>
          </div>

          <div className="space-y-2.5">
            {patientReports.slice(0, 3).map((rep) => (
              <div
                key={rep.id}
                onClick={() => navigate(`/patient/reports`)}
                className="p-3 bg-slate-50 hover:bg-teal-50/50 rounded-xl border border-slate-100 flex items-center justify-between text-xs cursor-pointer transition-colors"
              >
                <div>
                  <strong className="text-slate-900 block">{rep.testName}</strong>
                  <span className="text-slate-500 text-[11px]">{rep.laboratory} • {rep.reportDate}</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {rep.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        initialPatientId={currentPatient.id}
        onClose={() => setIsAppointmentModalOpen(false)}
      />

      {/* Prescription Slip Printable Modal */}
      <PrescriptionSlipModal
        prescription={selectedPrescription}
        isOpen={!!selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
      />
    </div>
  );
};
