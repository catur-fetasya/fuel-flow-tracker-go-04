
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProfiles = async () => {
    if (!user || user.role !== 'admin') {
      setLoading(false);
      return;
    }

    try {
      const data = await apiClient.getAllProfiles();
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: {
    email: string;
    password: string;
    name: string;
    role: string;
  }) => {
    if (!user || user.role !== 'admin') return null;

    try {
      const response = await apiClient.createProfile(userData);
      if (response.success) {
        await fetchProfiles(); // Refresh the list
        return response.user;
      }
      return null;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  };

  const updateUser = async (userId: string, userData: {
    name: string;
    email: string;
    role: string;
    password?: string;
  }) => {
    if (!user || user.role !== 'admin') return null;

    try {
      const response = await apiClient.updateProfile(userId, userData);
      if (response.success) {
        await fetchProfiles(); // Refresh the list
        return response.user;
      }
      return null;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  };

  const deleteUser = async (userId: string) => {
    if (!user || user.role !== 'admin') return null;

    try {
      const response = await apiClient.deleteProfile(userId);
      if (response.success) {
        await fetchProfiles(); // Refresh the list
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [user]);

  return {
    profiles,
    loading,
    fetchProfiles,
    createUser,
    updateUser,
    deleteUser
  };
};
