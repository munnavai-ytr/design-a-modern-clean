import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: {
    id: string;
    email: string;
    name: string;
    credits: number;
    streak: number;
    plan: string;
    referralCode: string;
    isVerified: boolean;
  } | null;
  setUser: (user: AuthState['user']) => void;
  updateCredits: (amount: number) => void;
  updateStreak: (streak: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateCredits: (amount) =>
        set((state) => ({
          user: state.user ? { ...state.user, credits: state.user.credits + amount } : null,
        })),
      updateStreak: (streak) =>
        set((state) => ({
          user: state.user ? { ...state.user, streak } : null,
        })),
      logout: () => set({ user: null }),
    }),
    { name: 'dailyboost-auth' }
  )
);
