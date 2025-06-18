
export type UserRole = 'educator' | 'student';

export interface UserProfile {
  id: string;
  user_id: string;
  role: UserRole;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile extends UserProfile {
  role: 'student';
  total_xp: number;
  level: number;
  badges: any[];
  preferences: any;
  class_codes: string[];
}

export interface EducatorProfile extends UserProfile {
  role: 'educator';
  school: string | null;
  subject_specialties: string[];
}
