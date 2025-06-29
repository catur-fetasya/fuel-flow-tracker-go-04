
import React from 'react';
import { Button } from '@/components/ui/button';

interface DemoUserActionsProps {
  onCreateDemoUsers: () => void;
  isLoading: boolean;
}

export const DemoUserActions: React.FC<DemoUserActionsProps> = ({ onCreateDemoUsers, isLoading }) => {
  return (
    <>
      <Button 
        variant="outline" 
        className="w-full bg-yellow-50 hover:bg-yellow-100"
        onClick={onCreateDemoUsers}
        disabled={isLoading}
      >
        {isLoading ? 'Membuat demo users...' : 'Buat Demo Users'}
      </Button>

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
    </>
  );
};
