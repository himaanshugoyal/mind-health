import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ActivityIndicator,
} from 'react-native';
import { Radius, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    style,
    textStyle,
    icon,
}: ButtonProps) {
    const { theme } = useAppTheme();

    const sizeStyles: Record<string, { button: ViewStyle; text: TextStyle }> = {
        sm: {
            button: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.sm },
            text: { fontSize: FontSizes.sm },
        },
        md: {
            button: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: Radius.md },
            text: { fontSize: FontSizes.md },
        },
        lg: {
            button: { paddingHorizontal: Spacing['2xl'], paddingVertical: Spacing.lg, borderRadius: Radius.lg },
            text: { fontSize: FontSizes.lg },
        },
    };

    const variantStyles: Record<string, { button: ViewStyle; text: TextStyle }> = {
        primary: {
            button: { backgroundColor: theme.primary },
            text: { color: '#fff' },
        },
        secondary: {
            button: { backgroundColor: theme.primaryLight },
            text: { color: theme.primary },
        },
        ghost: {
            button: { backgroundColor: 'transparent' },
            text: { color: theme.primary },
        },
        danger: {
            button: { backgroundColor: theme.danger },
            text: { color: '#fff' },
        },
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                sizeStyles[size].button,
                variantStyles[variant].button,
                disabled && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variantStyles[variant].text.color} size="small" />
            ) : (
                <>
                    {icon}
                    <Text
                        style={[
                            styles.text,
                            sizeStyles[size].text,
                            variantStyles[variant].text,
                            icon ? { marginLeft: Spacing.sm } : undefined,
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: FontWeights.semibold,
    },
    disabled: {
        opacity: 0.5,
    },
});
