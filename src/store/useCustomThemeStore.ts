import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CustomThemeState {
  themes: any[];
  presets: any[];
  activeThemeId: string | null;
  isLoading: boolean;
  setActiveTheme: (themeId: string | null) => void;
  addTheme: (theme: any) => void;
  updateTheme: (themeId: string, updates: any) => void;
  deleteTheme: (themeId: string) => void;
  toggleThemeVisibility: (themeId: string) => void;
  setLoading: (loading: boolean) => void;
  loadThemes: () => Promise<void>;
  loadPresets: () => Promise<void>;
}

export const useCustomThemeStore = create<CustomThemeState>()(
  persist(
    (set, get) => ({
      themes: [],
      presets: [],
      activeThemeId: null,
      isLoading: false,
      setActiveTheme: (themeId) => set({ activeThemeId: themeId }),
      addTheme: (theme) => set((state) => ({ themes: [theme, ...state.themes] })),
      updateTheme: (themeId, updates) => set((state) => ({
        themes: state.themes.map(t => t.id === themeId ? { ...t, ...updates } : t)
      })),
      deleteTheme: (themeId) => set((state) => ({
        themes: state.themes.filter(t => t.id !== themeId),
        ...(state.activeThemeId === themeId && { activeThemeId: null })
      })),
      toggleThemeVisibility: (themeId) => set((state) => ({
        themes: state.themes.map(t => t.id === themeId ? { ...t, isPublic: !t.isPublic } : t)
      })),
      setLoading: (loading) => set({ isLoading: loading }),
      loadThemes: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/themes');
          const themes = await response.json();
          set({ themes });
        } catch (error) {
          console.error('Failed to load themes:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      loadPresets: async () => {
        try {
          const response = await fetch('/api/themes/presets');
          const presets = await response.json();
          set({ presets });
        } catch (error) {
          console.error('Failed to load presets:', error);
        }
      },
    }),
    { name: 'dailyboost-custom-themes' }
  )
);
