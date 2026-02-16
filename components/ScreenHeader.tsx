import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    rightAction?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, rightAction }: ScreenHeaderProps) {
    const { theme } = useAppTheme();
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: insets.top + Spacing.md,
                    backgroundColor: theme.background,
                },
            ]}
        >
            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
                {subtitle && (
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        {subtitle}
                    </Text>
                )}
            </View>
            {rightAction && <View style={styles.action}>{rightAction}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.lg,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: FontSizes['2xl'],
        fontWeight: FontWeights.bold,
    },
    subtitle: {
        fontSize: FontSizes.sm,
        marginTop: 2,
    },
    action: {
        marginLeft: Spacing.md,
    },
});
