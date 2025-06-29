
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export interface Unit {
  id: string;
  nomor_unit: string;
  driver_name: string;
  driver_id?: string;
  pengawas_id: string;
  created_at: string;
  updated_at: string;
}

export const useUnits = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUnits = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await apiClient.getUnits();
      setUnits(data || []);
    } catch (error) {
      console.error('Error fetching units:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUnit = async (unitData: Omit<Unit, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const response = await apiClient.createUnit(unitData);
      if (response.success) {
        await fetchUnits();
        return response.unit;
      }
      return null;
    } catch (error) {
      console.error('Error creating unit:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [user]);

  return {
    units,
    loading,
    fetchUnits,
    createUnit
  };
};
