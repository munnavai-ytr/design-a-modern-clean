'use client';

import { useState } from 'react';
import { Check, Trash2, Edit3 } from 'lucide-react';
import { HabitType } from '@/types/habit';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: HabitType;
  onComplete: (habitId: string, date: string) => void;
  onDelete: (habitId: string) => void;
  onUpdate: (habitId: string, updates: Partial<HabitType>) => void;
  isToday: boolean;
  isCompleted: boolean;
}

export function HabitCard({ habit, onComplete, onDelete, onUpdate, isToday, isCompleted }: HabitCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(habit.name);

  const handleComplete = async () => {
    setIsCompleting(true);
    await onComplete(habit.id, new Date().toISOString().split('T')[0]);
    setTimeout(() => setIsCompleting(false), 300);
  };

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== habit.name) {
      onUpdate(habit.id, { name: editName.trim() });
    }
    setIsEditing(false);
  };

  const getFrequencyColor = (frequency: string) => {
    const colors = {
      daily: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      weekly: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      monthly: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    };
    return colors[frequency as keyof typeof colors] || colors.daily;
  };

  return (
    <div className={cn(
      'bg-card border border-border rounded-2xl p-4 transition-all duration-200 hover:shadow-soft',
      isCompleted && 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-soft"
            style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
          >
            {habit.icon}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                className="font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1 w-full"
                autoFocus
              />
            ) : (
              <h3 className={cn(
                'font-semibold text-lg',
                isCompleted && 'line-through text-muted-foreground'
              )}>
                {habit.name}
              </h3>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className={cn('text-xs px-2 py-1 rounded-full', getFrequencyColor(habit.frequency))}>
                {habit.frequency}
              </span>
              <span className="text-xs text-muted-foreground">
                Completed {habit.completedDates.length} times
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            className="p-2 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isToday && (
        <div className="mt-3">
          <button
            onClick={handleComplete}
            disabled={isCompleting || isCompleted}
            className={cn(
              'w-full py-2 px-4 rounded-xl font-medium transition-all duration-200',
              isCompleted
                ? 'bg-green-500 text-white cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:shadow-glow disabled:opacity-50'
            )}
          >
            {isCompleting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Completing...
              </span>
            ) : isCompleted ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                Completed Today
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                Complete Habit
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
