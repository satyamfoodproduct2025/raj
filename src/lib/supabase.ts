import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ytsdcglnbxpybdfnucjn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0c2RjZ2xuYnhweWJkZm51Y2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNTc4MjQsImV4cCI6MjA4MTczMzgyNH0.k23-pdsw4fqRUMXp3-MMG1strgQa_J8hGBMlE1HATwg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Student {
  id: string;
  full_name: string;
  father_name: string;
  address: string;
  mobile_number: string;
  admission_date: string;
  user_name: string;
  password: string;
  is_removed: boolean;
  created_at: string;
  updated_at: string;
}

export interface WowSeatRecord {
  id: string;
  mobile_number: string;
  seat_no: string;
  batch_string: string;
  shifts: number;
  payment: number;
  custom_rate: number;
  fixed_total_payment: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  seat: number;
  shift: number;
  mobile_number: string;
  student_name: string;
  student_address: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  id: string;
  mobile_number: string;
  year: number;
  month: number;
  required_amount: number;
  paid_amount: number;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: string;
  mobile_number: string;
  attendance_date: string;
  times: { in: string; out: string }[];
  created_at: string;
  updated_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}
