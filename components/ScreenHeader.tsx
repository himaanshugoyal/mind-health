import { FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    rightAction?: React.ReactNode;
    showBack?: boolean;
    onBack?: () => void;
}

export function ScreenHeader({ title, subtitle, rightAction, showBack, onBack }: ScreenHeaderProps) {
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
            {showBack && onBack && (
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
            )}
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
    backButton: {
        marginRight: Spacing.md,
        marginBottom: 4,
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
