
import React, { useState } from 'react';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { useProfiles } from '../hooks/useProfiles';

const AdminDashboard = () => {
  const { profiles, loading, createUser } = useProfiles();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: ''
  });

  const roles = [
    { value: 'pengawas_transportir', label: 'Pengawas Transportir' },
    { value: 'driver', label: 'Driver Transportir' },
    { value: 'pengawas_depo', label: 'Pengawas Depo' },
    { value: 'gl_pama', label: 'GL PAMA' },
    { value: 'fuelman', label: 'Fuelman' }
  ];

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role || !formData.password) {
      toast.error('Semua field harus diisi!');
      return;
    }

    const result = await createUser(formData);
    if (result) {
      setFormData({ name: '', email: '', role: '', password: '' });
      setShowForm(false);
      toast.success('User berhasil dibuat!');
    } else {
      toast.error('Gagal membuat user!');
    }
  };

  const getRoleLabel = (role: string) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj?.label || role;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <Header />
          <div className="text-center mt-8">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-blue-500 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{profiles.filter(u => u.role === 'driver').length}</div>
              <div className="text-blue-100">Total Driver</div>
            </CardContent>
          </Card>
          <Card className="bg-green-500 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{profiles.filter(u => u.role === 'pengawas_transportir').length}</div>
              <div className="text-green-100">Pengawas Transportir</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-500 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{profiles.filter(u => u.role === 'pengawas_depo').length}</div>
              <div className="text-purple-100">Pengawas Depo</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-500 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{profiles.length}</div>
              <div className="text-orange-100">Total Users</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Manajemen User</CardTitle>
            <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700">
              {showForm ? 'Batal' : '+ Tambah User'}
            </Button>
          </CardHeader>
          <CardContent>
            {showForm && (
              <Card className="mb-6 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">Tambah User Baru</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="Masukkan email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="Masukkan password"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Button type="submit" className="bg-green-600 hover:bg-green-700 mr-2">
                        Simpan User
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                        Batal
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Nama</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile) => (
                    <tr key={profile.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{profile.name}</td>
                      <td className="p-2 text-gray-600">{profile.email}</td>
                      <td className="p-2">
                        <Badge variant="outline">{getRoleLabel(profile.role)}</Badge>
                      </td>
                      <td className="p-2">
                        <Button variant="outline" size="sm" className="mr-1">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
