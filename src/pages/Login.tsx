
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Login berhasil!');
        navigate(from, { replace: true });
      } else {
        toast.error('Email atau password salah!');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem!');
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { role: 'Admin', email: 'admin@fuel.com', password: 'admin123' },
    { role: 'Pengawas Transportir', email: 'pengawas@fuel.com', password: 'pengawas123' },
    { role: 'Driver', email: 'driver@fuel.com', password: 'driver123' },
    { role: 'Pengawas Depo', email: 'depo@fuel.com', password: 'depo123' },
    { role: 'GL PAMA', email: 'pama@fuel.com', password: 'pama123' },
    { role: 'Fuelman', email: 'fuelman@fuel.com', password: 'fuelman123' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">🚦 Fuel Flow Tracker</h1>
          <p className="text-blue-100">Sistem Tracking Transport BBM</p>
        </div>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Masuk...' : 'Masuk'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-lg">Demo Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm">
              {demoCredentials.map((cred, index) => (
                <div 
                  key={index}
                  className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setEmail(cred.email);
                    setPassword(cred.password);
                  }}
                >
                  <div className="font-medium">{cred.role}</div>
                  <div className="text-gray-600">{cred.email}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
