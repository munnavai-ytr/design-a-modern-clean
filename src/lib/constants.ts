export const CREDIT_RULES = {
  DAILY_LOGIN: 5,
  HABIT_COMPLETION: 2,
  AD_REWARD: 5,
  MAX_ADS_PER_DAY: 4,
  MAX_CREDITS_FROM_ADS: 20,
};

export const USAGE_COSTS = {
  STREAK_SAVE: 10,
  ADS_FREE_DAY: 20,
  THEME_UNLOCK: 30,
  EXTRA_HABIT_SLOT: 50,
  EXPORT_REPORTS: 100,
};

export const PLAN_PRICES = {
  FREE: 'free',
  PRO: 199,
  PREMIUM: 499,
};

export const PLAN_FEATURES = {
  [PLAN_PRICES.FREE]: {
    ads: true,
    maxHabits: 5,
    analytics: false,
    bonusCredits: 0,
  },
  [PLAN_PRICES.PRO]: {
    ads: false,
    maxHabits: 15,
    analytics: true,
    bonusCredits: 100,
  },
  [PLAN_FEATURES.PREMIUM]: {
    ads: false,
    maxHabits: -1,
    analytics: true,
    bonusCredits: 200,
  },
};
