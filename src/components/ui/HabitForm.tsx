'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus } from 'lucide-react';
import { Frequency } from '@prisma/client';
import { cn } from '@/lib/utils';

const habitSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  icon: z.string().optional(),
  color: z.string().optional(),
});

type HabitFormData = z.infer<typeof habitSchema>;

interface HabitFormProps {
  onSubmit: (data: HabitFormData) => void;
  onCancel: () => void;
  initialData?: Partial<HabitFormData>;
  isLoading?: boolean;
}

const frequencyOptions = [
  { value: 'daily', label: 'Daily', icon: '📅' },
  { value: 'weekly', label: 'Weekly', icon: '📊' },
  { value: 'monthly', label: 'Monthly', icon: '🗓️' },
];

const presetColors = [
  '#6366F1', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
];

export function HabitForm({ onSubmit, onCancel, initialData, isLoading }: HabitFormProps) {
  const [icon, setIcon] = useState(initialData?.icon || '✨');
  const [color, setColor] = useState(initialData?.color || '#6366F1');
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      frequency: initialData?.frequency || 'daily',
      icon: icon,
      color: color,
    },
  });

  const handleFormSubmit = (data: HabitFormData) => {
    onSubmit({
      ...data,
      icon,
      color,
    });
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-soft max-w-md w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold">
          {initialData ? 'Edit Habit' : 'Add New Habit'}
        </h2>
        <button onClick={onCancel} className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Habit Name</label>
          <div className="relative">
            <input
              {...register('name')}
              className="w-full pl-3 py-2 rounded-2xl border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="e.g., Drink Water"
            />
          </div>
          {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description (Optional)</label>
          <textarea
            {...register('description')}
            rows={2}
            className="w-full pl-3 py-2 rounded-2xl border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
            placeholder="Optional description"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Frequency</label>
          <div className="space-y-2">
            {frequencyOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 px-3 py-1.5 rounded border border-transparent border-secondary/30 bg-secondary/50 cursor-pointer select-none">
                <input
                  type="radio"
                  name="frequency"
                  {...register('frequency')}
                  value={opt.value}
                  className="w-4 h-4 rounded border-primary cursor-pointer accent-primary"
                  checked={watch('frequency') === opt.value}
                  onChange={() => setValue('frequency', opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {presetColors.map((c) => (
            <button
              key={c}
              type="button"
              className={`w-8 h-8 rounded-full cursor-pointer ${color === c ? 'border-2 border-primary' : 'border-none'} ${color === c ? 'shadow-primary' : ''}`}
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Icon</label>
          <div className="grid grid-cols-3 gap-2">
            <button type="button" className="w-8 h-8 rounded-xl flex items-center justify-center border border-secondary/30 bg-secondary/50 cursor-pointer" style={{ color: '✨' }} onClick={() => setIcon('✨')}>✨</button>
            <button type="button" className="w-8 h-8 rounded-xl flex items-center justify-center border border-secondary/30 bg-secondary/50 cursor-pointer" style={{ color: '💧' }} onClick={() => setIcon('💧')}>💧</button>
            <button type="button" className="w-8 h-8 rounded-xl flex items-center justify-center border border-secondary/30 bg-secondary/50 cursor-pointer" style={{ color: '🏃' }} onClick={() => setIcon('🏃')}>🏃</button>
            <button type="button" className="w-8 h-8 rounded-xl flex items-center justify-center border border-secondary/30 bg-secondary/50 cursor-pointer" style={{ color: '📚' }} onClick={() => setIcon('📚')}>📚</button>
            <button type="button" className="w-8 h-8 rounded-xl flex items-center justify-center border border-secondary/30 bg-secondary/50 cursor-pointer" style={{ color: '🍎' }} onClick={() => setIcon('🍎')}>🍎</button>
            <button type="button" className="w-8 h-8 rounded-xl flex items-center justify-center border border-secondary/30 bg-secondary/50 cursor-pointer" style={{ color: '✨' }} onClick={() => setIcon('✨')}>✨</button>
          </div>
        </div>

        <button type="submit" disabled={isLoading}
          className="w-full py-3 px-4 rounded-2xl bg-primary text-primary-foreground font-medium shadow-soft hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            initialData ? 'Update Habit' : 'Create Habit'
          )}
        </button>
      </form>
    </div>
  );
}
