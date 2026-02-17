import { FontSizes, FontWeights, Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Habit } from '@/types/habit';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HabitItem } from './HabitItem';

interface HabitListProps {
    habits: Habit[];
    onToggleHabit: (id: string, date: string) => void;
    onAddHabit: () => void;
}

export function HabitList({ habits, onToggleHabit, onAddHabit }: HabitListProps) {
    const { theme } = useAppTheme();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Daily Habits</Text>
                <TouchableOpacity onPress={onAddHabit} style={[styles.addButton, { backgroundColor: theme.primaryLight }]}>
                    <Ionicons name="add" size={20} color={theme.primary} />
                </TouchableOpacity>
            </View>

            {habits.length === 0 ? (
                <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                        No habits yet. Start small! 🌱
                    </Text>
                    <TouchableOpacity onPress={onAddHabit}>
                        <Text style={[styles.createLink, { color: theme.primary }]}>Create your first habit</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                habits.map(habit => (
                    <HabitItem
                        key={habit.id}
                        habit={habit}
                        onToggle={onToggleHabit}
                    />
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: Spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
    },
    addButton: {
        padding: Spacing.xs,
        borderRadius: Radius.full,
    },
    emptyState: {
        padding: Spacing.lg,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: FontSizes.md,
        marginBottom: Spacing.sm,
    },
    createLink: {
        fontWeight: FontWeights.semibold,
    },
});
