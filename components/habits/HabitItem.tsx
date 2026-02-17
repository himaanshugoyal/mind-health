import { FontSizes, FontWeights, Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Habit } from '@/types/habit';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HabitItemProps {
    habit: Habit;
    onToggle: (habitId: string, date: string) => void;
    onDelete?: (habitId: string) => void;
}

export function HabitItem({ habit, onToggle }: HabitItemProps) {
    const { theme } = useAppTheme();

    // Check if completed today
    const today = useMemo(() => new Date().toISOString().split('T')[0], []);
    const isCompletedToday = habit.completedDates.includes(today);

    const handleToggle = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onToggle(habit.id, today);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TouchableOpacity
                style={[
                    styles.checkbox,
                    {
                        borderColor: isCompletedToday ? theme.primary : theme.textTertiary,
                        backgroundColor: isCompletedToday ? theme.primary : 'transparent'
                    }
                ]}
                onPress={handleToggle}
                activeOpacity={0.7}
            >
                {isCompletedToday && <Ionicons name="checkmark" size={16} color="white" />}
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={[
                    styles.title,
                    { color: theme.text, textDecorationLine: isCompletedToday ? 'line-through' : 'none', opacity: isCompletedToday ? 0.7 : 1 }
                ]}>
                    {habit.title}
                </Text>
                <Text style={[styles.streak, { color: theme.textSecondary }]}>
                    {habit.streak > 0 ? `🔥 ${habit.streak} day streak` : 'Start a streak!'}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        marginBottom: Spacing.sm,
        borderRadius: Radius.md,
        borderWidth: 1,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: Radius.full,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.medium,
    },
    streak: {
        fontSize: FontSizes.xs,
        marginTop: 2,
    },
});
