export type HabitCategory = 'mind' | 'body' | 'spirit';

export type HabitFrequency = 'daily' | 'weekly'; // Simplified for now

export interface Habit {
    id: string;
    title: string;
    category: HabitCategory;
    frequency: HabitFrequency;
    completedDates: string[]; // ISO date strings (YYYY-MM-DD)
    streak: number;
    longestStreak: number;
    createdAt: string;
    reminderTime?: string; // Optional: ISO string for reminder time
    archived?: boolean;
}

export interface HabitStats {
    totalCompleted: number;
    currentStreak: number;
    completionRate: number; // 0-1
}
