export interface AnalyticsData {
  weeklyVolume: { day: string; scheduled: number; completed: number; noShows: number }[];
  monthlyConsultations: { month: string; consultations: number; followUps: number; newPatients: number }[];
  departmentPerformance: { department: string; appointments: number; avgDurationMin: number; satisfaction: number }[];
  patientDemographics: { ageGroup: string; percentage: number; count: number }[];
  keyMetrics: {
    totalAppointments: number;
    completedConsultations: number;
    noShowRate: string;
    followUpCompliance: string;
    avgConsultationDuration: string;
    patientGrowthMonthly: string;
    activePatients: number;
    labReportsProcessed: number;
  };
}

export const CLINICAL_ANALYTICS: AnalyticsData = {
  keyMetrics: {
    totalAppointments: 482,
    completedConsultations: 446,
    noShowRate: '3.8%',
    followUpCompliance: '91.4%',
    avgConsultationDuration: '18.4 min',
    patientGrowthMonthly: '+14.2%',
    activePatients: 1420,
    labReportsProcessed: 328,
  },
  weeklyVolume: [
    { day: 'Mon', scheduled: 38, completed: 36, noShows: 2 },
    { day: 'Tue', scheduled: 42, completed: 40, noShows: 1 },
    { day: 'Wed', scheduled: 45, completed: 44, noShows: 1 },
    { day: 'Thu', scheduled: 39, completed: 38, noShows: 1 },
    { day: 'Fri', scheduled: 44, completed: 42, noShows: 2 },
    { day: 'Sat', scheduled: 24, completed: 23, noShows: 1 },
    { day: 'Sun', scheduled: 0, completed: 0, noShows: 0 },
  ],
  monthlyConsultations: [
    { month: 'Mar', consultations: 380, followUps: 240, newPatients: 140 },
    { month: 'Apr', consultations: 410, followUps: 260, newPatients: 150 },
    { month: 'May', consultations: 435, followUps: 275, newPatients: 160 },
    { month: 'Jun', consultations: 460, followUps: 290, newPatients: 170 },
    { month: 'Jul', consultations: 490, followUps: 310, newPatients: 180 },
    { month: 'Aug', consultations: 520, followUps: 335, newPatients: 185 },
  ],
  departmentPerformance: [
    { department: 'Cardiology', appointments: 142, avgDurationMin: 22.5, satisfaction: 4.9 },
    { department: 'General Medicine', appointments: 168, avgDurationMin: 16.0, satisfaction: 4.8 },
    { department: 'Neurology', appointments: 88, avgDurationMin: 25.0, satisfaction: 4.9 },
    { department: 'Orthopedics', appointments: 94, avgDurationMin: 19.2, satisfaction: 4.7 },
    { department: 'Pediatrics', appointments: 76, avgDurationMin: 18.0, satisfaction: 4.9 },
    { department: 'Dermatology', appointments: 82, avgDurationMin: 14.5, satisfaction: 4.8 },
  ],
  patientDemographics: [
    { ageGroup: '0 - 17 yrs', percentage: 12, count: 170 },
    { ageGroup: '18 - 35 yrs', percentage: 34, count: 483 },
    { ageGroup: '36 - 55 yrs', percentage: 32, count: 454 },
    { ageGroup: '56+ yrs', percentage: 22, count: 313 },
  ],
};
