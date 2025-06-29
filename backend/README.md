
# Fuel Transport Tracker - Backend API

## Setup Instructions

### 1. Database Setup
1. Create MySQL database named `fuel_transport_tracker`
2. Import the schema from `database/schema.sql`

### 2. Server Configuration
1. Place the backend folder in your web server directory (e.g., `htdocs` for XAMPP)
2. Make sure `mod_rewrite` is enabled in Apache
3. Update database credentials in `config/database.php` if needed

### 3. Test the API
Visit: `http://localhost/backend/api/login` (should return method not allowed error - this is expected)

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration

### Profiles
- `GET /api/profile/:id` - Get user profile
- `GET /api/profiles` - Get all profiles (admin only)
- `POST /api/profiles` - Create new profile (admin only)

### Units
- `GET /api/units` - Get all units
- `POST /api/units` - Create new unit

### Logs
- `POST /api/loading-logs` - Create loading log
- `POST /api/segel-logs` - Create segel log
- `POST /api/keluar-pertamina-logs` - Create keluar pertamina log
- `POST /api/dokumen-logs` - Create dokumen log
- `POST /api/pengawas-depo-logs` - Create pengawas depo log
- `POST /api/fuelman-logs` - Create fuelman log
- `GET /api/fuelman-logs` - Get fuelman logs
- `GET /api/logs-by-unit/:unit_id` - Get all logs for specific unit

## Default Users (password: password123 for all)
- admin@fuel.com (Admin)
- driver@fuel.com (Driver) 
- fuelman@fuel.com (Fuelman)
- pengawas@fuel.com (Pengawas Transportir)
- depo@fuel.com (Pengawas Depo)
- gl@fuel.com (GL PAMA)

## File Uploads
- Files are stored in `/uploads/` directory
- Make sure this directory is writable by the web server
