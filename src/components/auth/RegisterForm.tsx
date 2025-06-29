
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

interface RegisterFormProps {
  onSubmit: (data: {
    email: string;
    password: string;
    name: string;
    role: UserRole | '';
  }) => Promise<boolean>;
  isLoading: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    name: '',
    role: '' as UserRole | ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(registerData);
    if (success) {
      setRegisterData({ email: '', password: '', name: '', role: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
  );
};
