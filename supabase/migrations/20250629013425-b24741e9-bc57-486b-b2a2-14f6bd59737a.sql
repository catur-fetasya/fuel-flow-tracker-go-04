
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'pengawas_transportir', 'driver', 'pengawas_depo', 'gl_pama', 'fuelman');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create units table
CREATE TABLE public.units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nomor_unit TEXT NOT NULL UNIQUE,
  driver_name TEXT NOT NULL,
  driver_id UUID REFERENCES public.profiles(id),
  pengawas_id UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create loading_logs table
CREATE TABLE public.loading_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  tanggal_mulai DATE NOT NULL,
  waktu_mulai TIME NOT NULL,
  tanggal_selesai DATE,
  waktu_selesai TIME,
  lokasi TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create segel_logs table
CREATE TABLE public.segel_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  foto_segel_url TEXT,
  nomor_segel_1 TEXT NOT NULL,
  nomor_segel_2 TEXT NOT NULL,
  lokasi TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dokumen_logs table
CREATE TABLE public.dokumen_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  foto_sampel_url TEXT,
  foto_do_url TEXT,
  foto_surat_jalan_url TEXT,
  lokasi TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create keluar_pertamina_logs table
CREATE TABLE public.keluar_pertamina_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  tanggal_keluar DATE NOT NULL,
  waktu_keluar TIME NOT NULL,
  lokasi TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ft_unloading_logs table
CREATE TABLE public.ft_unloading_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  waktu_mulai TIME NOT NULL,
  waktu_selesai TIME NOT NULL,
  foto_segel_url TEXT,
  lokasi TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pengawas_depo_logs table
CREATE TABLE public.pengawas_depo_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  waktu_tiba TIMESTAMP WITH TIME ZONE NOT NULL,
  foto_segel_url TEXT,
  foto_sib_url TEXT,
  foto_ftw_url TEXT,
  foto_p2h_url TEXT,
  msf_completed BOOLEAN DEFAULT FALSE,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fuelman_logs table
CREATE TABLE public.fuelman_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  waktu_mulai TIME,
  waktu_selesai TIME,
  foto_segel_url TEXT,
  lokasi TEXT NOT NULL,
  flowmeter_a TEXT,
  flowmeter_b TEXT,
  fm_awal NUMERIC,
  fm_akhir NUMERIC,
  status TEXT CHECK (status IN ('mulai', 'selesai')) NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loading_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.segel_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dokumen_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keluar_pertamina_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ft_unloading_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengawas_depo_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuelman_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'name', new.email),
    'driver'::user_role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER insert ON auth.users
  FOR each ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR UPDATE USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE USING (public.get_current_user_role() = 'admin');

-- RLS Policies for units
CREATE POLICY "Pengawas can view their own units" ON public.units
  FOR SELECT USING (pengawas_id = auth.uid());

CREATE POLICY "Drivers can view their assigned units" ON public.units
  FOR SELECT USING (driver_id = auth.uid());

CREATE POLICY "GL PAMA can view all units" ON public.units
  FOR SELECT USING (public.get_current_user_role() = 'gl_pama');

CREATE POLICY "Admins can view all units" ON public.units
  FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Pengawas can create units" ON public.units
  FOR INSERT WITH CHECK (public.get_current_user_role() = 'pengawas_transportir');

CREATE POLICY "Pengawas can update their own units" ON public.units
  FOR UPDATE USING (pengawas_id = auth.uid());

CREATE POLICY "Admins can manage all units" ON public.units
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- RLS Policies for loading_logs
CREATE POLICY "Users can view loading logs for their units" ON public.loading_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.units 
      WHERE units.id = loading_logs.unit_id 
      AND (units.pengawas_id = auth.uid() OR units.driver_id = auth.uid())
    )
  );

CREATE POLICY "GL PAMA can view all loading logs" ON public.loading_logs
  FOR SELECT USING (public.get_current_user_role() = 'gl_pama');

CREATE POLICY "Admins can view all loading logs" ON public.loading_logs
  FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Pengawas and drivers can create loading logs" ON public.loading_logs
  FOR INSERT WITH CHECK (
    public.get_current_user_role() IN ('pengawas_transportir', 'driver') AND
    EXISTS (
      SELECT 1 FROM public.units 
      WHERE units.id = loading_logs.unit_id 
      AND (units.pengawas_id = auth.uid() OR units.driver_id = auth.uid())
    )
  );

-- Apply similar RLS patterns to other log tables
CREATE POLICY "Users can view segel logs for their units" ON public.segel_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.units 
      WHERE units.id = segel_logs.unit_id 
      AND (units.pengawas_id = auth.uid() OR units.driver_id = auth.uid())
    )
  );

CREATE POLICY "GL PAMA can view all segel logs" ON public.segel_logs
  FOR SELECT USING (public.get_current_user_role() = 'gl_pama');

CREATE POLICY "Admins can view all segel logs" ON public.segel_logs
  FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Pengawas and drivers can create segel logs" ON public.segel_logs
  FOR INSERT WITH CHECK (
    public.get_current_user_role() IN ('pengawas_transportir', 'driver') AND
    EXISTS (
      SELECT 1 FROM public.units 
      WHERE units.id = segel_logs.unit_id 
      AND (units.pengawas_id = auth.uid() OR units.driver_id = auth.uid())
    )
  );

-- Similar policies for other tables
CREATE POLICY "Drivers can view their keluar pertamina logs" ON public.keluar_pertamina_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.units 
      WHERE units.id = keluar_pertamina_logs.unit_id 
      AND units.driver_id = auth.uid()
    )
  );

CREATE POLICY "GL PAMA can view all keluar pertamina logs" ON public.keluar_pertamina_logs
  FOR SELECT USING (public.get_current_user_role() = 'gl_pama');

CREATE POLICY "Drivers can create keluar pertamina logs" ON public.keluar_pertamina_logs
  FOR INSERT WITH CHECK (
    public.get_current_user_role() = 'driver' AND
    EXISTS (
      SELECT 1 FROM public.units 
      WHERE units.id = keluar_pertamina_logs.unit_id 
      AND units.driver_id = auth.uid()
    )
  );

-- Fuelman policies
CREATE POLICY "Fuelman can view all fuelman logs" ON public.fuelman_logs
  FOR SELECT USING (public.get_current_user_role() = 'fuelman');

CREATE POLICY "GL PAMA can view all fuelman logs" ON public.fuelman_logs
  FOR SELECT USING (public.get_current_user_role() = 'gl_pama');

CREATE POLICY "Fuelman can create fuelman logs" ON public.fuelman_logs
  FOR INSERT WITH CHECK (public.get_current_user_role() = 'fuelman');

CREATE POLICY "Fuelman can update their own logs" ON public.fuelman_logs
  FOR UPDATE USING (created_by = auth.uid() AND public.get_current_user_role() = 'fuelman');

-- Pengawas Depo policies
CREATE POLICY "Pengawas depo can view all depo logs" ON public.pengawas_depo_logs
  FOR SELECT USING (public.get_current_user_role() = 'pengawas_depo');

CREATE POLICY "GL PAMA can view all depo logs" ON public.pengawas_depo_logs
  FOR SELECT USING (public.get_current_user_role() = 'gl_pama');

CREATE POLICY "Pengawas depo can create depo logs" ON public.pengawas_depo_logs
  FOR INSERT WITH CHECK (public.get_current_user_role() = 'pengawas_depo');

CREATE POLICY "Pengawas depo can update their own logs" ON public.pengawas_depo_logs
  FOR UPDATE USING (created_by = auth.uid() AND public.get_current_user_role() = 'pengawas_depo');
