import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Calendar,
  Stethoscope,
  Pill,
  FlaskConical,
  Heart,
  ShieldCheck,
  Download,
} from 'lucide-react';

export const PatientRecordsPage: React.FC = () => {
  const { currentPatient, appointments, prescriptions, labReports, addToast } = useApp();

  const handleDownloadSummary = () => {
    addToast('Health Summary', 'Consolidated Medical History PDF downloaded.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Unified Electronic Health Record</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Health Records</h1>
          <p className="text-sm text-slate-500 mt-1">
            Access your longitudinal medical timeline, past clinical encounter summaries, diagnoses, and treatments.
          </p>
        </div>

        <button
          onClick={handleDownloadSummary}
          className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download Health Record PDF</span>
        </button>
      </div>

      {/* Clinical Timeline (Section 31) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
        <h3 className="font-bold text-base text-slate-900">Clinical History & Encounter Timeline</h3>

        <div className="border-l-2 border-teal-600 ml-4 pl-6 space-y-8">
          {/* Encounter 1 */}
          <div className="relative">
            <span className="w-4 h-4 bg-teal-700 rounded-full absolute -left-[33px] top-1 border-4 border-white shadow-xs"></span>
            <div className="flex items-center gap-2 text-xs text-teal-700 font-bold font-mono">
              <span>18 August 2026</span>
              <span>•</span>
              <span className="text-slate-500">Dr. Vikram Mehta (Cardiology)</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-1">
              Hypertension 3-Month Follow-Up & Holter Order
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Assessment of resting BP (128/84 mmHg). Telmisartan 40mg prescribed alongside Amlodipine 5mg. Dietary sodium restriction reiterated.
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="bg-teal-50 text-teal-800 font-semibold px-2 py-0.5 rounded text-[11px]">
                Rx: Telmisartan 40mg
              </span>
              <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[11px]">
                Order: Lipid Panel
              </span>
            </div>
          </div>

          {/* Encounter 2 */}
          <div className="relative">
            <span className="w-4 h-4 bg-teal-700 rounded-full absolute -left-[33px] top-1 border-4 border-white shadow-xs"></span>
            <div className="flex items-center gap-2 text-xs text-teal-700 font-bold font-mono">
              <span>20 July 2026</span>
              <span>•</span>
              <span className="text-slate-500">Dr. Marcus Vance (General Medicine)</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-1">
              Annual Comprehensive Executive Health Checkup
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Full biochemical profile and resting ECG completed. Fasting blood sugar verified at 94 mg/dL. Renal profile within optimal benchmarks.
            </p>
          </div>

          {/* Encounter 3 */}
          <div className="relative">
            <span className="w-4 h-4 bg-slate-400 rounded-full absolute -left-[33px] top-1 border-4 border-white shadow-xs"></span>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold font-mono">
              <span>12 May 2025</span>
              <span>•</span>
              <span className="text-slate-500">Dr. Vikram Mehta (Cardiology)</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-1">
              Initial Stage 1 Essential Hypertension Assessment
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              First baseline assessment. Initiated monotherapy on Amlodipine 5mg once daily.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
