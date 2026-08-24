import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  UserX,
  Users,
  Activity,
  Calendar,
  Download,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { analytics, addToast } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const COLORS = ['#0f766e', '#0284c7', '#d97706', '#10b981', '#6366f1'];

  const handleExport = () => {
    addToast('Report Exported', 'Clinical analytics CSV/PDF report generated.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Practice Intelligence & Performance Metrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time practice volume, doctor consultation durations, patient demographic distribution, and retention rates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === range
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleExport}
            className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards (Section 21) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Monthly Visits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Total Consultations (Aug)</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {analytics.totalPatientsSeenThisMonth}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              +14.2% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">vs. 388 in July</div>
        </div>

        {/* Metric 2: Avg Consult Duration */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Average Consult Duration</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {analytics.averageConsultationMinutes}m
            </span>
            <span className="text-xs font-semibold text-teal-700">Optimal (15-20m)</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">High diagnostic thoroughness</div>
        </div>

        {/* Metric 3: No Show Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>No-Show Rate</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {analytics.noShowRate}%
            </span>
            <span className="text-xs font-semibold text-emerald-600">-1.8% reduced</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Automated SMS reminders active</div>
        </div>

        {/* Metric 4: Patient Satisfaction */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Patient Satisfaction</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {analytics.patientSatisfactionScore}/5.0
            </span>
            <span className="text-xs font-semibold text-amber-700">Top 5% Clinic</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">From 182 verified reviews</div>
        </div>
      </div>

      {/* Main Charts: Appointment Volume & Demographics (Section 21) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Appointment Volume (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Monthly Appointment Volume & Trends</h3>
              <p className="text-xs text-slate-500">In-person consultations vs telemedicine reviews</p>
            </div>
            <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
              2026 Year-to-Date
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.appointmentVolumeByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="appointments" name="Completed Visits" fill="#0f766e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Prescriptions Issued" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patient Demographics Distribution (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Patient Age Group Demographics</h3>
            <p className="text-xs text-slate-500">Breakdown of registered clinic population</p>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.patientDemographics}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="ageGroup"
                >
                  {analytics.patientDemographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Demographics Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {analytics.patientDemographics.map((item, idx) => (
              <div key={item.ageGroup} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-slate-600 font-medium truncate">
                  {item.ageGroup}: <strong>{item.percentage}%</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Prescribed Medications Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Top Prescribed Therapeutics & Adherence</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {analytics.topMedications.map((m, idx) => (
            <div key={m.name} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                Rank #{idx + 1}
              </span>
              <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>
              <p className="text-xs text-teal-800 font-semibold">{m.prescriptionsCount} active prescriptions</p>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-teal-700 h-full rounded-full"
                  style={{ width: `${(m.prescriptionsCount / 220) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
