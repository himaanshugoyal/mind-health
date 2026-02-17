import { Habit, HabitCategory, HabitFrequency } from '@/types/habit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const HABITS_STORAGE_KEY = '@mind_health_habits';

export function useHabits() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load habits from storage on mount
    useEffect(() => {
        loadHabits();
    }, []);

    const loadHabits = async () => {
        try {
            const storedHabits = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
            if (storedHabits) {
                setHabits(JSON.parse(storedHabits));
            }
        } catch (error) {
            console.error('Failed to load habits:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveHabits = async (newHabits: Habit[]) => {
        try {
            await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(newHabits));
            setHabits(newHabits);
        } catch (error) {
            console.error('Failed to save habits:', error);
        }
    };

    const addHabit = useCallback(async (
        title: string,
        category: HabitCategory,
        frequency: HabitFrequency = 'daily',
        reminderTime?: string
    ) => {
        const newHabit: Habit = {
            id: Date.now().toString(), // Simple ID generation
            title,
            category,
            frequency,
            completedDates: [],
            streak: 0,
            longestStreak: 0,
            createdAt: new Date().toISOString(),
            reminderTime,
        };

        const updatedHabits = [...habits, newHabit];
        await saveHabits(updatedHabits);
        return newHabit;
    }, [habits]);

    const updateHabit = useCallback(async (habitId: string, updates: Partial<Habit>) => {
        const updatedHabits = habits.map(h =>
            h.id === habitId ? { ...h, ...updates } : h
        );
        await saveHabits(updatedHabits);
    }, [habits]);

    const deleteHabit = useCallback(async (habitId: string) => {
        const updatedHabits = habits.filter(h => h.id !== habitId);
        await saveHabits(updatedHabits);
    }, [habits]);

    const toggleHabitCompletion = useCallback(async (habitId: string, dateStr: string) => {
        // dateStr should be YYYY-MM-DD
        const updatedHabits = habits.map(habit => {
            if (habit.id !== habitId) return habit;

            const isCompleted = habit.completedDates.includes(dateStr);
            let newCompletedDates: string[];

            if (isCompleted) {
                // Remove completion
                newCompletedDates = habit.completedDates.filter(d => d !== dateStr);
            } else {
                // Add completion
                newCompletedDates = [...habit.completedDates, dateStr].sort();
            }

            const newStreak = calculateStreak(newCompletedDates);
            const newLongestStreak = Math.max(habit.longestStreak, newStreak);

            return {
                ...habit,
                completedDates: newCompletedDates,
                streak: newStreak,
                longestStreak: newLongestStreak,
            };
        });

        await saveHabits(updatedHabits);
    }, [habits]);

    const getHabitStats = useCallback(() => {
        const totalHabits = habits.length;
        const completedToday = habits.filter(h => {
            const today = new Date().toISOString().split('T')[0];
            return h.completedDates.includes(today);
        }).length;

        return {
            totalHabits,
            completedToday,
            completionRate: totalHabits > 0 ? completedToday / totalHabits : 0,
        };
    }, [habits]);

    return {
        habits,
        isLoading,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitCompletion,
        getHabitStats,
    };
}

// Helper: Calculate streak based on completed dates
function calculateStreak(sortedDates: string[]): number {
    if (sortedDates.length === 0) return 0;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // If neither today nor yesterday is completed, streak is broken
    if (!sortedDates.includes(todayStr) && !sortedDates.includes(yesterdayStr)) {
        return 0;
    }

    let streak = 0;
    let checkDate = new Date(today);

    // If today is not completed, start checking from yesterday
    if (!sortedDates.includes(todayStr)) {
        checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (sortedDates.includes(dateStr)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
}
