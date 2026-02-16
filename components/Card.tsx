import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Radius, Shadows, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ children, style, variant = 'default' }: CardProps) {
    const { theme } = useAppTheme();

    const variantStyles: Record<string, ViewStyle> = {
        default: {
            backgroundColor: theme.card,
            ...Shadows.sm,
        },
        elevated: {
            backgroundColor: theme.card,
            ...Shadows.md,
        },
        outlined: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.border,
        },
    };

    return (
        <View style={[styles.card, variantStyles[variant], style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
    },
});
