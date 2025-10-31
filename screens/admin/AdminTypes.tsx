// ----- Types -----
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  discount?: number;
  demoVideo: string;
  lessons: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Mobile' | 'Web' | 'Programming' | 'Design' | 'Data Science' | 'AI';
  students: number;
  featured?: boolean;
  ratings?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  status: 'active' | 'blocked';
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: 'website' | 'social' | 'referral' | 'advertisement' | 'other';
  notes?: string;
  createdAt: string;
}

export interface ToastState {
  message: string;
  type: 'success' | 'error';
}
