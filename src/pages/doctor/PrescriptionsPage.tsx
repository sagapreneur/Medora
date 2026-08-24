import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Prescription } from '../../types';
import {
  FileText,
  Search,
  Plus,
  Printer,
  Calendar,
  User,
  Stethoscope,
  Pill,
  ArrowUpRight,
} from 'lucide-react';
import { PrescriptionSlipModal } from '../../components/ui/PrescriptionSlipModal';

export const PrescriptionsPage: React.FC = () => {
  const { prescriptions, navigate } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const filteredPrescriptions = prescriptions.filter(
    (p) =>
      p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
            <Pill className="w-3.5 h-3.5" />
            <span>Official Electronic Prescriptions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Prescriptions</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse, search, verify and print certified medication orders and therapy posology slips.
          </p>
        </div>

        <button
          onClick={() => navigate('/consultations/pat-1')}
          className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Prescription</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by patient name, diagnosis, medicine, or prescription #ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Prescriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrescriptions.map((rx) => (
          <div
            key={rx.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-serif italic text-lg font-bold border border-teal-200">
                    ℞
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{rx.patientName}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      #{rx.id} • {rx.patientAge}y, {rx.patientGender}
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="font-mono text-slate-500">{rx.date}</span>
                  <span className="block text-[11px] text-teal-700 font-medium">{rx.doctorName}</span>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="mt-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Diagnosis
                </span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{rx.diagnosis}</p>
              </div>

              {/* Medicines Summary */}
              <div className="mt-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Prescribed Medicines ({rx.medications.length})
                </span>
                <div className="space-y-1.5">
                  {rx.medications.map((m) => (
                    <div
                      key={m.id}
                      className="p-2 bg-slate-50 rounded-xl text-xs flex items-center justify-between"
                    >
                      <div>
                        <strong className="text-slate-900">{m.name}</strong>
                        <span className="text-slate-500 text-[11px] block">{m.dosage}</span>
                      </div>
                      <span className="text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-semibold text-[10px]">
                        {m.frequency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Follow-up: {rx.followUpDate || 'As advised'}
              </span>

              <button
                onClick={() => setSelectedPrescription(rx)}
                className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>View & Print Slip</span>
              </button>
            </div>
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
