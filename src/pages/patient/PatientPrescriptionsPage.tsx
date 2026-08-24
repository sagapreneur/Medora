import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Prescription } from '../../types';
import {
  Pill,
  Search,
  Printer,
  Calendar,
  User,
  Clock,
  FileText,
  Download,
  AlertCircle,
} from 'lucide-react';
import { PrescriptionSlipModal } from '../../components/ui/PrescriptionSlipModal';

export const PatientPrescriptionsPage: React.FC = () => {
  const { currentPatient, prescriptions } = useApp();
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const patientPrescriptions = prescriptions.filter((p) => p.patientId === currentPatient.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
            <Pill className="w-3.5 h-3.5" />
            <span>My Prescribed Medications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Prescriptions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access active drug posology instructions, dosage timings, and certified electronic prescription slips.
          </p>
        </div>
      </div>

      {/* Prescriptions List (Section 32) */}
      <div className="space-y-4">
        {patientPrescriptions.map((rx) => (
          <div
            key={rx.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-serif italic text-xl font-bold border border-teal-200">
                  ℞
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{rx.diagnosis}</h3>
                  <p className="text-xs text-slate-500">
                    Prescribed by <strong className="text-slate-800">{rx.doctorName}</strong> ({rx.doctorSpecialty})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-center">
                <span className="text-xs font-mono text-slate-500">{rx.date}</span>
                <button
                  onClick={() => setSelectedPrescription(rx)}
                  className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>View Official Slip</span>
                </button>
              </div>
            </div>

            {/* Medicines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {rx.medications.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-2 text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>
                    <span className="text-teal-700 font-semibold block">{m.dosage}</span>
                    <p className="text-slate-600 text-[11px] mt-1">{m.instructions}</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded text-[10px] block">
                      {m.frequency}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-1">
                      {m.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Advice / Special Instructions */}
            {rx.instructions && (
              <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs text-amber-950">
                <strong>Doctor&apos;s Advice: </strong>
                <span>{rx.instructions}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Prescription Slip Printable Modal */}
      <PrescriptionSlipModal
        prescription={selectedPrescription}
        isOpen={!!selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
      />
    </div>
  );
};
