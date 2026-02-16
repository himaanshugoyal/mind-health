import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Spacing, FontSizes, FontWeights, Radius, Shadows } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

interface QuickActionProps {
    icon: string;
    label: string;
    color: string;
    backgroundColor: string;
    onPress: () => void;
}

export function QuickAction({ icon, label, color, backgroundColor, onPress }: QuickActionProps) {
    const { theme } = useAppTheme();

    return (
        <TouchableOpacity
            style={[styles.container]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View
                style={[
                    styles.iconContainer,
                    { backgroundColor },
                    Shadows.sm,
                ]}
            >
                <Text style={styles.icon}>{icon}</Text>
            </View>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: Spacing.sm,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: Radius.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: 26,
    },
    label: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.medium,
    },
});
