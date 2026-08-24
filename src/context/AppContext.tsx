import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Patient,
  Doctor,
  Appointment,
  Prescription,
  LabReport,
  Conversation,
  NotificationItem,
  UserRole,
  AppointmentStatus,
  Vitals,
  ConsultationNote,
} from '../types';
import { INITIAL_PATIENTS } from '../data/patients';
import { INITIAL_DOCTORS } from '../data/doctors';
import { INITIAL_APPOINTMENTS } from '../data/appointments';
import { INITIAL_PRESCRIPTIONS } from '../data/prescriptions';
import { INITIAL_LAB_REPORTS } from '../data/labReports';
import { INITIAL_CONVERSATIONS } from '../data/messages';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Navigation & User
  currentRoute: string;
  navigate: (path: string) => void;
  userRole: UserRole;
  switchRole: (role: UserRole) => void;
  currentDoctor: Doctor;
  currentPatient: Patient;
  setCurrentPatientById: (id: string) => void;
  
  // Data Collections
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  labReports: LabReport[];
  conversations: Conversation[];
  notifications: NotificationItem[];
  consultationNotes: ConsultationNote[];
  
  // Actions
  addAppointment: (appointmentData: Partial<Appointment> & { patientId: string; doctorId: string; date: string; time: string; reason: string }) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  rescheduleAppointment: (id: string, date: string, time: string) => void;
  cancelAppointment: (id: string) => void;
  
  addPrescription: (prescriptionData: Omit<Prescription, 'id'>) => Prescription;
  updatePatientVitals: (patientId: string, vitals: Vitals) => void;
  saveConsultation: (note: Omit<ConsultationNote, 'id'>) => ConsultationNote;
  
  sendMessage: (conversationId: string, text: string, attachment?: { name: string; type: string; size: string }) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // UI Helpers
  isMaskingSensitiveData: boolean;
  toggleSensitiveDataMask: () => void;
  toasts: ToastItem[];
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  
  // Active Consultation tracking
  activeConsultationPatientId: string;
  setActiveConsultationPatientId: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PATIENTS: 'medora_patients_v1',
  APPOINTMENTS: 'medora_appointments_v1',
  PRESCRIPTIONS: 'medora_prescriptions_v1',
  LAB_REPORTS: 'medora_lab_reports_v1',
  CONVERSATIONS: 'medora_conversations_v1',
  ROLE: 'medora_user_role_v1',
  CURRENT_PATIENT_ID: 'medora_current_patient_id_v1',
  CONSULTATIONS: 'medora_consultations_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Route state initialized from window.location.pathname or default /dashboard
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const path = window.location.pathname;
    if (path && path !== '/' && path !== '') {
      return path;
    }
    return '/dashboard';
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    if (saved === 'patient' || saved === 'doctor' || saved === 'staff' || saved === 'admin') {
      return saved;
    }
    return 'doctor';
  });

  // Master entities
  const [doctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const currentDoctor = doctors[0]; // Dr. Vikram Mehta

  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  const [currentPatientId, setCurrentPatientId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_PATIENT_ID);
    return saved || 'pat-2'; // Priya Patel as default patient user
  });

  const currentPatient = patients.find((p) => p.id === currentPatientId) || patients[1] || patients[0];

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
      return saved ? JSON.parse(saved) : INITIAL_PRESCRIPTIONS;
    } catch {
      return INITIAL_PRESCRIPTIONS;
    }
  });

  const [labReports, setLabReports] = useState<LabReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LAB_REPORTS);
      return saved ? JSON.parse(saved) : INITIAL_LAB_REPORTS;
    } catch {
      return INITIAL_LAB_REPORTS;
    }
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  const [consultationNotes, setConsultationNotes] = useState<ConsultationNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'New Lab Report Ready',
      description: 'Aarav Sharma - Complete Metabolic & Lipid Profile is finalized.',
      time: '15 mins ago',
      type: 'report',
      read: false,
      link: '/lab-reports/lab-301',
    },
    {
      id: 'notif-2',
      title: 'Patient Checked In',
      description: 'Priya Patel is in the consultation room (Suite 204).',
      time: '25 mins ago',
      type: 'appointment',
      read: false,
      link: '/consultations/pat-2',
    },
    {
      id: 'notif-3',
      title: 'Prescription Refill Requested',
      description: 'David Miller requested a refill authorization for Rosuvastatin.',
      time: '1 hour ago',
      type: 'prescription',
      read: true,
      link: '/prescriptions',
    },
    {
      id: 'notif-4',
      title: 'Vitals Alert: BP Review',
      description: 'Robert Chen fasting glucose logged at 166 mg/dL.',
      time: '2 hours ago',
      type: 'alert',
      read: false,
      link: '/patients/pat-3',
    },
  ]);

  const [isMaskingSensitiveData, setIsMaskingSensitiveData] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [activeConsultationPatientId, setActiveConsultationPatientId] = useState<string>('pat-1');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LAB_REPORTS, JSON.stringify(labReports));
  }, [labReports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PATIENT_ID, currentPatientId);
  }, [currentPatientId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultationNotes));
  }, [consultationNotes]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path && path !== '') {
        setCurrentRoute(path);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path: string) => {
    setCurrentRoute(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const addToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setUserRole(role);
    if (role === 'patient') {
      navigate('/patient');
    } else {
      navigate('/dashboard');
    }
    addToast('Role Switched', `Switched active workspace to ${role.toUpperCase()}`, 'info');
  }, [navigate, addToast]);

  const setCurrentPatientById = useCallback((id: string) => {
    setCurrentPatientId(id);
  }, []);

  const toggleSensitiveDataMask = useCallback(() => {
    setIsMaskingSensitiveData((prev) => !prev);
    addToast('Privacy Mask', isMaskingSensitiveData ? 'Sensitive data revealed' : 'Sensitive health identifiers masked', 'info');
  }, [isMaskingSensitiveData, addToast]);

  // Appointments actions
  const addAppointment = useCallback((data: Partial<Appointment> & { patientId: string; doctorId: string; date: string; time: string; reason: string }) => {
    const patient = patients.find((p) => p.id === data.patientId);
    const doctor = doctors.find((d) => d.id === data.doctorId);

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: data.patientId,
      patientName: data.patientName || patient?.name || 'New Patient',
      patientAge: data.patientAge || patient?.age || 30,
      patientGender: data.patientGender || patient?.gender || 'Other',
      patientBloodGroup: patient?.bloodGroup || 'O+',
      patientAvatar: patient?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      doctorId: data.doctorId,
      doctorName: data.doctorName || doctor?.name || 'Dr. Vikram Mehta',
      doctorSpecialty: doctor?.specialty || 'Cardiology',
      doctorAvatar: doctor?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=250&auto=format&fit=crop&q=80',
      date: data.date,
      time: data.time,
      type: data.type || 'Consultation',
      status: 'Confirmed',
      reason: data.reason,
      notes: data.notes || '',
      location: data.location || doctor?.clinic || 'Medora Main Clinic, Suite 302',
      room: doctor?.room || 'Room 302',
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    // Update patient nextAppointment field if date is upcoming
    setPatients((prev) =>
      prev.map((p) =>
        p.id === data.patientId
          ? {
              ...p,
              nextAppointment: `${data.date} at ${data.time}`,
              status: 'Active',
            }
          : p
      )
    );

    addToast('Appointment Scheduled', `Confirmed for ${newAppointment.patientName} with ${newAppointment.doctorName} on ${data.date} at ${data.time}`, 'success');
    return newAppointment;
  }, [patients, doctors, addToast]);

  const updateAppointmentStatus = useCallback((id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
    addToast('Status Updated', `Appointment marked as ${status}`, 'info');
  }, [addToast]);

  const rescheduleAppointment = useCallback((id: string, date: string, time: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, date, time, status: 'Confirmed' } : apt))
    );
    addToast('Appointment Rescheduled', `Updated to ${date} at ${time}`, 'success');
  }, [addToast]);

  const cancelAppointment = useCallback((id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'Cancelled' } : apt))
    );
    addToast('Appointment Cancelled', 'The scheduled slot has been released.', 'warning');
  }, [addToast]);

  // Prescriptions actions
  const addPrescription = useCallback((data: Omit<Prescription, 'id'>) => {
    const newRx: Prescription = {
      ...data,
      id: `rx-${Date.now()}`,
    };
    setPrescriptions((prev) => [newRx, ...prev]);

    // Update patient active medications in profile
    const newMedNames = data.medications.map((m) => `${m.name} ${m.dosage} (${m.frequency})`);
    setPatients((prev) =>
      prev.map((p) =>
        p.id === data.patientId
          ? {
              ...p,
              currentMedications: Array.from(new Set([...p.currentMedications, ...newMedNames])),
              lastVisit: data.date,
            }
          : p
      )
    );

    addToast('Prescription Generated', `Prescription #${newRx.id} created for ${data.patientName}`, 'success');
    return newRx;
  }, [addToast]);

  const updatePatientVitals = useCallback((patientId: string, vitals: Vitals) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          const history = p.vitalsHistory ? [...p.vitalsHistory, vitals] : [vitals];
          return {
            ...p,
            vitals,
            vitalsHistory: history,
          };
        }
        return p;
      })
    );
    addToast('Vitals Recorded', `Updated vitals for ${patientId}`, 'success');
  }, [addToast]);

  const saveConsultation = useCallback((noteData: Omit<ConsultationNote, 'id'>) => {
    const newNote: ConsultationNote = {
      ...noteData,
      id: `con-${Date.now()}`,
    };
    setConsultationNotes((prev) => [newNote, ...prev]);

    // Also update patient lastVisit
    setPatients((prev) =>
      prev.map((p) =>
        p.id === noteData.patientId
          ? {
              ...p,
              lastVisit: noteData.date,
              status: 'Follow-up',
            }
          : p
      )
    );

    addToast('Consultation Saved', `Consultation record #${newNote.id} documented successfully.`, 'success');
    return newNote;
  }, [addToast]);

  const sendMessage = useCallback((conversationId: string, text: string, attachment?: { name: string; type: string; size: string }) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: userRole === 'patient' ? currentPatient.id : currentDoctor.id,
      senderName: userRole === 'patient' ? currentPatient.name : currentDoctor.name,
      senderRole: userRole,
      senderAvatar: userRole === 'patient' ? currentPatient.avatar : currentDoctor.avatar,
      text,
      timestamp: 'Just now',
      attachment,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: text || (attachment ? `Sent ${attachment.name}` : 'Attachment'),
            lastMessageTime: 'Just now',
            messages: [...conv.messages, newMsg],
          };
        }
        return conv;
      })
    );
  }, [userRole, currentPatient, currentDoctor]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('Notifications', 'All notifications marked as read', 'info');
  }, [addToast]);

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigate,
        userRole,
        switchRole,
        currentDoctor,
        currentPatient,
        setCurrentPatientById,
        patients,
        doctors,
        appointments,
        prescriptions,
        labReports,
        conversations,
        notifications,
        consultationNotes,
        addAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        cancelAppointment,
        addPrescription,
        updatePatientVitals,
        saveConsultation,
        sendMessage,
        markNotificationRead,
        markAllNotificationsRead,
        isMaskingSensitiveData,
        toggleSensitiveDataMask,
        toasts,
        addToast,
        removeToast,
        activeConsultationPatientId,
        setActiveConsultationPatientId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
