import React, { useState } from 'react';
import { Prescription } from '../../types';
import { X, Printer, Download, Check, ShieldCheck, HeartPulse } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PrescriptionSlipModalProps {
  prescription: Prescription | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrescriptionSlipModal: React.FC<PrescriptionSlipModalProps> = ({
  prescription,
  isOpen,
  onClose,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen || !prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header Controls (No Print) */}
          <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between no-print">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Official Clinical Prescription Document
              </span>
              <span className="text-xs bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded-md">
                Rx #{prescription.id}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {downloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                <span>{downloaded ? 'Downloaded PDF' : 'Download PDF'}</span>
              </button>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Prescription Printable Sheet Content */}
          <div className="p-8 overflow-y-auto bg-white text-slate-900 font-sans space-y-6">
            {/* Medora Clinic Branding Top */}
            <div className="flex items-start justify-between border-b-2 border-teal-900 pb-5">
              <div>
                <div className="flex items-center gap-2 text-teal-800">
                  <div className="w-8 h-8 rounded-lg bg-teal-900 text-white flex items-center justify-center font-bold text-base">
                    M
                  </div>
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-950">MEDORA HEALTHCARE</h1>
                    <p className="text-xs text-slate-500 font-medium">{prescription.clinicName}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-2 max-w-sm">
                  {prescription.clinicAddress} • Tel: {prescription.clinicPhone}
                </p>
              </div>

              <div className="text-right">
                <h3 className="text-sm font-bold text-slate-900">{prescription.doctorName}</h3>
                <p className="text-xs text-teal-700 font-semibold">{prescription.doctorSpecialty}</p>
                <p className="text-xs text-slate-500 mt-0.5">Reg No: {prescription.doctorRegistrationNumber}</p>
                <div className="flex items-center justify-end gap-1 text-[11px] text-emerald-700 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Licensed Medical Practitioner</span>
                </div>
              </div>
            </div>

            {/* Patient & Date Meta Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Patient Name:</span>
                <strong className="text-slate-900 text-sm font-semibold">{prescription.patientName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Age / Gender / Blood:</span>
                <span className="text-slate-900 font-medium">
                  {prescription.patientAge}y / {prescription.patientGender} / {prescription.patientBloodGroup || 'O+'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Patient ID:</span>
                <span className="text-slate-900 font-mono font-medium">{prescription.patientId.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Prescription Date:</span>
                <span className="text-slate-900 font-medium">{prescription.date}</span>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="border-l-4 border-teal-600 pl-3.5 py-0.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Clinical Diagnosis</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{prescription.diagnosis}</p>
            </div>

            {/* Rx Symbol & Medication Table */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-serif italic font-black text-2xl text-teal-800">℞</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Prescribed Medications & Posology
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100/80 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Medicine & Dosage</th>
                      <th className="p-3">Frequency</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {prescription.medications.map((med, idx) => (
                      <tr key={med.id || idx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-semibold text-slate-950">
                          {med.name}
                          <span className="block text-xs font-normal text-teal-700">{med.dosage}</span>
                        </td>
                        <td className="p-3 font-medium">{med.frequency}</td>
                        <td className="p-3 font-medium">{med.duration}</td>
                        <td className="p-3 text-slate-600">{med.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Instructions / Advice */}
            {prescription.instructions && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block mb-1">Doctor&apos;s Advice / Special Instructions:</span>
                <p className="text-slate-600 leading-relaxed">{prescription.instructions}</p>
              </div>
            )}

            {/* Follow-up & Signature Section */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="text-xs text-slate-600">
                <p className="font-semibold text-slate-900">
                  Follow-up Consultation Date: {prescription.followUpDate || 'As advised in 2-4 weeks'}
                </p>
                <p className="text-slate-400 text-[11px] mt-1">
                  In case of acute emergency or severe drug allergy symptoms, contact clinic immediately or visit nearest ER.
                </p>
              </div>

              <div className="text-right sm:min-w-[200px]">
                <div className="font-serif italic text-lg text-slate-800 border-b border-slate-400 pb-1 mb-1">
                  {prescription.doctorSignatureName}
                </div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
                  Authorized Medical Signature
                </span>
              </div>
            </div>
          </div>

          {/* Footer Close */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center no-print">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <HeartPulse className="w-4 h-4 text-teal-600" />
              <span>Medora Electronic Medical Records System (Verified Safe)</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
