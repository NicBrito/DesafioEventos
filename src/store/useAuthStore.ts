import { User } from '@/core/types/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage');
        document.cookie = 'auth-token=; path=/; max-age=0; samesite=lax';
      },
    }),
    { name: 'auth-storage' }
  )
);