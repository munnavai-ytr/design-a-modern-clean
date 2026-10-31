import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SubscriptionStore {
  hasHiddenPlanUnlocked: boolean;
  unlockHiddenPlan: (code?: string) => boolean;
  setHiddenPlanUnlocked: (unlocked: boolean) => void;
}

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set) => ({
      hasHiddenPlanUnlocked: false,
      unlockHiddenPlan: (code?: string) => {
        const validCodes = ['DAILYBOOST2026', 'BONUS201824', 'SPECIAL201926'];
        const isValid = !code || validCodes.includes(code);
        if (isValid) {
          set({ hasHiddenPlanUnlocked: true });
          return true;
        }
        return false;
      },
      setHiddenPlanUnlocked: (unlocked) => set({ hasHiddenPlanUnlocked: unlocked }),
    }),
    { name: 'dailyboost-subscription' }
  )
);
