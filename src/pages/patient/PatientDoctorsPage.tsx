import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Star,
  Clock,
  DollarSign,
  Calendar,
  UserRound,
  CheckCircle2,
  Stethoscope,
  MapPin,
} from 'lucide-react';
import { AppointmentModal } from '../../components/ui/AppointmentModal';

export const PatientDoctorsPage: React.FC = () => {
  const { doctors, currentPatient } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);

  const specialties = [
    'All',
    'Cardiology',
    'Dermatology',
    'Orthopedics',
    'Pediatrics',
    'Neurology',
    'General Medicine',
  ];

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.bio.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, searchQuery, selectedSpecialty]);

  const handleBookWithDoctor = (docId: string) => {
    setSelectedDoctorId(docId);
    setIsAppointmentModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
            <UserRound className="w-3.5 h-3.5" />
            <span>Verified Medical Specialists</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Find Doctors & Specialists
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse board-certified clinical consultants, review availability, and book your next appointment.
          </p>
        </div>
      </div>

      {/* Specialty Filter Chips (Section 30) */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        {specialties.map((spec) => (
          <button
            key={spec}
            onClick={() => setSelectedSpecialty(spec)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSpecialty === spec
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by doctor name, specialty, qualification, or condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Doctors Grid (Section 30) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Doctor photo & rating */}
              <div className="flex items-start gap-3.5">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-950 text-base truncate">{doc.name}</h3>
                  <p className="text-xs text-teal-700 font-semibold">{doc.specialty}</p>
                  <p className="text-[11px] text-slate-500 truncate">{doc.qualifications}</p>

                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <div className="flex items-center text-amber-500 font-bold gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{doc.rating}</span>
                    </div>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-medium">{doc.experience} exp</span>
                  </div>
                </div>
              </div>

              {/* Bio summary */}
              <p className="text-xs text-slate-600 mt-3.5 line-clamp-2 leading-relaxed">
                {doc.bio}
              </p>

              {/* Clinic Room & Fee */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block font-medium">Consultation Fee</span>
                  <strong className="text-slate-900 font-bold">${doc.consultationFee}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-medium">Location</span>
                  <span className="text-slate-700 font-semibold truncate block">{doc.room}</span>
                </div>
              </div>

              {/* Next Available Slot */}
              <div className="mt-3 p-2 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center justify-between">
                <span className="text-slate-500 text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-teal-600" />
                  <span>Next slot:</span>
                </span>
                <strong className="text-teal-800 text-[11px] font-bold">
                  {doc.nextAvailable}
                </strong>
              </div>
            </div>

            {/* Book Button */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleBookWithDoctor(doc.id)}
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        initialPatientId={currentPatient.id}
        initialDoctorId={selectedDoctorId}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
    </div>
  );
};
