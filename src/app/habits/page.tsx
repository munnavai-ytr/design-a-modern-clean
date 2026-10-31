'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { db } from '@/lib/db';
import { HabitType, CreateHabitInput } from '@/types/habit';
import { Frequency } from '@prisma/client';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { cn } from '@/lib/utils';
import { HabitCard } from '@/components/habit/HabitCard';
import { HabitForm } from '@/components/ui/HabitForm';
import { X, Plus, Check, Trash2, Edit3 } from 'lucide-react';

const MAX_HABITS = 15;

export default function HabitsPage() {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const [habits, setHabits] = useState<HabitType[]>([]);
  const [addHabitModal, setAddHabitModal] = useState(false);
  const [editHabitId, setEditHabitId] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Get user's habits
  useEffect(() => {
    if (user?.id) {
      // Fetch habits from database
      const fetchHabits = async () => {
        try {
          const result = await db.habit.findMany({
            where: { userId: user.id, isActive: true },
          });
          setHabits(result);
        } catch (error) {
          console.error('Failed to fetch habits:', error);
          addNotification({
            type: 'error',
            message: 'Failed to load habits',
          });
        }
      };
      fetchHabits();
    }
  }, [user?.id, addNotification]);

  // Complete habit
  const { mutate: completeHabit } = useMutation({
    mutationFn: async ({ habitId, date }: { habitId: string; date: string }) => {
      // Update habit completed dates
      await db.habit.update({
        where: { id: habitId },
        data: {
          completedDates: {
            push: date,
          },
        },
      });

      // Update streak
      const habit = habits.find((h) => h.id === habitId);
      if (habit) {
        const newStreak = calculateStreak([...habit.completedDates, date].sort().reverse());
        await db.user.update({
          where: { id: user.id },
          data: { streak: newStreak },
        });
      }

      // Add credits for habit completion
      await db.creditTransaction.create({
        data: {
          userId: user.id,
          amount: 2, // 2 credits per habit
          type: 'habit_completion',
          description: 'Habit completion reward',
        },
      });

      addNotification({
        type: 'success',
        message: 'Habit completed! +2 credits',
      });
    },
  });

  // Add habit mutation
  const { mutate: addHabitMutation } = useMutation({
    mutationFn: async (data: CreateHabitInput & { userId: string }) => {
      await db.habit.create({
        data: {
          ...data,
          userId: data.userId,
        },
      });
    },
  });

  // Delete habit mutation
  const { mutate: deleteHabitMutation } = useMutation({
    mutationFn: async (habitId: string) => {
      await db.habit.delete({
        where: { id: habitId },
      });
      addNotification({
        type: 'success',
        message: 'Habit deleted successfully',
      });
    },
  });

  // Update habit mutation
  const { mutate: updateHabitMutation } = useMutation({
    mutationFn: async ({ habitId, updates }: { habitId: string; updates: Partial<HabitType> }) => {
      await db.habit.update({
        where: { id: habitId },
        data: updates,
      });
    },
  });

  const onSubmit = async (data: any) => {
    if (editHabitId) {
      await updateHabitMutation({ habitId: editHabitId, updates: { name: data.name, description: data.description, frequency: data.frequency, icon: data.icon, color: data.color } });
      setEditHabitId(null);
    } else {
      await addHabitMutation({ ...data, userId: user!.id });
    }
    reset();
    setAddHabitModal(false);
    setTimeout(() => window.location.reload(), 500);
  };

  const onComplete = async (habitId: string, date: string) => {
    setIsCompleting(true);
    await completeHabit({ habitId, date });
    setTimeout(() => setIsCompleting(false), 300);
    setTimeout(() => window.location.reload(), 1000);
  };

  const onDelete = async (habitId: string) => {
    await deleteHabitMutation(habitId);
    setHabits(habits.filter((h) => h.id !== habitId));
  };

  const onUpdate = async (habitId: string, updates: Partial<HabitType>) => {
    await updateHabitMutation({ habitId, updates });
    setEditHabitId(null);
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold">Habits</h1>
            <p className="text-muted-foreground">Track your daily routines</p>
          </div>

          <button
            onClick={() => setAddHabitModal(true)}
            className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-medium shadow-soft hover:shadow-glow transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add New Habit
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              isToday={new Date().toISOString().split('T')[0] === habit.completedDates[habit.completedDates.length - 1]}
              isCompleted={habit.completedDates.length > 0}
              onComplete={onComplete}
              onDelete={() => onDelete(habit.id)}
              onUpdate={onUpdate}
            />
          ))}

          {addHabitModal && (
            <HabitForm
              onSubmit={onSubmit}
              onCancel={() => setAddHabitModal(false)}
              isLoading={isCompleting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
