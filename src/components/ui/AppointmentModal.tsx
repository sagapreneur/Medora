import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppointmentType } from '../../types';
import { X, Calendar as CalendarIcon, Clock, User, Stethoscope, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPatientId?: string;
  initialDoctorId?: string;
  rescheduleAppointmentId?: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  initialPatientId,
  initialDoctorId,
  rescheduleAppointmentId,
}) => {
  const { patients, doctors, appointments, addAppointment, rescheduleAppointment } = useApp();

  const existingAppointment = rescheduleAppointmentId
    ? appointments.find((a) => a.id === rescheduleAppointmentId)
    : null;

  const [patientId, setPatientId] = useState(
    existingAppointment ? existingAppointment.patientId : initialPatientId || patients[0]?.id || ''
  );
  const [doctorId, setDoctorId] = useState(
    existingAppointment ? existingAppointment.doctorId : initialDoctorId || doctors[0]?.id || ''
  );
  const [date, setDate] = useState(existingAppointment?.date || '2026-08-25');
  const [time, setTime] = useState(existingAppointment?.time || '10:00 AM');
  const [type, setType] = useState<AppointmentType>(existingAppointment?.type || 'Consultation');
  const [reason, setReason] = useState(existingAppointment?.reason || '');
  const [notes, setNotes] = useState(existingAppointment?.notes || '');
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedDoctor = doctors.find((d) => d.id === doctorId) || doctors[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorId || !date || !time) return;

    if (rescheduleAppointmentId) {
      rescheduleAppointment(rescheduleAppointmentId, date, time);
    } else {
      addAppointment({
        patientId,
        doctorId,
        date,
        time,
        type,
        reason: reason || `${type} with ${selectedDoctor.name}`,
        notes,
      });
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-base">
                  {rescheduleAppointmentId ? 'Reschedule Appointment' : 'Schedule New Appointment'}
                </h3>
                <p className="text-xs text-slate-500">
                  {rescheduleAppointmentId ? 'Update clinical slot time & date' : 'Book a verified medical slot'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          {isSuccess ? (
            <div className="p-10 flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 border border-emerald-200"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>
              <h4 className="text-lg font-bold text-slate-900">
                {rescheduleAppointmentId ? 'Appointment Rescheduled!' : 'Appointment Confirmed!'}
              </h4>
              <p className="text-sm text-slate-600 mt-1 max-w-xs">
                Notification dispatched to patient and synchronized with Dr. {selectedDoctor?.name}&apos;s schedule.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              {/* Patient Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  Select Patient
                </label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  disabled={!!rescheduleAppointmentId}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all disabled:opacity-60"
                  required
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.age}y, {p.gender}) — #{p.id.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-slate-500" />
                  Attending Doctor & Specialty
                </label>
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  disabled={!!rescheduleAppointmentId}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all disabled:opacity-60"
                  required
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialty} ({d.room})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Available Time Slot
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                    required
                  >
                    {selectedDoctor.availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Appointment Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Appointment Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['Consultation', 'Follow-up', 'Routine Checkup', 'Emergency', 'Telehealth'] as AppointmentType[]).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setType(t)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                        type === t
                          ? 'bg-teal-50 border-teal-500 text-teal-800 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Primary Clinical Reason / Chief Complaint
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hypertension 3-month review, Chest tightness"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                  required
                />
              </div>

              {/* Clinical Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Internal Clinic Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Any triage instructions or requested pre-tests..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white resize-none"
                />
              </div>

              {/* Footer CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all flex items-center gap-2"
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>{rescheduleAppointmentId ? 'Confirm Rescheduling' : 'Schedule Appointment'}</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
