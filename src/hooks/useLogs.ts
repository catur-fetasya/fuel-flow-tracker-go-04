
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

export interface SegelLog {
  id: string;
  unit_id: string;
  foto_segel_url?: string;
  nomor_segel_1?: string;
  nomor_segel_2?: string;
  lokasi: string;
  created_by: string;
  created_at: string;
}

export interface KeluarPertaminaLog {
  id: string;
  unit_id: string;
  tanggal_keluar: string;
  waktu_keluar: string;
  lokasi: string;
  created_by: string;
  created_at: string;
}

export interface DokumenLog {
  id: string;
  unit_id: string;
  foto_sampel_url?: string;
  foto_do_url?: string;
  foto_surat_jalan_url?: string;
  lokasi: string;
  created_by: string;
  created_at: string;
}

export const useLogs = () => {
  const [loadingLogs, setLoadingLogs] = useState<LoadingLog[]>([]);
  const [fuelmanLogs, setFuelmanLogs] = useState<FuelmanLog[]>([]);
  const [depoLogs, setDepoLogs] = useState<PengawasDepoLog[]>([]);
  const [segelLogs, setSegelLogs] = useState<SegelLog[]>([]);
  const [keluarLogs, setKeluarLogs] = useState<KeluarPertaminaLog[]>([]);
  const [dokumenLogs, setDokumenLogs] = useState<DokumenLog[]>([]);
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

  const createSegelLog = async (logData: Omit<SegelLog, 'id' | 'created_by' | 'created_at'>) => {
    if (!user) return null;

    try {
      const response = await apiClient.createSegelLog(logData);
      return response.success ? { id: response.id } : null;
    } catch (error) {
      console.error('Error creating segel log:', error);
      return null;
    }
  };

  const createKeluarPertaminaLog = async (logData: Omit<KeluarPertaminaLog, 'id' | 'created_by' | 'created_at'>) => {
    if (!user) return null;

    try {
      const response = await apiClient.createKeluarPertaminaLog(logData);
      return response.success ? { id: response.id } : null;
    } catch (error) {
      console.error('Error creating keluar pertamina log:', error);
      return null;
    }
  };

  const createDokumenLog = async (logData: Omit<DokumenLog, 'id' | 'created_by' | 'created_at'>) => {
    if (!user) return null;

    try {
      const response = await apiClient.createDokumenLog(logData);
      return response.success ? { id: response.id } : null;
    } catch (error) {
      console.error('Error creating dokumen log:', error);
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
    segelLogs,
    keluarLogs,
    dokumenLogs,
    loading,
    createLoadingLog,
    createFuelmanLog,
    createDepoLog,
    createSegelLog,
    createKeluarPertaminaLog,
    createDokumenLog,
    fetchFuelmanLogs
  };
};
