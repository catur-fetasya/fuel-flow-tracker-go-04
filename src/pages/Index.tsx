
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Redirect based on user role
    switch (user?.role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'pengawas_transportir':
        navigate('/pengawas-transportir');
        break;
      case 'driver':
        navigate('/driver');
        break;
      case 'pengawas_depo':
        navigate('/pengawas-depo');
        break;
      case 'gl_pama':
        navigate('/gl-pama');
        break;
      case 'fuelman':
        navigate('/fuelman');
        break;
      default:
        navigate('/login');
    }
  }, [user, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default Index;
