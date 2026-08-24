import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Shield,
  Heart,
  AlertTriangle,
  FileCheck2,
  Save,
  Pill,
  Clock,
} from 'lucide-react';

export const PatientProfilePage: React.FC = () => {
  const { currentPatient, addToast } = useApp();

  const [phone, setPhone] = useState(currentPatient.phone);
  const [email, setEmail] = useState(currentPatient.email);
  const [address, setAddress] = useState(currentPatient.address);
  const [emergencyName, setEmergencyName] = useState(currentPatient.emergencyContact.name);
  const [emergencyPhone, setEmergencyPhone] = useState(currentPatient.emergencyContact.phone);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Profile Updated', 'Patient demographics saved securely.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
            <User className="w-3.5 h-3.5" />
            <span>Personal Health Passport</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Patient Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal contact details, verified health insurance policy, and emergency contacts.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-slate-100">
          <img
            src={currentPatient.avatar}
            alt={currentPatient.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900">{currentPatient.name}</h2>
              <span className="bg-slate-100 text-slate-700 font-mono text-xs px-2 py-0.5 rounded border border-slate-200">
                #{currentPatient.id.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {currentPatient.age} years old • {currentPatient.gender} • Blood Group:{' '}
              <strong className="text-teal-800">{currentPatient.bloodGroup}</strong>
            </p>
          </div>
        </div>

        {/* Medical Summary Alerts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Documented Allergies</span>
            </span>
            <p className="text-xs font-semibold text-rose-950">
              {currentPatient.allergies.join(', ') || 'No known drug allergies'}
            </p>
          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Heart className="w-4 h-4" />
              <span>Chronic Medical Conditions</span>
            </span>
            <p className="text-xs font-semibold text-amber-950">
              {currentPatient.chronicConditions.join(', ') || 'None documented'}
            </p>
          </div>
        </div>

        {/* Contact Information Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900 pt-2 border-t border-slate-100">
            Contact & Address Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Home Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            />
          </div>

          <h3 className="font-bold text-sm text-slate-900 pt-3 border-t border-slate-100">
            Emergency Contact & Care Proxy
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Emergency Contact Name</label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Emergency Phone</label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
              />
            </div>
          </div>

          <h3 className="font-bold text-sm text-slate-900 pt-3 border-t border-slate-100">
            Health Insurance Coverage
          </h3>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-slate-400 text-[10px] block font-medium">Provider</span>
              <strong className="text-slate-900 font-bold">{currentPatient.insuranceProvider}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block font-medium">Policy ID</span>
              <span className="text-slate-800 font-mono font-semibold">{currentPatient.policyNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block font-medium">Status</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Verified Active
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
