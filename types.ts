
export enum Gender {
  MALE = 'Lab',
  FEMALE = 'Dhadig'
}

export enum RegistrationType {
  PAID = 'Lacag ah',
  FREE = 'Free ah'
}

export enum StudentStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface AppNotification {
  id: string;
  studentId: string;
  studentName: string;
  message: string;
  timestamp: string;
  type: 'success' | 'error' | 'info';
}

export interface Course {
  id: string;
  title: string;
  teacher: string;
  description: string;
  icon: string;
  color: string;
  level: string;
  thumbnail?: string; // New field for base64 image data
  createdAt: string;
}

export interface Student {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  birthDate: string;
  address: string;
  country: string;
  registrationDate: string;
  registrationType: RegistrationType;
  amount?: string;
  currency?: 'USD' | 'ETB';
  status: StudentStatus;
}

export interface AppState {
  students: Student[];
  courses: Course[];
  notifications: AppNotification[];
  view: 'landing' | 'dashboard' | 'register' | 'list' | 'pending-list' | 'ai-insights' | 'public-register' | 'public-success' | 'courses' | 'student-login' | 'manage-courses';
}
