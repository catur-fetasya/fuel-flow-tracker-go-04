
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useAuthActions } from '../hooks/useAuthActions';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { DemoUserActions } from '../components/auth/DemoUserActions';

const Login = () => {
  const [showRegister, setShowRegister] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isLoading, handleLogin, handleRegister, createDemoUsers } = useAuthActions();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

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
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
          ) : (
            <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
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
            
            <DemoUserActions onCreateDemoUsers={createDemoUsers} isLoading={isLoading} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
