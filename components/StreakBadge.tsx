import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

interface StreakBadgeProps {
    count: number;
    label: string;
    icon: string;
    isActive?: boolean;
}

export function StreakBadge({ count, label, icon, isActive = true }: StreakBadgeProps) {
    const { theme } = useAppTheme();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: isActive ? theme.primaryLight : theme.card,
                    borderColor: isActive ? theme.primary + '40' : theme.border,
                },
            ]}
        >
            <Text style={styles.icon}>{icon}</Text>
            <Text
                style={[
                    styles.count,
                    { color: isActive ? theme.primary : theme.textSecondary },
                ]}
            >
                {count}
            </Text>
            <Text
                style={[
                    styles.label,
                    { color: isActive ? theme.primary : theme.textTertiary },
                ]}
            >
                {label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: Radius.md,
        borderWidth: 1,
        minWidth: 80,
    },
    icon: {
        fontSize: 20,
        marginBottom: Spacing.xs,
    },
    count: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
    },
    label: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.medium,
        marginTop: 2,
    },
});
