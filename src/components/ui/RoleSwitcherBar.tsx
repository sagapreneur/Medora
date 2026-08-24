import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Eye, EyeOff, UserCheck, Stethoscope, User, HeartPulse } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { userRole, switchRole, isMaskingSensitiveData, toggleSensitiveDataMask, currentRoute, navigate } = useApp();

  const isPatientPortal = currentRoute.startsWith('/patient');

  return (
    <div id="medora-workspace-bar" className="bg-[#0F172A] text-slate-200 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0 select-none z-40">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-semibold text-[#2DD4BF]">
          <HeartPulse className="w-4 h-4 text-[#2DD4BF] animate-pulse" />
          <span className="tracking-wide">MEDORA CLINICAL</span>
        </div>
        <span className="hidden sm:inline text-slate-600">|</span>
        <span className="hidden md:inline text-slate-400 font-medium">
          Active Workspace:
        </span>
        <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
          <button
            id="role-btn-doctor"
            onClick={() => switchRole('doctor')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
              userRole === 'doctor' && !isPatientPortal
                ? 'bg-[#0D9488] text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctor (Dr. Mehta)</span>
          </button>
          <button
            id="role-btn-patient"
            onClick={() => switchRole('patient')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
              userRole === 'patient' || isPatientPortal
                ? 'bg-[#0D9488] text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Patient Portal (Priya)</span>
          </button>
          <button
            id="role-btn-staff"
            onClick={() => switchRole('staff')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
              userRole === 'staff'
                ? 'bg-[#0D9488] text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Clinic Staff</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Sensitive data mask toggle */}
        <button
          id="toggle-privacy-mask-btn"
          onClick={toggleSensitiveDataMask}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs transition-all ${
            isMaskingSensitiveData
              ? 'bg-amber-950/60 border-amber-600/60 text-amber-300'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
          title="Toggle clinical privacy masking for demonstration"
        >
          <Shield className="w-3.5 h-3.5 text-[#2DD4BF]" />
          {isMaskingSensitiveData ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>PHI Masked (Active)</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Mask PHI</span>
            </>
          )}
        </button>

        {/* Quick link to login */}
        <button
          id="btn-nav-login"
          onClick={() => navigate('/login')}
          className="text-slate-400 hover:text-slate-200 underline text-xs ml-1"
        >
          Sign In Screen
        </button>
      </div>
    </div>
  );
};
