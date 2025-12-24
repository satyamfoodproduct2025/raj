# Library Work Automate

A comprehensive Library Management System built with React, TypeScript, Vite, and Supabase.

## Features

### Admin Features (Owner Dashboard)
- **Students Data Management**: Add, edit, remove, and view all registered students
- **WOW Seat Allocation**: Manage seat bookings with 4 shifts per day
- **Seat Graph**: Visual booking dashboard for seat management (up to 500 seats)
- **Payment Details**: Track monthly payments with partial/full payment support
- **Attendance Log**: Monitor student attendance with calendar view
- **QR & Location**: Set up library location and QR code for attendance verification
- **Make Payment**: Process payments for students

### Student Features
- **Student Dashboard**: View seat allocation and shift information
- **Mark Attendance**: GPS + QR code verification
- **Payment Portal**: View due payments and make online payments
- **Attendance History**: View monthly attendance calendar

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL)
- **Styling**: Custom CSS with Montserrat font
- **Icons**: Font Awesome 6
- **Routing**: React Router v6
- **Date Handling**: date-fns

## Supabase Setup

### 1. Create Supabase Project
Go to [Supabase](https://supabase.com) and create a new project.

### 2. Run SQL Schema
Copy the contents of `supabase-schema.sql` and paste it into your Supabase SQL Editor to create all necessary tables:

- `students` - Student records with auth credentials
- `wow_seat_records` - Seat allocation and shift tracking
- `bookings` - Individual seat/shift bookings
- `payment_records` - Payment history with partial payment support
- `attendance_records` - Daily attendance with time tracking
- `settings` - System configuration (QR code, location, etc.)

### 3. Configure Environment
The Supabase URL and anon key are already configured in `src/lib/supabase.ts`:
- Project ID: `ytsdcglnbxpybdfnucjn`
- URL: `https://ytsdcglnbxpybdfnucjn.supabase.co`

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Default Credentials

### Owner Login
- Mobile: `6201530654`
- Password: `Avinash`

### Student Login
Students can log in using their mobile number as username and auto-generated password (visible in Students Data table).

## Deployment

### Cloudflare Pages

1. Build the project:
```bash
npm run build
```

2. Deploy to Cloudflare Pages:
```bash
npm install -g wrangler
wrangler pages deploy dist --project-name library-work-automate
```

### Other Platforms

The app can be deployed to any static hosting service (Vercel, Netlify, etc.) by deploying the `dist` folder after building.

## Project Structure

```
webapp/
├── src/
│   ├── lib/
│   │   └── supabase.ts          # Supabase client & types
│   ├── pages/
│   │   ├── LoginPage.tsx        # Login with owner/student tabs
│   │   ├── OwnerDashboard.tsx   # Admin dashboard
│   │   ├── StudentDashboard.tsx # Student dashboard
│   │   ├── StudentsData.tsx     # Student management
│   │   ├── WOWView.tsx          # Seat allocation view
│   │   ├── SeatGraph.tsx        # Interactive seat booking
│   │   ├── PayDetails.tsx       # Payment tracking
│   │   ├── AttendanceLog.tsx    # Attendance monitoring
│   │   ├── QRLocation.tsx       # QR & GPS setup
│   │   └── MakePayment.tsx      # Payment processing
│   ├── App.tsx                  # Main app with routing
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── public/                      # Static assets
├── supabase-schema.sql         # Database schema
├── index.html                  # HTML template
├── vite.config.ts              # Vite configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## Features Implementation Status

✅ **Completed**:
- Login system (Owner/Student)
- Owner Dashboard with all navigation
- Student Dashboard with seat info
- Students Data (Add, Edit, Remove, Re-add)
- WOW View (Display seat allocations)
- Supabase integration
- Responsive design
- Print functionality

🚧 **In Progress**:
- Seat Graph interactive booking
- Payment modals with partial/full payment
- Attendance calendar with GPS + QR verification
- QR code generation and location setup
- Payment processing
- Complete WOW editing functionality

## Data Models

### Students
- Full name, father name, address
- Mobile number (unique, used for login)
- Admission date
- Auto-generated password
- Soft delete support (is_removed flag)

### Bookings
- Seat number (1-500 configurable)
- Shift (1-4: 6AM-10AM, 10AM-2PM, 2PM-6PM, 6PM-10PM)
- Student reference

### Payments
- Monthly tracking (year + month)
- Required amount (based on shifts × rate)
- Paid amount (supports partial payments)
- Custom per-shift rate override
- Fixed total payment override

### Attendance
- Daily date tracking
- Multiple time entries per day (in/out times)
- GPS location verification
- QR code scanning

## Usage

### Adding Students
1. Navigate to Students Data
2. Click "Add New" button
3. Fill in student details
4. System auto-generates username (mobile) and password
5. WOW seat record is automatically created

### Managing Seats (WOW)
1. Navigate to WOW page
2. Enter seat number (e.g., "5" for full day, "5.1" for seat 5, shift 1)
3. System calculates payment based on:
   - Number of shifts × default rate (₹300)
   - OR custom per-shift rate override
   - OR fixed total payment override

### Payment Tracking
- Tracks all months from admission date to current
- Shows due months with admission date tracking
- Supports partial payments with remaining balance
- Colors indicate: ✓ (paid), yellow ✓ (partial), blank (unpaid)

## Important Notes

1. **Data Persistence**: All data is stored in Supabase PostgreSQL
2. **Password Generation**: Auto-generated as `[First4LettersOfName][Last4DigitsOfMobile]`
3. **Soft Delete**: Removed students keep their index and mobile number for data integrity
4. **Seat Allocation**: Supports 1-500 seats with 4 shifts each (configurable)
5. **Payment Calculation**: Automatically calculates based on shifts and custom rates

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.
