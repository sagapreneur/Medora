import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LabReport } from '../../types';
import {
  FlaskConical,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Calendar,
  Building2,
  ChevronRight,
  Printer,
  FileCheck2,
} from 'lucide-react';

export const PatientReportsPage: React.FC = () => {
  const { currentPatient, labReports, addToast } = useApp();
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);

  const patientReports = labReports.filter((r) => r.patientId === currentPatient.id);

  const handleDownload = (rep: LabReport) => {
    addToast('Download Started', `Diagnostic Report #${rep.id} (${rep.testName}) downloaded.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Diagnostic Laboratory Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Lab Reports</h1>
          <p className="text-sm text-slate-500 mt-1">
            View certified test investigations, lipid profiles, urine screens, and quantitative parameter ranges.
          </p>
        </div>
      </div>

      {/* Reports List (Section 33) */}
      <div className="space-y-4">
        {patientReports.map((rep) => (
          <div
            key={rep.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold border border-teal-200">
                  <FlaskConical className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{rep.testName}</h3>
                  <p className="text-xs text-slate-500">
                    {rep.laboratory} • Ordered by <strong className="text-slate-700">{rep.doctorName}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {rep.status}
                </span>
                <button
                  onClick={() => handleDownload(rep)}
                  className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

            {/* Parameters Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Parameter</th>
                    <th className="p-3">Measured Result</th>
                    <th className="p-3">Standard Reference</th>
                    <th className="p-3 text-right">Interpretation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {rep.parameters.map((p) => (
                    <tr key={p.name} className="hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-slate-950">{p.name}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">
                        {p.value} <span className="font-normal text-slate-500 text-[11px]">{p.unit}</span>
                      </td>
                      <td className="p-3 font-mono text-slate-500 text-[11px]">{p.referenceRange}</td>
                      <td className="p-3 text-right">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            p.status === 'Normal'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Doctor's Summary */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
              <strong className="text-slate-900">Clinical Summary: </strong>
              <span>{rep.summary}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
