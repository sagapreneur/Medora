import React from 'react';
import { PatientNavbar } from './PatientNavbar';
import { PatientBottomNav } from './PatientBottomNav';
import { ToastContainer } from '../ui/ToastContainer';
import { RoleSwitcherBar } from '../ui/RoleSwitcherBar';

interface PatientLayoutProps {
  children: React.ReactNode;
}

export const PatientLayout: React.FC<PatientLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F1F5F9] text-[#1E293B] pb-16 md:pb-0">
      {/* Top Workspace & Role switcher */}
      <RoleSwitcherBar />

      {/* Patient Navbar */}
      <PatientNavbar />

      {/* Main Patient Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <PatientBottomNav />

      <ToastContainer />
    </div>
  );
};
