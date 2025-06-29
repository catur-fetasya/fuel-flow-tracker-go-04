
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching units:', error);
        return;
      }

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
      const { data, error } = await supabase
        .from('units')
        .insert([{ ...unitData, pengawas_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Error creating unit:', error);
        return null;
      }

      await fetchUnits();
      return data;
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
