
-- Create database
CREATE DATABASE IF NOT EXISTS fuel_transport_tracker;
USE fuel_transport_tracker;

-- Create profiles table
CREATE TABLE profiles (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'pengawas_transportir', 'driver', 'pengawas_depo', 'gl_pama', 'fuelman') NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create units table
CREATE TABLE units (
    id VARCHAR(50) PRIMARY KEY,
    nomor_unit VARCHAR(100) NOT NULL UNIQUE,
    driver_name VARCHAR(255) NOT NULL,
    driver_id VARCHAR(50),
    pengawas_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (pengawas_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create loading_logs table
CREATE TABLE loading_logs (
    id VARCHAR(50) PRIMARY KEY,
    unit_id VARCHAR(50) NOT NULL,
    tanggal_mulai DATE NOT NULL,
    waktu_mulai TIME NOT NULL,
    tanggal_selesai DATE NULL,
    waktu_selesai TIME NULL,
    lokasi TEXT NOT NULL,
    created_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create segel_logs table
CREATE TABLE segel_logs (
    id VARCHAR(50) PRIMARY KEY,
    unit_id VARCHAR(50) NOT NULL,
    foto_segel_url TEXT NULL,
    nomor_segel_1 VARCHAR(100) NOT NULL,
    nomor_segel_2 VARCHAR(100) NOT NULL,
    lokasi TEXT NOT NULL,
    created_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create dokumen_logs table
CREATE TABLE dokumen_logs (
    id VARCHAR(50) PRIMARY KEY,
    unit_id VARCHAR(50) NOT NULL,
    foto_sampel_url TEXT NULL,
    foto_do_url TEXT NULL,
    foto_surat_jalan_url TEXT NULL,
    lokasi TEXT NOT NULL,
    created_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create keluar_pertamina_logs table
CREATE TABLE keluar_pertamina_logs (
    id VARCHAR(50) PRIMARY KEY,
    unit_id VARCHAR(50) NOT NULL,
    tanggal_keluar DATE NOT NULL,
    waktu_keluar TIME NOT NULL,
    lokasi TEXT NOT NULL,
    created_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create ft_unloading_logs table
CREATE TABLE ft_unloading_logs (
    id VARCHAR(50) PRIMARY KEY,
    unit_id VARCHAR(50) NOT NULL,
    waktu_mulai TIME NOT NULL,
    waktu_selesai TIME NOT NULL,
    foto_segel_url TEXT NULL,
    lokasi TEXT NOT NULL,
    created_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create pengawas_depo_logs table
CREATE TABLE pengawas_depo_logs (
    id VARCHAR(50) PRIMARY KEY,
    unit_id VARCHAR(50) NOT NULL,
    waktu_tiba TIMESTAMP NOT NULL,
    foto_segel_url TEXT NULL,
    foto_sib_url TEXT NULL,
    foto_ftw_url TEXT NULL,
    foto_p2h_url TEXT NULL,
    msf_completed BOOLEAN DEFAULT FALSE,
    created_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create fuelman_logs table
CREATE TABLE fuelman_logs (
    id VARCHAR(50) PRIMARY KEY,
    unit_id VARCHAR(50) NOT NULL,
    waktu_mulai TIME NULL,
    waktu_selesai TIME NULL,
    foto_segel_url TEXT NULL,
    lokasi TEXT NOT NULL,
    flowmeter_a VARCHAR(100) NULL,
    flowmeter_b VARCHAR(100) NULL,
    fm_awal DECIMAL(10,2) NULL,
    fm_akhir DECIMAL(10,2) NULL,
    status ENUM('mulai', 'selesai') NOT NULL,
    created_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Insert dummy data
INSERT INTO profiles (id, email, name, role, password) VALUES
('admin1', 'admin@fuel.com', 'Admin User', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password: admin123
('driver1', 'driver@fuel.com', 'Driver User', 'driver', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password: driver123
('fuelman1', 'fuelman@fuel.com', 'Fuelman User', 'fuelman', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password: fuelman123
('pengawas1', 'pengawas@fuel.com', 'Pengawas Transportir', 'pengawas_transportir', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password: pengawas123
('depo1', 'depo@fuel.com', 'Pengawas Depo', 'pengawas_depo', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password: depo123
('gl1', 'gl@fuel.com', 'GL PAMA', 'gl_pama', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); -- password: gl123

INSERT INTO units (id, nomor_unit, driver_name, driver_id, pengawas_id) VALUES
('unit1', 'TRK001', 'Budi Santoso', 'driver1', 'pengawas1'),
('unit2', 'TRK002', 'Ahmad Yani', NULL, 'pengawas1'),
('unit3', 'TRK003', 'Siti Nurhaliza', NULL, 'pengawas1');
