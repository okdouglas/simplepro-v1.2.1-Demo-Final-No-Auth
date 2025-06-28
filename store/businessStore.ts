import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BusinessProfile {
  name: string;
  owner: string;
  email?: string;
  phone?: string;
  address?: string;
  logo?: string;
}

interface BusinessState {
  profile: BusinessProfile;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  updateProfile: (updates: Partial<BusinessProfile>) => void;
  resetProfile: () => void;
}

const DEFAULT_PROFILE: BusinessProfile = {
  name: 'Johnson HVAC & Plumbing',
  owner: 'Mike Johnson',
  email: 'info@johnsonhvac.com',
  phone: '(405) 555-7890',
  address: '123 Main St, Norman, OK 73072',
};

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      isLoading: false,
      error: null,
      
      updateProfile: (updates) => {
        set((state) => ({
          profile: {
            ...state.profile,
            ...updates,
          },
        }));
      },
      
      resetProfile: () => {
        set({ profile: DEFAULT_PROFILE });
      },
    }),
    {
      name: 'business-profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);