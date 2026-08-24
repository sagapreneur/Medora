import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Phone,
  Mail,
  Heart,
  AlertTriangle,
  Pill,
  Calendar,
  FileText,
  FlaskConical,
  Stethoscope,
  Clock,
  Shield,
  Upload,
  Plus,
  ArrowLeft,
  ChevronRight,
  Printer,
  FileCheck2,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { AppointmentModal } from '../../components/ui/AppointmentModal';
import { PrescriptionSlipModal } from '../../components/ui/PrescriptionSlipModal';
import { Prescription } from '../../types';

interface PatientProfilePageProps {
  patientId?: string;
}

export const PatientProfilePage: React.FC<PatientProfilePageProps> = ({ patientId }) => {
  const {
    patients,
    appointments,
    prescriptions,
    labReports,
    navigate,
    setActiveConsultationPatientId,
    isMaskingSensitiveData,
    addToast,
  } = useApp();

  const id = patientId || (window.location.pathname.split('/patients/')[1] || 'pat-1');
  const patient = patients.find((p) => p.id === id) || patients[0];

  const [activeTab, setActiveTab] = useState<
    'Overview' | 'Medical History' | 'Consultations' | 'Prescriptions' | 'Lab Reports' | 'Documents' | 'Notes'
  >('Overview');

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [customNotes, setCustomNotes] = useState<Array<{ id: string; date: string; author: string; text: string }>>([
    {
      id: 'cn-1',
      date: '2026-08-18',
      author: 'Dr. Vikram Mehta',
      text: 'Patient demonstrates solid compliance with daily Amlodipine regimen. Advised continuing morning dietary salt restrictions and logging weekly BP.',
    },
    {
      id: 'cn-2',
      date: '2026-07-20',
      author: 'Dr. Marcus Vance',
      text: 'Routine cardiology clearance obtained for moderate aerobic jogging.',
    },
  ]);

  // Filter data for this patient
  const patientAppointments = appointments.filter((a) => a.patientId === patient.id);
  const patientPrescriptions = prescriptions.filter((p) => p.patientId === patient.id);
  const patientLabReports = labReports.filter((r) => r.patientId === patient.id);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setCustomNotes([
      {
        id: `cn-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        author: 'Dr. Vikram Mehta',
        text: newNoteText.trim(),
      },
      ...customNotes,
    ]);
    setNewNoteText('');
    addToast('Note Added', 'Clinical observation logged to patient file', 'success');
  };

  const maskString = (str: string) => {
    if (!isMaskingSensitiveData) return str;
    return str.substring(0, 3) + '••••••••';
  };

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/patients')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Patients</span>
        </button>

        <span className="text-xs font-mono text-slate-400">
          RECORD CLASSIFICATION: CONFIDENTIAL EMR
        </span>
      </div>

      {/* Patient Profile Header (Section 11) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Avatar & Patient Meta */}
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <img
              src={patient.avatar}
              alt={patient.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-xs shrink-0"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
                  {patient.name}
                </h1>
                <span className="bg-slate-100 text-slate-800 font-mono font-bold text-xs px-2 py-0.5 rounded-md border border-slate-200">
                  #{patient.id.toUpperCase()}
                </span>
                <span className="bg-teal-50 text-teal-800 font-semibold text-xs px-2 py-0.5 rounded-md border border-teal-200">
                  {patient.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
                <div>
                  <span className="text-slate-400 font-medium">Age / Gender: </span>
                  <strong className="text-slate-800">{patient.age} yrs, {patient.gender}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Blood Group: </span>
                  <strong className="text-slate-800">{patient.bloodGroup}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Phone: </span>
                  <strong className="text-slate-800">{maskString(patient.phone)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Emergency: </span>
                  <strong className="text-slate-800">
                    {patient.emergencyContact.name} ({patient.emergencyContact.relation})
                  </strong>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                <span>Address: {patient.address}</span>
                <span>•</span>
                <span>Insurance: {patient.insuranceProvider} ({patient.policyNumber})</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Buttons (Section 11) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <button
              id="patient-profile-start-consult"
              onClick={() => {
                setActiveConsultationPatientId(patient.id);
                navigate(`/consultations/${patient.id}`);
              }}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Start Consultation</span>
            </button>

            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Calendar className="w-4 h-4 text-slate-600" />
              <span>Schedule</span>
            </button>

            <button
              onClick={() => {
                setActiveConsultationPatientId(patient.id);
                navigate(`/consultations/${patient.id}`);
              }}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Pill className="w-4 h-4 text-slate-600" />
              <span>Add Prescription</span>
            </button>

            <button
              onClick={() => addToast('Upload Simulator', 'Diagnostic file upload modal ready.', 'info')}
              className="p-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors"
              title="Upload Report"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Medical Summary Area (Section 12) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Allergies */}
        <div className="bg-rose-50/70 border border-rose-200/70 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 text-rose-800 text-xs font-bold uppercase tracking-wider mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Allergies</span>
          </div>
          <p className="text-xs font-bold text-rose-950">
            {patient.allergies.join(', ') || 'No Known Allergies'}
          </p>
        </div>

        {/* Chronic Conditions */}
        <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Heart className="w-3.5 h-3.5" />
            <span>Chronic Conditions</span>
          </div>
          <p className="text-xs font-bold text-amber-950">
            {patient.chronicConditions.join(', ') || 'None Documented'}
          </p>
        </div>

        {/* Current Medications */}
        <div className="bg-teal-50/70 border border-teal-200/70 rounded-xl p-3.5 col-span-2 md:col-span-1">
          <div className="flex items-center gap-1.5 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Pill className="w-3.5 h-3.5" />
            <span>Current Medications</span>
          </div>
          <p className="text-xs font-bold text-teal-950 truncate">
            {patient.currentMedications.join(', ') || 'No Active Rx'}
          </p>
        </div>

        {/* Blood Group */}
        <div className="bg-blue-50/70 border border-blue-200/70 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 text-blue-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Heart className="w-3.5 h-3.5" />
            <span>Blood Group</span>
          </div>
          <p className="text-sm font-bold text-blue-950">{patient.bloodGroup}</p>
        </div>

        {/* Last Visit */}
        <div className="bg-slate-100/70 border border-slate-200 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 text-slate-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Last Visit</span>
          </div>
          <p className="text-xs font-bold text-slate-900">{patient.lastVisit}</p>
        </div>
      </div>

      {/* Electronic Medical Record Tabs (Section 13) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Tabs Bar */}
        <div className="border-b border-slate-200 bg-slate-50/50 px-4 flex items-center gap-2 overflow-x-auto">
          {(
            [
              'Overview',
              'Medical History',
              'Consultations',
              'Prescriptions',
              'Lab Reports',
              'Documents',
              'Notes',
            ] as const
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3.5 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab
                  ? 'border-teal-700 text-teal-800 font-bold bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Panes */}
        <div className="p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              {/* Latest Vitals Strip */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Current Vitals Baseline (Recorded {patient.vitals.recordedAt})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-400 block font-semibold">Blood Pressure</span>
                    <strong className="text-sm font-bold text-slate-900">{patient.vitals.bloodPressure}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-400 block font-semibold">Heart Rate</span>
                    <strong className="text-sm font-bold text-slate-900">{patient.vitals.heartRate} bpm</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-400 block font-semibold">Temperature</span>
                    <strong className="text-sm font-bold text-slate-900">{patient.vitals.temperature} °F</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-400 block font-semibold">Resp. Rate</span>
                    <strong className="text-sm font-bold text-slate-900">{patient.vitals.respiratoryRate}/min</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-400 block font-semibold">Oxygen (SpO2)</span>
                    <strong className="text-sm font-bold text-emerald-700">{patient.vitals.oxygenSaturation}%</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-400 block font-semibold">Weight</span>
                    <strong className="text-sm font-bold text-slate-900">{patient.vitals.weight} kg</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-400 block font-semibold">Height</span>
                    <strong className="text-sm font-bold text-slate-900">{patient.vitals.height} cm</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-400 block font-semibold">BMI</span>
                    <strong className="text-sm font-bold text-slate-900">{patient.vitals.bmi}</strong>
                  </div>
                </div>
              </div>

              {/* Active Care Plans & Next Appointments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-200 rounded-xl p-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    <span>Appointment History & Scheduled Visits</span>
                  </h4>
                  <div className="space-y-2.5">
                    {patientAppointments.length > 0 ? (
                      patientAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="p-3 bg-slate-50 rounded-lg flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900 block">{apt.type} • {apt.doctorName}</span>
                            <span className="text-[11px] text-slate-500">{apt.reason}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-slate-800 block">{apt.date}</span>
                            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                              {apt.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">No scheduled visits.</p>
                    )}
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-teal-600" />
                    <span>Recent Diagnostic Lab Orders</span>
                  </h4>
                  <div className="space-y-2.5">
                    {patientLabReports.length > 0 ? (
                      patientLabReports.map((rep) => (
                        <div
                          key={rep.id}
                          onClick={() => navigate(`/lab-reports/${rep.id}`)}
                          className="p-3 bg-slate-50 hover:bg-teal-50/50 rounded-lg flex items-center justify-between text-xs cursor-pointer transition-colors"
                        >
                          <div>
                            <span className="font-bold text-slate-900 block">{rep.testName}</span>
                            <span className="text-[11px] text-slate-500">{rep.laboratory}</span>
                          </div>
                          <span className="text-xs text-teal-700 font-semibold flex items-center gap-1">
                            {rep.status} <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">No lab diagnostics recorded.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEDICAL HISTORY */}
          {activeTab === 'Medical History' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Longitudinal Medical History Timeline</h3>
              <div className="border-l-2 border-teal-500 ml-3 pl-5 space-y-6">
                <div className="relative">
                  <span className="w-3 h-3 bg-teal-600 rounded-full absolute -left-[27px] top-1 border-2 border-white"></span>
                  <div className="text-xs text-slate-400 font-mono">18 August 2026</div>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5">Cardiology Follow-up & BP Optimization</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Evaluated by Dr. Vikram Mehta. Resting blood pressure recorded at 128/84 mmHg. Telmisartan 40mg prescribed alongside Amlodipine 5mg. Holter ambulatory monitoring ordered.
                  </p>
                </div>

                <div className="relative">
                  <span className="w-3 h-3 bg-teal-600 rounded-full absolute -left-[27px] top-1 border-2 border-white"></span>
                  <div className="text-xs text-slate-400 font-mono">20 July 2026</div>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5">Metabolic Panel & Lipid Profile Screening</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Routine fasting blood tests revealed borderline Total Cholesterol (218 mg/dL). Dietary low-sodium protocol initiated. Renal panel (Creatinine 0.95 mg/dL) verified healthy.
                  </p>
                </div>

                <div className="relative">
                  <span className="w-3 h-3 bg-slate-400 rounded-full absolute -left-[27px] top-1 border-2 border-white"></span>
                  <div className="text-xs text-slate-400 font-mono">12 May 2025</div>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5">Initial Stage 1 Hypertension Diagnosis</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Sustained BP readings &gt; 140/90 mmHg. Family history of coronary artery disease documented. Initiated monotherapy on Amlodipine 5mg OD.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONSULTATIONS */}
          {activeTab === 'Consultations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Recorded Clinical Consultations</h3>
                <button
                  onClick={() => {
                    setActiveConsultationPatientId(patient.id);
                    navigate(`/consultations/${patient.id}`);
                  }}
                  className="px-3 py-1.5 bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Start New Session</span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-900">Session #CON-101 • Dr. Vikram Mehta</span>
                    <span className="text-slate-500 font-mono">18 Aug 2026, 10:30 AM</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    <strong>Chief Complaint:</strong> Hypertension 3-month follow-up. Mild evening fatigue.
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    <strong>Observations:</strong> S1/S2 heart sounds clear, no carotid bruits. Vitals stable. Advised 24-hr Holter cuff test.
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/consultations/${patient.id}`)}
                      className="text-xs text-teal-700 hover:underline font-semibold"
                    >
                      Open Full SOAP Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRESCRIPTIONS */}
          {activeTab === 'Prescriptions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Prescription Records</h3>
                <button
                  onClick={() => {
                    setActiveConsultationPatientId(patient.id);
                    navigate(`/consultations/${patient.id}`);
                  }}
                  className="px-3 py-1.5 bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Prescription</span>
                </button>
              </div>

              <div className="space-y-3">
                {patientPrescriptions.length > 0 ? (
                  patientPrescriptions.map((rx) => (
                    <div
                      key={rx.id}
                      className="p-4 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            #{rx.id}
                          </span>
                          <span className="text-xs text-slate-400">{rx.date}</span>
                          <span className="text-xs font-semibold text-slate-700">by {rx.doctorName}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{rx.diagnosis}</h4>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {rx.medications.map((m) => (
                            <span
                              key={m.id}
                              className="text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium"
                            >
                              {m.name} ({m.dosage})
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedPrescription(rx)}
                        className="px-3 py-2 bg-slate-50 hover:bg-teal-50 text-teal-800 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-center"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>View & Print Slip</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-4">No prescriptions recorded for this patient.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: LAB REPORTS */}
          {activeTab === 'Lab Reports' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Diagnostic Laboratory Results</h3>
              <div className="space-y-3">
                {patientLabReports.map((rep) => (
                  <div
                    key={rep.id}
                    onClick={() => navigate(`/lab-reports/${rep.id}`)}
                    className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                          {rep.category}
                        </span>
                        <span className="text-xs text-slate-400">{rep.reportDate}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{rep.testName}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{rep.summary}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-700">{rep.status}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: DOCUMENTS */}
          {activeTab === 'Documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Signed Consent & Insurance Documents</h3>
                <button
                  onClick={() => addToast('Upload Simulator', 'Document scanned and indexed.', 'info')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Document</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-teal-600" />
                    <div>
                      <span className="font-bold text-slate-900 block">General Treatment Consent 2026.pdf</span>
                      <span className="text-[11px] text-slate-400">Signed Aug 10 • 1.2 MB</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToast('Download', 'Consent document downloaded', 'info')}
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-5 h-5 text-teal-600" />
                    <div>
                      <span className="font-bold text-slate-900 block">Health Insurance Card Scan.pdf</span>
                      <span className="text-[11px] text-slate-400">Verified BlueCross • 840 KB</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToast('Download', 'Insurance scan downloaded', 'info')}
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: NOTES */}
          {activeTab === 'Notes' && (
            <div className="space-y-6">
              {/* Add Quick Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Add Clinical Note / Care Team Memo
                </label>
                <textarea
                  rows={2}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Type internal medical observation or nursing note..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white resize-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold"
                >
                  Save Note to Chart
                </button>
              </form>

              {/* Existing Notes Feed */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                {customNotes.map((n) => (
                  <div key={n.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="font-bold text-slate-900">{n.author}</span>
                      <span className="font-mono text-[11px]">{n.date}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        initialPatientId={patient.id}
        onClose={() => setIsAppointmentModalOpen(false)}
      />

      {/* Prescription Slip Printable Modal */}
      <PrescriptionSlipModal
        prescription={selectedPrescription}
        isOpen={!!selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
      />
    </div>
  );
};
