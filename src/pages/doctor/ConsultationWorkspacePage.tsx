import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HeartPulse,
  User,
  AlertTriangle,
  Pill,
  Plus,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  FlaskConical,
  Activity,
  Printer,
  ChevronLeft,
  Stethoscope,
  Sparkles,
} from 'lucide-react';
import { PrescriptionSlipModal } from '../../components/ui/PrescriptionSlipModal';
import { MedicationItem, Prescription } from '../../types';

interface ConsultationWorkspacePageProps {
  patientId?: string;
}

export const ConsultationWorkspacePage: React.FC<ConsultationWorkspacePageProps> = ({ patientId }) => {
  const {
    patients,
    activeConsultationPatientId,
    saveConsultation,
    navigate,
    addToast,
  } = useApp();

  const targetId =
    patientId ||
    activeConsultationPatientId ||
    (window.location.pathname.split('/consultations/')[1] || 'pat-1');

  const patient = patients.find((p) => p.id === targetId) || patients[0];

  // Middle Section Clinical State
  const [chiefComplaint, setChiefComplaint] = useState('Hypertension follow-up with mild exertional fatigue');
  const [symptoms, setSymptoms] = useState<string[]>([
    'Mild Fatigue',
    'Occasional Palpitations',
    'Exertional Shortness of Breath',
  ]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [clinicalObservations, setClinicalObservations] = useState(
    'Normal S1/S2 heart sounds. No murmurs or carotid bruits audible. Bilateral lung fields clear. No peripheral pretibial edema.'
  );
  const [diagnosis, setDiagnosis] = useState('Essential Stage 1 Hypertension (I10) - Stable');
  const [treatmentPlan, setTreatmentPlan] = useState(
    'Continue low-sodium DASH dietary protocol. Exercise 30 minutes daily. Maintain morning BP logging.'
  );

  // Right Section: Medications state
  const [medications, setMedications] = useState<MedicationItem[]>([
    {
      id: 'med-1',
      name: 'Telmisartan 40mg',
      dosage: '40mg Tablet',
      frequency: '1-0-0 (Morning)',
      duration: '30 Days',
      instructions: 'Take with glass of water after breakfast',
    },
    {
      id: 'med-2',
      name: 'Amlodipine 5mg',
      dosage: '5mg Tablet',
      frequency: '0-0-1 (Night)',
      duration: '30 Days',
      instructions: 'Take at bedtime',
    },
  ]);

  // New medicine form draft
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('500mg');
  const [newMedFrequency, setNewMedFrequency] = useState('1-0-1 (Twice Daily)');
  const [newMedDuration, setNewMedDuration] = useState('14 Days');
  const [newMedInstructions, setNewMedInstructions] = useState('After meals');

  // Lab test ordering state
  const [selectedLabTests, setSelectedLabTests] = useState<string[]>([
    'Serum Electrolytes',
    '24-Hour Ambulatory Blood Pressure (ABPM)',
  ]);
  const [customLabTest, setCustomLabTest] = useState('');

  // Follow-up state
  const [followUpDate, setFollowUpDate] = useState('2026-09-24');

  // Modal for generated prescription preview
  const [generatedPrescription, setGeneratedPrescription] = useState<Prescription | null>(null);

  const symptomPresets = [
    'Chest Pain',
    'Shortness of Breath',
    'Palpitations',
    'Dizziness',
    'Fatigue',
    'Headache',
    'Cough',
    'Edema',
    'Nausea',
  ];

  const labPresets = [
    'Lipid Profile Comprehensive',
    'Serum Creatinine & eGFR',
    'Echocardiogram (2D-Echo)',
    '12-Lead Resting ECG',
    'HbA1c Glycated Hemoglobin',
    'Complete Blood Count (CBC)',
  ];

  const toggleSymptom = (s: string) => {
    if (symptoms.includes(s)) {
      setSymptoms(symptoms.filter((item) => item !== s));
    } else {
      setSymptoms([...symptoms, s]);
    }
  };

  const addCustomSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSymptom.trim()) return;
    if (!symptoms.includes(customSymptom.trim())) {
      setSymptoms([...symptoms, customSymptom.trim()]);
    }
    setCustomSymptom('');
  };

  const toggleLabTest = (test: string) => {
    if (selectedLabTests.includes(test)) {
      setSelectedLabTests(selectedLabTests.filter((t) => t !== test));
    } else {
      setSelectedLabTests([...selectedLabTests, test]);
    }
  };

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;
    const newMed: MedicationItem = {
      id: `med-${Date.now()}`,
      name: newMedName.trim(),
      dosage: newMedDosage,
      frequency: newMedFrequency,
      duration: newMedDuration,
      instructions: newMedInstructions,
    };
    setMedications([...medications, newMed]);
    setNewMedName('');
    addToast('Medication Added', `${newMed.name} added to prescription draft`, 'info');
  };

  const removeMedicine = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
  };

  const handleSaveAndGenerate = () => {
    if (!diagnosis) {
      addToast('Missing Diagnosis', 'Please enter a clinical diagnosis.', 'warning');
      return;
    }

    const result = saveConsultation({
      patientId: patient.id,
      patientName: patient.name,
      doctorId: 'doc-1',
      doctorName: 'Dr. Vikram Mehta',
      diagnosis,
      symptoms,
      observations: clinicalObservations,
      treatmentPlan,
      medications,
      labTestsOrdered: selectedLabTests,
      followUpDate,
      notes: `Chief complaint: ${chiefComplaint}`,
    });

    setGeneratedPrescription(result.prescription);
  };

  const handleCompleteVisit = () => {
    handleSaveAndGenerate();
    setTimeout(() => {
      addToast('Visit Completed', `Patient ${patient.name} record updated and archived.`, 'success');
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="space-y-4">
      {/* Workspace Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 px-6 py-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Return to Dashboard"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse"></span>
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                Active Clinical Consultation Session
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-950 tracking-tight flex items-center gap-2">
              <span>Doctor Consultation Workspace</span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200 font-mono">
                ROOM 302
              </span>
            </h1>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveAndGenerate}
            className="px-4 py-2 bg-teal-50 border border-teal-300 text-teal-800 hover:bg-teal-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-teal-700" />
            <span>Generate Prescription</span>
          </button>

          <button
            onClick={handleCompleteVisit}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Visit</span>
          </button>
        </div>
      </div>

      {/* Three Column Medical Workspace (Section 14, 15, 16) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Patient Context (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Patient Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <img
                src={patient.avatar}
                alt={patient.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-sm truncate">{patient.name}</h3>
                <p className="text-xs text-slate-500 font-mono">#{patient.id.toUpperCase()}</p>
                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-600">
                  <span>{patient.age}y, {patient.gender}</span>
                  <span>•</span>
                  <span className="font-bold text-teal-700">{patient.bloodGroup}</span>
                </div>
              </div>
            </div>

            {/* Warning Alert: Allergies */}
            <div className="mt-3 p-2.5 bg-rose-50/80 border border-rose-200 rounded-xl text-xs">
              <div className="flex items-center gap-1.5 text-rose-800 font-bold uppercase tracking-wider text-[10px]">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Critical Allergy Warning</span>
              </div>
              <p className="text-rose-950 font-semibold mt-0.5">
                {patient.allergies.join(', ') || 'No Known Drug Allergies'}
              </p>
            </div>

            {/* Chronic Conditions */}
            <div className="mt-3 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Documented Chronic Issues
              </span>
              <div className="flex flex-wrap gap-1">
                {patient.chronicConditions.map((c) => (
                  <span
                    key={c}
                    className="bg-amber-50 text-amber-800 font-medium px-2 py-0.5 rounded text-[11px] border border-amber-200"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div className="mt-3 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Active Ongoing Rx
              </span>
              <div className="space-y-1">
                {patient.currentMedications.map((m) => (
                  <div key={m} className="p-1.5 bg-slate-50 rounded text-[11px] text-slate-700 font-medium">
                    • {m}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vitals Panel */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
                <span>Baseline Vitals</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Today</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Blood Pressure</span>
                <span className="font-bold text-slate-900 text-sm">{patient.vitals.bloodPressure}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Heart Rate</span>
                <span className="font-bold text-slate-900 text-sm">{patient.vitals.heartRate} bpm</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">SpO2 Oxygen</span>
                <span className="font-bold text-emerald-700 text-sm">{patient.vitals.oxygenSaturation}%</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Body Temp</span>
                <span className="font-bold text-slate-900 text-sm">{patient.vitals.temperature} °F</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Weight / BMI</span>
                <span className="font-bold text-slate-900 text-xs">
                  {patient.vitals.weight}kg ({patient.vitals.bmi})
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Resp. Rate</span>
                <span className="font-bold text-slate-900 text-xs">{patient.vitals.respiratoryRate}/min</span>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Clinical Notes, Symptoms, Diagnosis, Observations (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            {/* Chief Complaint */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Chief Complaint / Presenting Issue
              </label>
              <input
                type="text"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="e.g. Hypertension 3-month review, Exertional fatigue"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
              />
            </div>

            {/* Symptoms Checklist */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Observed / Reported Symptoms
              </label>
              <div className="flex flex-wrap gap-1.5">
                {symptomPresets.map((sym) => {
                  const isSelected = symptoms.includes(sym);
                  return (
                    <button
                      type="button"
                      key={sym}
                      onClick={() => toggleSymptom(sym)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-teal-700 text-white font-semibold shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {sym}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Symptom */}
              <form onSubmit={addCustomSymptom} className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Type custom symptom..."
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Clinical Observations */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Physical Examination & Clinical Observations
              </label>
              <textarea
                rows={3}
                value={clinicalObservations}
                onChange={(e) => setClinicalObservations(e.target.value)}
                placeholder="Cardiovascular, Respiratory, Abdominal, Neurological exam findings..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white resize-none"
              />
            </div>

            {/* Primary Diagnosis */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Definitive Diagnosis & ICD-10 Code
              </label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Essential Hypertension (I10), Acute Sinusitis (J01)"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
              />
            </div>

            {/* Treatment Plan & Instructions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Care Advice & Patient Lifestyle Instructions
              </label>
              <textarea
                rows={3}
                value={treatmentPlan}
                onChange={(e) => setTreatmentPlan(e.target.value)}
                placeholder="Diet, exercise, lifestyle modifications, precautions..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Prescription Builder & Lab Orders (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Prescription Medicines Builder (Section 15) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-teal-600" />
                <span>Prescription Builder</span>
              </h4>
              <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                {medications.length} Medicines
              </span>
            </div>

            {/* Active Medicine List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 block truncate">{med.name}</span>
                    <span className="text-[11px] text-teal-700 font-semibold block">{med.dosage}</span>
                    <span className="text-[11px] text-slate-500">
                      {med.frequency} • {med.duration}
                    </span>
                  </div>
                  <button
                    onClick={() => removeMedicine(med.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    title="Remove medicine"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Medicine Mini-Form */}
            <form onSubmit={handleAddMedicine} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
              <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                + Add Medication
              </span>
              <input
                type="text"
                placeholder="Medicine Name (e.g. Atorvastatin 20mg)"
                value={newMedName}
                onChange={(e) => setNewMedName(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-600"
                required
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Dosage (e.g. 20mg Tablet)"
                  value={newMedDosage}
                  onChange={(e) => setNewMedDosage(e.target.value)}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g. 30 Days)"
                  value={newMedDuration}
                  onChange={(e) => setNewMedDuration(e.target.value)}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <input
                type="text"
                placeholder="Frequency (e.g. 1-0-1 or 0-0-1 Night)"
                value={newMedFrequency}
                onChange={(e) => setNewMedFrequency(e.target.value)}
                className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />

              <input
                type="text"
                placeholder="Instructions (e.g. After meals)"
                value={newMedInstructions}
                onChange={(e) => setNewMedInstructions(e.target.value)}
                className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />

              <button
                type="submit"
                className="w-full py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Prescription</span>
              </button>
            </form>

            {/* Lab Orders Section */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Order Diagnostic Lab Tests
              </label>
              <div className="space-y-1.5">
                {labPresets.map((lab) => {
                  const isChecked = selectedLabTests.includes(lab);
                  return (
                    <label
                      key={lab}
                      className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer border transition-colors ${
                        isChecked
                          ? 'bg-teal-50 border-teal-300 text-teal-900 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleLabTest(lab)}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>{lab}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Follow-up Date */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Recommended Follow-up
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Prescription Preview Modal */}
      <PrescriptionSlipModal
        prescription={generatedPrescription}
        isOpen={!!generatedPrescription}
        onClose={() => setGeneratedPrescription(null)}
      />
    </div>
  );
};
