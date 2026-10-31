import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  customThemeEnabled: boolean;
  customThemeId: string | null;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleCustomTheme: () => void;
  setCustomTheme: (themeId: string | null) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      customThemeEnabled: false,
      customThemeId: null,
      setTheme: (theme) => set({ theme }),
      toggleCustomTheme: () => set((state) => ({ customThemeEnabled: !state.customThemeEnabled })),
      setCustomTheme: (themeId) => set({ customThemeId: themeId, customThemeEnabled: !!themeId }),
    }),
    { name: 'dailyboost-theme' }
  )
);
