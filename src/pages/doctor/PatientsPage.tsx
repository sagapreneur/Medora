import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  ChevronRight,
  Eye,
  FilePlus,
  Stethoscope,
  ArrowUpDown,
  Phone,
  Mail,
  Shield,
  Download,
} from 'lucide-react';
import { AppointmentModal } from '../../components/ui/AppointmentModal';

export const PatientsPage: React.FC = () => {
  const { patients, navigate, setActiveConsultationPatientId, isMaskingSensitiveData } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'lastVisit' | 'age'>('lastVisit');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedPatientForBooking, setSelectedPatientForBooking] = useState<string | undefined>(undefined);

  // Extract unique conditions for filter dropdown
  const allConditions = useMemo(() => {
    const set = new Set<string>();
    patients.forEach((p) => p.chronicConditions.forEach((c) => set.add(c)));
    return Array.from(set);
  }, [patients]);

  const filteredPatients = useMemo(() => {
    return patients
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.phone.includes(searchQuery) ||
          p.chronicConditions.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesGender = genderFilter === 'All' || p.gender === genderFilter;
        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
        const matchesCondition =
          conditionFilter === 'All' || p.chronicConditions.includes(conditionFilter);

        return matchesSearch && matchesGender && matchesStatus && matchesCondition;
      })
      .sort((a, b) => {
        let compare = 0;
        if (sortBy === 'name') compare = a.name.localeCompare(b.name);
        if (sortBy === 'age') compare = a.age - b.age;
        if (sortBy === 'lastVisit') compare = a.lastVisit.localeCompare(b.lastVisit);
        return sortOrder === 'asc' ? compare : -compare;
      });
  }, [patients, searchQuery, genderFilter, statusFilter, conditionFilter, sortBy, sortOrder]);

  const toggleSort = (field: 'name' | 'lastVisit' | 'age') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const maskString = (str: string) => {
    if (!isMaskingSensitiveData) return str;
    return str.substring(0, 3) + '••••••••';
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Master Patient Index & Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Patients</h1>
          <p className="text-sm text-slate-500 mt-1">
            Directory of {patients.length} registered clinical patients with comprehensive history, vitals, and diagnostic tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedPatientForBooking(undefined);
              setIsAppointmentModalOpen(true);
            }}
            className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register & Schedule</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by patient name, ID (#PAT-1), phone, or medical condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
            />
          </div>

          {/* Gender Filter */}
          <div>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            >
              <option value="All">All Clinical Statuses</option>
              <option value="Active">Active</option>
              <option value="Waiting">Waiting</option>
              <option value="In Consultation">In Consultation</option>
              <option value="Follow-up">Follow-up Due</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>
        </div>

        {/* Secondary Condition Quick Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-semibold shrink-0 text-[11px] uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter by Condition:
          </span>
          <button
            onClick={() => setConditionFilter('All')}
            className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-all ${
              conditionFilter === 'All'
                ? 'bg-teal-700 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Conditions
          </button>
          {allConditions.slice(0, 6).map((c) => (
            <button
              key={c}
              onClick={() => setConditionFilter(c)}
              className={`px-2.5 py-1 rounded-lg font-medium shrink-0 transition-all text-xs ${
                conditionFilter === c
                  ? 'bg-teal-700 text-white font-semibold'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Patients Table (Section 10) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider select-none">
              <tr>
                <th className="p-4 cursor-pointer" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-1.5">
                    <span>Patient</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-4">Patient ID</th>
                <th className="p-4 cursor-pointer" onClick={() => toggleSort('age')}>
                  <div className="flex items-center gap-1.5">
                    <span>Age / Gender</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-4">Blood Group</th>
                <th className="p-4">Chronic Conditions & Allergies</th>
                <th className="p-4 cursor-pointer" onClick={() => toggleSort('lastVisit')}>
                  <div className="flex items-center gap-1.5">
                    <span>Last Visit</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-4">Next Appointment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/patients/${p.id}`)}
                  >
                    {/* Patient Name & Avatar */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 text-sm group-hover:text-teal-700 block transition-colors">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {maskString(p.phone)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Patient ID */}
                    <td className="p-4 font-mono font-semibold text-slate-600">
                      #{p.id.toUpperCase()}
                    </td>

                    {/* Age / Gender */}
                    <td className="p-4">
                      <span className="font-medium text-slate-900">{p.age} yrs</span>
                      <span className="block text-[11px] text-slate-500">{p.gender}</span>
                    </td>

                    {/* Blood Group */}
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-slate-100 text-slate-800 border border-slate-200">
                        {p.bloodGroup}
                      </span>
                    </td>

                    {/* Chronic Conditions & Allergies */}
                    <td className="p-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {p.chronicConditions.map((c) => (
                          <span
                            key={c}
                            className="bg-teal-50 text-teal-800 font-medium text-[10px] px-1.5 py-0.5 rounded"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                      {p.allergies.length > 0 && p.allergies[0] !== 'NKDA' && (
                        <span className="text-[10px] text-rose-700 font-semibold block mt-1">
                          Allergy: {p.allergies.join(', ')}
                        </span>
                      )}
                    </td>

                    {/* Last Visit */}
                    <td className="p-4 text-slate-600 font-medium">{p.lastVisit}</td>

                    {/* Next Appointment */}
                    <td className="p-4 text-xs font-semibold text-teal-700">
                      {p.nextAppointment || 'None Scheduled'}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          p.status === 'In Consultation'
                            ? 'bg-teal-50 text-teal-800 border-teal-200'
                            : p.status === 'Waiting'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : p.status === 'Follow-up'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setActiveConsultationPatientId(p.id);
                            navigate(`/consultations/${p.id}`);
                          }}
                          className="p-1.5 text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                          title="Start Clinical Consultation"
                        >
                          <Stethoscope className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPatientForBooking(p.id);
                            setIsAppointmentModalOpen(true);
                          }}
                          className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Book Appointment"
                        >
                          <FilePlus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/patients/${p.id}`)}
                          className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Full Profile"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-slate-500 text-xs">
                    No patient records matched the applied search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Stats */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Showing <strong className="text-slate-800">{filteredPatients.length}</strong> of{' '}
            <strong className="text-slate-800">{patients.length}</strong> total patients
          </span>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Real-time Electronic Health Record sync active</span>
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        initialPatientId={selectedPatientForBooking}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
    </div>
  );
};
