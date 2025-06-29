
-- Create a function to help with user creation (without modifying existing constraints)
CREATE OR REPLACE FUNCTION create_demo_user(
  p_email TEXT,
  p_name TEXT,
  p_role user_role
) RETURNS VOID AS $$
BEGIN
  -- This is a placeholder - actual user creation needs to be done via Supabase Auth
  RAISE NOTICE 'Demo user % with role % needs to be created via Supabase Auth', p_email, p_role;
END;
$$ LANGUAGE plpgsql;

-- Call the function for our demo users
SELECT create_demo_user('admin@fuel.com', 'Admin User', 'admin');
SELECT create_demo_user('driver@fuel.com', 'Driver User', 'driver');
SELECT create_demo_user('fuelman@fuel.com', 'Fuelman User', 'fuelman');
SELECT create_demo_user('pengawas@fuel.com', 'Pengawas User', 'pengawas_transportir');
SELECT create_demo_user('depo@fuel.com', 'Pengawas Depo User', 'pengawas_depo');
SELECT create_demo_user('gl@fuel.com', 'GL PAMA User', 'gl_pama');
