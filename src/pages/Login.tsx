
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    name: '',
    role: '' as UserRole | ''
  });
  const { isAuthenticated, login } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email dan password harus diisi!');
      return;
    }

    setIsLoading(true);
    const success = await login(email, password);
    
    if (!success) {
      toast.error('Email atau password salah!');
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.email || !registerData.password || !registerData.name || !registerData.role) {
      toast.error('Semua field harus diisi!');
      return;
    }

    setIsLoading(true);
    try {
      // Sign up the user
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
        return;
      }

      // Update the profile with the correct role
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
      setShowRegister(false);
      setRegisterData({ email: '', password: '', name: '', role: '' });
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Terjadi kesalahan saat membuat akun');
    }
    setIsLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            🚛 Fuel Transport Tracker
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {showRegister ? 'Daftar akun baru' : 'Masuk ke sistem monitoring transport'}
          </p>
        </CardHeader>
        <CardContent>
          {!showRegister ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email Anda"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  disabled={isLoading}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Sedang masuk...' : 'Masuk'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  placeholder="Masukkan email"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <Input
                  id="reg-password"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  placeholder="Masukkan password"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-name">Nama</Label>
                <Input
                  id="reg-name"
                  type="text"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                  placeholder="Masukkan nama lengkap"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-role">Role</Label>
                <Select value={registerData.role} onValueChange={(value) => setRegisterData({...registerData, role: value as UserRole})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="pengawas_transportir">Pengawas Transportir</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="pengawas_depo">Pengawas Depo</SelectItem>
                    <SelectItem value="gl_pama">GL PAMA</SelectItem>
                    <SelectItem value="fuelman">Fuelman</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Sedang mendaftar...' : 'Daftar'}
              </Button>
            </form>
          )}

          <div className="mt-4 space-y-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowRegister(!showRegister)}
              disabled={isLoading}
            >
              {showRegister ? 'Kembali ke Login' : 'Daftar Akun Baru'}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full bg-yellow-50 hover:bg-yellow-100"
              onClick={createDemoUsers}
              disabled={isLoading}
            >
              {isLoading ? 'Membuat demo users...' : 'Buat Demo Users'}
            </Button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Demo Login:</h3>
            <div className="text-sm space-y-1">
              <p><strong>Admin:</strong> admin@fuel.com / admin123</p>
              <p><strong>Driver:</strong> driver@fuel.com / driver123</p>
              <p><strong>Fuelman:</strong> fuelman@fuel.com / fuelman123</p>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Klik "Buat Demo Users" untuk membuat akun demo ini.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
