
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'pengawas_transportir' | 'driver' | 'pengawas_depo' | 'gl_pama' | 'fuelman';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  { id: '1', name: 'Admin User', email: 'admin@fuel.com', role: 'admin', password: 'admin123' },
  { id: '2', name: 'Pengawas Transportir', email: 'pengawas@fuel.com', role: 'pengawas_transportir', password: 'pengawas123' },
  { id: '3', name: 'Driver 1', email: 'driver@fuel.com', role: 'driver', password: 'driver123' },
  { id: '4', name: 'Pengawas Depo', email: 'depo@fuel.com', role: 'pengawas_depo', password: 'depo123' },
  { id: '5', name: 'GL PAMA', email: 'pama@fuel.com', role: 'gl_pama', password: 'pama123' },
  { id: '6', name: 'Fuelman', email: 'fuelman@fuel.com', role: 'fuelman', password: 'fuelman123' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('fuel_tracker_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role
      };
      setUser(userData);
      localStorage.setItem('fuel_tracker_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fuel_tracker_user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
