
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      'admin': 'Administrator',
      'pengawas_transportir': 'Pengawas Transportir',
      'driver': 'Driver Transportir',
      'pengawas_depo': 'Pengawas Depo',
      'gl_pama': 'GL PAMA',
      'fuelman': 'Fuelman'
    };
    return roleMap[role] || role;
  };

  return (
    <Card className="mb-6 bg-blue-600 text-white border-0">
      <div className="p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">🚦 Fuel Flow Tracker</h1>
          <p className="text-blue-100 text-sm">{getRoleDisplay(user?.role || '')}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-blue-100">{user?.name}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="mt-1 text-blue-600 bg-white hover:bg-blue-50"
          >
            Logout
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Header;
