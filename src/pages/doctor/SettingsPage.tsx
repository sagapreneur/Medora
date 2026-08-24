import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings as SettingsIcon,
  User,
  Building2,
  Clock,
  Bell,
  Shield,
  Key,
  CheckCircle2,
  Save,
  Lock,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { addToast } = useApp();

  const [activeTab, setActiveTab] = useState<
    'Profile' | 'Clinic' | 'Hours' | 'Notifications' | 'Security'
  >('Profile');

  // Doctor profile state
  const [doctorName, setDoctorName] = useState('Dr. Vikram Mehta, MD');
  const [specialty, setSpecialty] = useState('Senior Consultant Cardiologist');
  const [regNumber, setRegNumber] = useState('MCI-CARDIO-88921');
  const [email, setEmail] = useState('dr.mehta@medora-health.com');
  const [phone, setPhone] = useState('+1 (555) 234-8901');

  // Clinic state
  const [clinicName, setClinicName] = useState('Medora Heart & Vascular Institute');
  const [clinicAddress, setClinicAddress] = useState('742 Evergreen Healthcare Blvd, Suite 300, Metro City');
  const [clinicPhone, setClinicPhone] = useState('+1 (555) 800-4325');

  // Hours state
  const [slotDuration, setSlotDuration] = useState('20');
  const [bufferTime, setBufferTime] = useState('5');
  const [autoConfirm, setAutoConfirm] = useState(true);

  // Security state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Settings Saved', 'Practice configuration updated successfully.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>Practice Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage provider profiles, clinic registry, appointment durations, notifications, and security protocols.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
        {/* Left Tabs (3 cols) */}
        <div className="md:col-span-3 border-r border-slate-200 p-4 space-y-1 bg-slate-50/50">
          {[
            { id: 'Profile', label: 'Doctor Profile', icon: User },
            { id: 'Clinic', label: 'Clinic Information', icon: Building2 },
            { id: 'Hours', label: 'Working Hours & Slots', icon: Clock },
            { id: 'Notifications', label: 'Notifications', icon: Bell },
            { id: 'Security', label: 'Security & 2FA', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Tab Form (9 cols) */}
        <div className="md:col-span-9 p-6 sm:p-8">
          {/* PROFILE */}
          {activeTab === 'Profile' && (
            <form onSubmit={handleSave} className="space-y-4 max-w-xl text-xs">
              <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
                Doctor Professional Identity
              </h3>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal & Medical Name</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Medical Specialty</label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Medical Registration / License #</label>
                  <input
                    type="text"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Practice Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                  />
                </div>
              </div>
            </form>
          )}

          {/* CLINIC */}
          {activeTab === 'Clinic' && (
            <form onSubmit={handleSave} className="space-y-4 max-w-xl text-xs">
              <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
                Clinic & Center Information
              </h3>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinic Name</label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Physical Address</label>
                <input
                  type="text"
                  value={clinicAddress}
                  onChange={(e) => setClinicAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinic Reception Phone</label>
                <input
                  type="text"
                  value={clinicPhone}
                  onChange={(e) => setClinicPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                />
              </div>
            </form>
          )}

          {/* WORKING HOURS & SLOTS */}
          {activeTab === 'Hours' && (
            <div className="space-y-4 max-w-xl text-xs">
              <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
                Consultation Slot Parameters
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Default Slot Duration</label>
                  <select
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="15">15 Minutes</option>
                    <option value="20">20 Minutes (Standard)</option>
                    <option value="30">30 Minutes (Comprehensive)</option>
                    <option value="45">45 Minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Buffer Time Between Visits</label>
                  <select
                    value={bufferTime}
                    onChange={(e) => setBufferTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="0">0 Minutes</option>
                    <option value="5">5 Minutes</option>
                    <option value="10">10 Minutes</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoConfirm}
                    onChange={(e) => setAutoConfirm(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Auto-confirm verified patient appointment bookings</span>
                </label>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'Notifications' && (
            <div className="space-y-3 max-w-xl text-xs">
              <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
                Clinical Alert Routing
              </h3>
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span>Immediate SMS alerts for Critical Lab Findings</span>
                <input type="checkbox" defaultChecked className="rounded text-teal-600" />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span>Daily morning schedule summary email at 07:30 AM</span>
                <input type="checkbox" defaultChecked className="rounded text-teal-600" />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span>Direct patient chat notifications on desktop workspace</span>
                <input type="checkbox" defaultChecked className="rounded text-teal-600" />
              </label>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === 'Security' && (
            <div className="space-y-4 max-w-xl text-xs">
              <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
                Security & PHI Protection Protocol
              </h3>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-950">Two-Factor Authentication (2FA) Active</h4>
                  <p className="text-emerald-800 text-[11px] mt-0.5">
                    Hardware authenticator token required on every new clinical workstation login.
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Session Inactivity Lockout</label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes (Standard Clinic)</option>
                  <option value="60">60 Minutes</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => addToast('Password Reset', 'Secure authentication link dispatched.', 'info')}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl"
                >
                  Rotate Master Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
