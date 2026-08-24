import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LabCategory, LabStatus } from '../../types';
import {
  FlaskConical,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  Eye,
  FileCheck,
} from 'lucide-react';

export const LabReportsPage: React.FC = () => {
  const { labReports, navigate } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const categories: Array<'All' | LabCategory> = [
    'All',
    'Blood',
    'Urine',
    'Imaging',
    'Pathology',
    'Other',
  ];

  const filteredReports = useMemo(() => {
    return labReports.filter((rep) => {
      const matchesSearch =
        rep.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.laboratory.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'All' || rep.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || rep.status === selectedStatus;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [labReports, searchQuery, selectedCategory, selectedStatus]);

  const getStatusBadge = (status: LabStatus) => {
    switch (status) {
      case 'Critical':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
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
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Diagnostic Laboratory Information System (LIS)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Lab Reports</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review certified lab investigations, biochemistry panels, urine analyses, imaging scans, and pathology reports.
          </p>
        </div>
      </div>

      {/* Categories Bar (Section 18) */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {cat === 'All' ? 'All Categories' : `${cat} Diagnostics`}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by test name, patient, laboratory, or report ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
          />
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
          >
            <option value="All">All Diagnostic Statuses</option>
            <option value="Completed">Completed / Verified</option>
            <option value="Critical">Critical Findings</option>
            <option value="Pending">Pending Analysis</option>
          </select>
        </div>
      </div>

      {/* Reports Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="p-4">Report ID</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Investigation Test</th>
                <th className="p-4">Category</th>
                <th className="p-4">Order Date</th>
                <th className="p-4">Report Date</th>
                <th className="p-4">Laboratory</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredReports.map((rep) => (
                <tr
                  key={rep.id}
                  onClick={() => navigate(`/lab-reports/${rep.id}`)}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                >
                  <td className="p-4 font-mono font-bold text-slate-600">#{rep.id}</td>
                  <td className="p-4 font-bold text-slate-900">{rep.patientName}</td>
                  <td className="p-4 font-semibold text-slate-950">{rep.testName}</td>
                  <td className="p-4">
                    <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[10px] uppercase">
                      {rep.category}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{rep.orderDate}</td>
                  <td className="p-4 text-slate-500">{rep.reportDate}</td>
                  <td className="p-4 text-slate-600">{rep.laboratory}</td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        rep.status
                      )}`}
                    >
                      {rep.status}
                    </span>
                  </td>
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/lab-reports/${rep.id}`)}
                      className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold rounded-lg text-xs flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
