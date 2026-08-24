export type UserRole = 'doctor' | 'patient' | 'staff' | 'admin';

export interface Vitals {
  bloodPressure: string; // e.g. "120/80 mmHg"
  bpSystolic?: number;
  bpDiastolic?: number;
  heartRate: number; // bpm
  temperature: number; // °F or °C
  respiratoryRate: number; // breaths/min
  oxygenSaturation: number; // %
  weight: number; // kg
  height: number; // cm
  bmi: number;
  recordedAt: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  email: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  address: string;
  avatar: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  lastVisit: string;
  nextAppointment?: string;
  status: 'Active' | 'In Consultation' | 'Discharged' | 'Follow-up' | 'Waiting';
  vitals: Vitals;
  vitalsHistory: Vitals[];
  tags: string[];
  insuranceProvider?: string;
  policyNumber?: string;
  occupation?: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  department: string;
  experience: string;
  education: string;
  languages: string[];
  clinic: string;
  room: string;
  avatar: string;
  phone: string;
  email: string;
  bio: string;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  availableDays: string[];
  availableSlots: string[];
}

export type AppointmentStatus = 'Confirmed' | 'Waiting' | 'In Consultation' | 'Completed' | 'Cancelled';
export type AppointmentType = 'Consultation' | 'Follow-up' | 'Routine Checkup' | 'Emergency' | 'Telehealth' | 'Vaccination';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientAvatar?: string;
  patientBloodGroup?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar?: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:30 AM"
  type: AppointmentType;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  location: string;
  room?: string;
  createdAt: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string; // e.g. "500 mg"
  frequency: string; // e.g. "Twice daily"
  duration: string; // e.g. "5 days"
  instructions: string; // e.g. "After meals"
}

export interface Prescription {
  id: string;
  consultationId?: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientBloodGroup: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorRegistrationNumber: string;
  date: string;
  diagnosis: string;
  medications: MedicationItem[];
  instructions?: string;
  followUpDate?: string;
  doctorSignatureName: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
}

export interface LabParameter {
  name: string;
  result: string | number;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'Low' | 'High' | 'Critical';
  historical?: { date: string; value: number }[];
}

export type LabCategory = 'Blood' | 'Urine' | 'Imaging' | 'Pathology' | 'Other';
export type LabStatus = 'Available' | 'Pending' | 'In Review' | 'Completed' | 'Critical';

export interface LabReport {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  testName: string;
  category: LabCategory;
  collectionDate?: string;
  orderDate?: string;
  reportDate: string;
  laboratory: string;
  doctorId: string;
  doctorName: string;
  status: LabStatus;
  summary: string;
  doctorRemarks?: string;
  parameters: LabParameter[];
  trendData?: { date: string; value: number }[];
  fileUrl?: string;
  findings?: string;
  sampleType?: string;
}

export interface ConsultationNote {
  id: string;
  appointmentId?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  symptoms: string[];
  diagnosis: string;
  clinicalObservations: string;
  treatmentPlan: string;
  vitals: Vitals;
  orderedLabTests: string[];
  prescriptionId?: string;
  followUpDate?: string;
  status: 'Draft' | 'Completed';
}

export interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    type: string;
    size: string;
  };
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: UserRole;
  participantTitle?: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  messages: MessageItem[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'appointment' | 'report' | 'prescription' | 'message' | 'alert';
  read: boolean;
  link?: string;
}
