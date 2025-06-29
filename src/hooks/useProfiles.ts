
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProfiles = async () => {
    if (!user || user.role !== 'admin') return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles:', error);
        return;
      }

      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: { name: string; email: string; role: string; password: string }) => {
    if (!user || user.role !== 'admin') return null;

    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        user_metadata: { name: userData.name }
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        return null;
      }

      // Then update the profile with the correct role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({ 
          name: userData.name,
          role: userData.role 
        })
        .eq('id', authData.user.id)
        .select()
        .single();

      if (profileError) {
        console.error('Error updating profile:', profileError);
        return null;
      }

      await fetchProfiles();
      return profileData;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [user]);

  return {
    profiles,
    loading,
    fetchProfiles,
    createUser
  };
};
