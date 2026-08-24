import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FlaskConical,
  ArrowLeft,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Calendar,
  Building2,
  User,
  Activity,
  Check,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface LabReportDetailPageProps {
  reportId?: string;
}

export const LabReportDetailPage: React.FC<LabReportDetailPageProps> = ({ reportId }) => {
  const { labReports, navigate, addToast } = useApp();
  const [downloaded, setDownloaded] = useState(false);

  const id = reportId || (window.location.pathname.split('/lab-reports/')[1] || 'lab-1');
  const report = labReports.find((r) => r.id === id) || labReports[0];

  const handleDownload = () => {
    setDownloaded(true);
    addToast('PDF Export', `Diagnostic Report #${report.id} generated and downloaded.`, 'success');
    setTimeout(() => setDownloaded(false), 2500);
  };

  const getParamBadge = (status: string) => {
    switch (status) {
      case 'Critical':
        return 'bg-rose-50 text-rose-800 border-rose-200 font-bold';
      case 'High':
        return 'bg-amber-50 text-amber-800 border-amber-200 font-semibold';
      case 'Low':
        return 'bg-blue-50 text-blue-800 border-blue-200 font-semibold';
      case 'Normal':
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/lab-reports')}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-0.5">
              <span>{report.category} Investigation</span>
              <span>•</span>
              <span className="font-mono">#{report.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {report.testName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
          >
            {downloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{downloaded ? 'Downloaded PDF' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Patient & Laboratory Metadata Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Patient Info */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-teal-600" />
            <span>Patient Information</span>
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Patient Name</span>
              <strong className="text-slate-900 text-sm font-semibold">{report.patientName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Patient ID</span>
              <span className="font-mono text-slate-800 font-semibold">#{report.patientId.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Ordering Physician</span>
              <span className="text-slate-800 font-medium">{report.doctorName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Diagnostic Status</span>
              <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded text-xs">
                {report.status}
              </span>
            </div>
          </div>
        </div>

        {/* Laboratory Info */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Diagnostic Laboratory & Sample Chain</span>
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Accredited Laboratory</span>
              <strong className="text-slate-900 text-sm font-semibold">{report.laboratory}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Sample Collection Date</span>
              <span className="text-slate-800 font-medium">{report.orderDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Report Verified Date</span>
              <span className="text-slate-800 font-medium">{report.reportDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Clinical Sign-off</span>
              <span className="text-slate-800 font-medium">Certified Pathologist</span>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostic Parameters Table (Section 19) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Quantitative Investigation Results</h3>
          <span className="text-xs text-slate-500 font-medium">Reference Standards: ISO 15189</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="p-4">Parameter Investigation</th>
                <th className="p-4">Measured Result</th>
                <th className="p-4">Standard Reference Range</th>
                <th className="p-4">Unit of Measurement</th>
                <th className="p-4 text-right">Status Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {report.parameters.map((param) => (
                <tr key={param.name} className="hover:bg-slate-50/60">
                  <td className="p-4 font-bold text-slate-900">{param.name}</td>
                  <td className="p-4 font-mono font-bold text-sm text-slate-950">
                    {param.value}
                  </td>
                  <td className="p-4 font-mono text-slate-500">{param.referenceRange}</td>
                  <td className="p-4 font-mono text-slate-600">{param.unit}</td>
                  <td className="p-4 text-right">
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full border ${getParamBadge(
                        param.status
                      )}`}
                    >
                      {param.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Diagnostic Trend Chart (Section 19) */}
      {report.trendData && report.trendData.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>Historical Longitudinal Trend Analysis</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tracking value progression across previous consecutive checkups and lab samplings.
              </p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-mono font-semibold">
              Target Threshold: &lt; 200 mg/dL
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={report.trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <ReferenceLine y={200} stroke="#f43f5e" strokeDasharray="3 3" label="Upper Normal Limit" />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0f766e"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#0f766e', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Doctor's Remarks & Clinical Interpretation (Section 19) */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Pathologist & Attending Physician Remarks
        </h4>
        <p className="text-xs text-slate-800 leading-relaxed font-medium">
          {report.doctorRemarks || report.summary}
        </p>
        <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-200">
          This electronic laboratory report has been digitally signed and validated in compliance with standard clinical protocol.
        </p>
      </div>
    </div>
  );
};
