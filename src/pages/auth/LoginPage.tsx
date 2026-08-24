import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HeartPulse, ShieldCheck, Lock, Mail, ArrowRight, Stethoscope, User, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { navigate, switchRole, addToast } = useApp();
  const [email, setEmail] = useState('dr.mehta@medora-health.com');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [roleSelection, setRoleSelection] = useState<'doctor' | 'patient' | 'staff'>('doctor');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (roleSelection === 'patient') {
      switchRole('patient');
      navigate('/patient');
    } else {
      switchRole('doctor');
      navigate('/dashboard');
    }
    addToast('Authentication Verified', 'Welcome back to Medora Healthcare Platform', 'success');
  };

  const quickLoginAs = (role: 'doctor' | 'patient' | 'staff') => {
    setRoleSelection(role);
    if (role === 'patient') {
      setEmail('priya.patel@example.com');
      switchRole('patient');
      navigate('/patient');
    } else {
      setEmail('dr.mehta@medora-health.com');
      switchRole('doctor');
      navigate('/dashboard');
    }
    addToast('Signed In', `Loaded workspace for ${role.toUpperCase()}`, 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full mx-auto bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
        {/* Left Column: Clinical Brand & Security Overview */}
        <div className="p-8 sm:p-12 bg-linear-to-b from-slate-900 to-slate-950 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-lg shadow-teal-950/40">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">Medora</span>
                <span className="block text-xs font-semibold text-teal-400 uppercase tracking-widest">
                  Healthcare Platform
                </span>
              </div>
            </div>

            {/* Concise Product Statement */}
            <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">
              Unified clinical workspace for modern care teams.
            </h2>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              Empowering physicians, clinic administrators, and patients with integrated electronic medical records, real-time appointment scheduling, and automated diagnostic workflows.
            </p>

            {/* Feature bullets */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Encrypted Electronic Medical Records (EMR)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Integrated Prescription & Lab Diagnostic Management</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Direct Doctor-to-Patient Consultation Hub</span>
              </div>
            </div>
          </div>

          {/* Security footnote */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0" />
            <span>256-Bit TLS Clinical Session Protected</span>
          </div>
        </div>

        {/* Right Column: Sign In Form */}
        <div className="p-8 sm:p-12 bg-white flex flex-col justify-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Sign In to Medora</h3>
            <p className="text-xs text-slate-500 mt-1">
              Select your access credentials or choose a role below.
            </p>

            {/* Role selector tabs */}
            <div className="mt-5 grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setRoleSelection('doctor')}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  roleSelection === 'doctor'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Doctor / Clinic</span>
              </button>
              <button
                type="button"
                onClick={() => setRoleSelection('patient')}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  roleSelection === 'patient'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Patient Portal</span>
              </button>
            </div>

            <form onSubmit={handleSignIn} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Healthcare Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Security Password</label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); addToast('Reset Link', 'Password reset instructions sent to registered contact.', 'info'); }} className="text-[11px] text-teal-700 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>Remember practice station</span>
                </label>
              </div>

              <button
                type="submit"
                id="btn-login-submit"
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In to Medora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Continue Buttons */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
                Quick Access Profiles
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="btn-quick-patient"
                  onClick={() => quickLoginAs('patient')}
                  className="px-3 py-2 border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 rounded-xl text-xs font-semibold text-slate-700 transition-all text-left flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-teal-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="block truncate font-bold">Continue as Patient</span>
                    <span className="text-[10px] text-slate-500 block truncate">Priya Patel</span>
                  </div>
                </button>

                <button
                  type="button"
                  id="btn-quick-staff"
                  onClick={() => quickLoginAs('doctor')}
                  className="px-3 py-2 border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 rounded-xl text-xs font-semibold text-slate-700 transition-all text-left flex items-center gap-2"
                >
                  <Stethoscope className="w-4 h-4 text-teal-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="block truncate font-bold">Continue as Staff</span>
                    <span className="text-[10px] text-slate-500 block truncate">Dr. Vikram Mehta</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
