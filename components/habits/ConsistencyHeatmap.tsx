import { FontSizes, FontWeights, Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface ConsistencyHeatmapProps {
    completedDates: string[]; // All completed dates across all habits? Or single habit?
    // If undefined, we might aggregate all habits for a "general consistency" map
}

// Helper to get dates for the last N days
function getLastNDays(n: number) {
    const dates = [];
    const today = new Date();
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
}

export function ConsistencyHeatmap({ completedDates }: ConsistencyHeatmapProps) {
    const { theme } = useAppTheme();

    // 14 weeks * 7 days = 98 days
    const days = useMemo(() => getLastNDays(98), []);

    // Group by weeks for column layout
    const weeks = useMemo(() => {
        const weeksArray = [];
        let currentWeek = [];

        days.forEach((date, index) => {
            currentWeek.push(date);
            if (currentWeek.length === 7 || index === days.length - 1) {
                weeksArray.push(currentWeek);
                currentWeek = [];
            }
        });
        return weeksArray;
    }, [days]);

    return (
        <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>Consistency Map</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.grid}>
                    {weeks.map((week, wIndex) => (
                        <View key={wIndex} style={styles.column}>
                            {week.map((date, dIndex) => {
                                const isCompleted = completedDates.includes(date);
                                return (
                                    <View
                                        key={date}
                                        style={[
                                            styles.cell,
                                            {
                                                backgroundColor: isCompleted ? theme.primary : theme.background,
                                                opacity: isCompleted ? 0.8 + (Math.random() * 0.2) : 1, // subtle variation
                                                borderColor: theme.border,
                                                borderWidth: isCompleted ? 0 : 1
                                            }
                                        ]}
                                    />
                                );
                            })}
                        </View>
                    ))}
                </View>
            </ScrollView>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Last 3 months</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Spacing.lg,
        borderRadius: Radius.lg,
        borderWidth: 1,
        marginBottom: Spacing.xl,
    },
    title: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.bold,
        marginBottom: Spacing.md,
    },
    grid: {
        flexDirection: 'row',
        gap: 4,
    },
    column: {
        gap: 4,
    },
    cell: {
        width: 12,
        height: 12,
        borderRadius: 2,
    },
    subtitle: {
        fontSize: FontSizes.xs,
        marginTop: Spacing.md,
        textAlign: 'right',
    }
});
