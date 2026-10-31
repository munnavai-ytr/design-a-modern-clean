import { Frequency } from '@prisma/client';

export interface HabitType {
  id: string;
  name: string;
  description?: string;
  frequency: Frequency;
  icon: string;
  color: string;
  userId: string;
  isActive: boolean;
  completedDates: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHabitInput {
  name: string;
  description?: string;
  frequency?: Frequency;
  icon?: string;
  color?: string;
}

export interface UpdateHabitInput {
  name?: string;
  description?: string;
  frequency?: Frequency;
  icon?: string;
  color?: string;
  isActive?: boolean;
}

export interface CompleteHabitInput {
  habitId: string;
  date: string;
}

export interface HabitStats {
  totalHabits: number;
  completedToday: number;
  completionRate: number;
  currentStreak: number;
  weeklyProgress: { day: string; completed: number }[];
  monthlyProgress: { week: number; completed: number; total: number }[];
}
