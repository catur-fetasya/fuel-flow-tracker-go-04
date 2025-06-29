
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

export const useAuthActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error('Email dan password harus diisi!');
      return false;
    }

    setIsLoading(true);
    const success = await login(email, password);
    
    if (!success) {
      toast.error('Email atau password salah!');
    }
    setIsLoading(false);
    return success;
  };

  const handleRegister = async (registerData: {
    email: string;
    password: string;
    name: string;
    role: UserRole | '';
  }) => {
    if (!registerData.email || !registerData.password || !registerData.name || !registerData.role) {
      toast.error('Semua field harus diisi!');
      return false;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            name: registerData.name,
          }
        }
      });

      if (error) {
        toast.error('Gagal membuat akun: ' + error.message);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: registerData.email,
            name: registerData.name,
            role: registerData.role as UserRole
          });

        if (profileError) {
          console.error('Error updating profile:', profileError);
        }
      }

      toast.success('Akun berhasil dibuat!');
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Terjadi kesalahan saat membuat akun');
      setIsLoading(false);
      return false;
    }
  };

  const createDemoUsers = async () => {
    setIsLoading(true);
    const demoUsers: Array<{ email: string; password: string; name: string; role: UserRole }> = [
      { email: 'admin@fuel.com', password: 'admin123', name: 'Admin User', role: 'admin' },
      { email: 'driver@fuel.com', password: 'driver123', name: 'Driver User', role: 'driver' },
      { email: 'fuelman@fuel.com', password: 'fuelman123', name: 'Fuelman User', role: 'fuelman' }
    ];

    let successCount = 0;
    for (const user of demoUsers) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: { name: user.name }
          }
        });

        if (!error && data.user) {
          await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              email: user.email,
              name: user.name,
              role: user.role
            });
          successCount++;
        }
      } catch (error) {
        console.error(`Error creating ${user.email}:`, error);
      }
    }

    toast.success(`${successCount} demo users berhasil dibuat!`);
    setIsLoading(false);
  };

  return {
    isLoading,
    handleLogin,
    handleRegister,
    createDemoUsers
  };
};
