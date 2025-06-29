
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export interface LoadingLog {
  id: string;
  unit_id: string;
  tanggal_mulai: string;
  waktu_mulai: string;
  tanggal_selesai?: string;
  waktu_selesai?: string;
  lokasi: string;
  created_by: string;
  created_at: string;
}

export interface FuelmanLog {
  id: string;
  unit_id: string;
  waktu_mulai?: string;
  waktu_selesai?: string;
  foto_segel_url?: string;
  lokasi: string;
  flowmeter_a?: string;
  flowmeter_b?: string;
  fm_awal?: number;
  fm_akhir?: number;
  status: 'mulai' | 'selesai';
  created_by: string;
  created_at: string;
}

export interface PengawasDepoLog {
  id: string;
  unit_id: string;
  waktu_tiba: string;
  foto_segel_url?: string;
  foto_sib_url?: string;
  foto_ftw_url?: string;
  foto_p2h_url?: string;
  msf_completed: boolean;
  created_by: string;
  created_at: string;
}

export const useLogs = () => {
  const [loadingLogs, setLoadingLogs] = useState<LoadingLog[]>([]);
  const [fuelmanLogs, setFuelmanLogs] = useState<FuelmanLog[]>([]);
  const [depoLogs, setDepoLogs] = useState<PengawasDepoLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const createLoadingLog = async (logData: Omit<LoadingLog, 'id' | 'created_by' | 'created_at'>) => {
    if (!user) return null;

    try {
      const response = await apiClient.createLoadingLog(logData);
      return response.success ? { id: response.id } : null;
    } catch (error) {
      console.error('Error creating loading log:', error);
      return null;
    }
  };

  const createFuelmanLog = async (logData: Omit<FuelmanLog, 'id' | 'created_by' | 'created_at'>) => {
    if (!user || user.role !== 'fuelman') return null;

    try {
      const response = await apiClient.createFuelmanLog(logData);
      return response.success ? { id: response.id } : null;
    } catch (error) {
      console.error('Error creating fuelman log:', error);
      return null;
    }
  };

  const createDepoLog = async (logData: Omit<PengawasDepoLog, 'id' | 'created_by' | 'created_at'>) => {
    if (!user || user.role !== 'pengawas_depo') return null;

    try {
      const response = await apiClient.createPengawasDepoLog(logData);
      return response.success ? { id: response.id } : null;
    } catch (error) {
      console.error('Error creating depo log:', error);
      return null;
    }
  };

  const fetchFuelmanLogs = async () => {
    if (!user || user.role !== 'fuelman') return;

    try {
      const data = await apiClient.getFuelmanLogs();
      setFuelmanLogs(data || []);
    } catch (error) {
      console.error('Error fetching fuelman logs:', error);
    }
  };

  useEffect(() => {
    if (user?.role === 'fuelman') {
      fetchFuelmanLogs();
    }
    setLoading(false);
  }, [user]);

  return {
    loadingLogs,
    fuelmanLogs,
    depoLogs,
    loading,
    createLoadingLog,
    createFuelmanLog,
    createDepoLog,
    fetchFuelmanLogs
  };
};
