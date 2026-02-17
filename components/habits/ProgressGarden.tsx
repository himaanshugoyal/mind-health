import { FontSizes, FontWeights, Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProgressGardenProps {
    totalStreak: number;
}

export function ProgressGarden({ totalStreak }: ProgressGardenProps) {
    const { theme } = useAppTheme();

    const { icon, label, stage } = useMemo(() => {
        if (totalStreak < 5) return { icon: '🌱', label: 'Seedling', stage: 1 };
        if (totalStreak < 21) return { icon: '🌿', label: 'Sprout', stage: 2 };
        if (totalStreak < 50) return { icon: '🌻', label: 'Blooming', stage: 3 };
        if (totalStreak < 100) return { icon: '🌳', label: 'Thriving', stage: 4 };
        return { icon: '🏞️', label: 'Abundance', stage: 5 };
    }, [totalStreak]);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[theme.primaryLight, theme.background]}
                style={[styles.gardenCard, { borderColor: theme.border }]}
            >
                <Text style={[styles.title, { color: theme.primary }]}>Your Mind Garden</Text>

                <View style={styles.gardenVisual}>
                    <Text style={[styles.plantIcon, { fontSize: 40 + (stage * 10) }]}>{icon}</Text>
                </View>

                <View style={styles.stats}>
                    <Text style={[styles.stageLabel, { color: theme.textSecondary }]}>Stage: {label}</Text>
                    <Text style={[styles.streakCount, { color: theme.text }]}>{totalStreak} streaks grown</Text>
                </View>

                <Text style={[styles.tip, { color: theme.textTertiary }]}>
                    Consistency waters your garden. Keep going! 💧
                </Text>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: Spacing.lg,
    },
    gardenCard: {
        padding: Spacing.xl,
        borderRadius: Radius.lg,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        marginBottom: Spacing.lg,
    },
    gardenVisual: {
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    plantIcon: {
        // dynamic size
    },
    stats: {
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    stageLabel: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.medium,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    streakCount: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        marginTop: Spacing.xs,
    },
    tip: {
        fontSize: FontSizes.xs,
        fontStyle: 'italic',
    }
});
