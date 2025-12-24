-- Library Work Automate - Supabase Database Schema
-- Paste this into your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Students Table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    address TEXT NOT NULL,
    mobile_number TEXT UNIQUE NOT NULL,
    admission_date DATE NOT NULL,
    user_name TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_removed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WOW Seat Records Table
CREATE TABLE wow_seat_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mobile_number TEXT UNIQUE NOT NULL REFERENCES students(mobile_number) ON DELETE CASCADE,
    seat_no TEXT DEFAULT '',
    batch_string TEXT DEFAULT 'N/A',
    shifts INTEGER DEFAULT 0,
    payment INTEGER DEFAULT 0,
    custom_rate INTEGER DEFAULT 0,
    fixed_total_payment INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings Table (Graph/Seat Allocation)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seat INTEGER NOT NULL,
    shift INTEGER NOT NULL CHECK (shift >= 1 AND shift <= 4),
    mobile_number TEXT NOT NULL REFERENCES students(mobile_number) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(seat, shift)
);

-- Payment Records Table
CREATE TABLE payment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mobile_number TEXT NOT NULL REFERENCES students(mobile_number) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    required_amount INTEGER NOT NULL,
    paid_amount INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(mobile_number, year, month)
);

-- Attendance Records Table
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mobile_number TEXT NOT NULL REFERENCES students(mobile_number) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    times JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(mobile_number, attendance_date)
);

-- Settings Table (for library location, QR code, seat count, etc.)
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES 
    ('total_seats', '50'),
    ('library_lat', '25.6127'),
    ('library_lng', '85.1589'),
    ('library_range', '20'),
    ('library_location_set', 'false'),
    ('qr_code', 'LibraryWorkAutomate_StaticQR_v1'),
    ('owner_mobile', '6201530654'),
    ('owner_password', 'Avinash')
ON CONFLICT (key) DO NOTHING;

-- Indexes for better performance
CREATE INDEX idx_students_mobile ON students(mobile_number);
CREATE INDEX idx_students_is_removed ON students(is_removed);
CREATE INDEX idx_bookings_mobile ON bookings(mobile_number);
CREATE INDEX idx_bookings_seat_shift ON bookings(seat, shift);
CREATE INDEX idx_payment_records_mobile ON payment_records(mobile_number);
CREATE INDEX idx_payment_records_year_month ON payment_records(year, month);
CREATE INDEX idx_attendance_date ON attendance_records(attendance_date);
CREATE INDEX idx_attendance_mobile ON attendance_records(mobile_number);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE wow_seat_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policies: Allow all operations (since we're using anon key and managing auth in frontend)
-- For production, you should implement proper auth policies

CREATE POLICY "Allow all on students" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on wow_seat_records" ON wow_seat_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on payment_records" ON payment_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on attendance_records" ON attendance_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on settings" ON settings FOR ALL USING (true) WITH CHECK (true);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wow_seat_records_updated_at BEFORE UPDATE ON wow_seat_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_records_updated_at BEFORE UPDATE ON payment_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_records_updated_at BEFORE UPDATE ON attendance_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
