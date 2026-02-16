import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';
import { MOOD_THEMES, type MoodThemeId } from '@/constants/themes';
import { Spacing, FontSizes, FontWeights, Radius, Shadows } from '@/constants/theme';

interface ThemeSelectorProps {
    onSelect?: (themeId: MoodThemeId) => void;
}

export function ThemeSelector({ onSelect }: ThemeSelectorProps) {
    const { theme, moodTheme, setMoodTheme } = useAppTheme();

    const handleSelect = (id: MoodThemeId) => {
        setMoodTheme(id);
        onSelect?.(id);
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.heading, { color: theme.text }]}>Choose Your Mood</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Select a theme that resonates with your inner state
            </Text>

            <View style={styles.grid}>
                {MOOD_THEMES.map((t) => {
                    const isActive = moodTheme === t.id;
                    return (
                        <TouchableOpacity
                            key={t.id}
                            onPress={() => handleSelect(t.id)}
                            activeOpacity={0.7}
                            style={[
                                styles.card,
                                {
                                    backgroundColor: theme.card,
                                    borderColor: isActive ? theme.primary : theme.border,
                                    borderWidth: isActive ? 2 : 1,
                                    ...Shadows.md,
                                },
                            ]}
                        >
                            {/* Selected indicator */}
                            {isActive && (
                                <View style={[styles.activeBadge, { backgroundColor: theme.primary }]}>
                                    <Text style={styles.activeBadgeText}>✓</Text>
                                </View>
                            )}

                            {/* Emoji */}
                            <Text style={styles.emoji}>{t.emoji}</Text>

                            {/* Name */}
                            <Text style={[styles.name, { color: isActive ? theme.primary : theme.text }]}>
                                {t.name}
                            </Text>

                            {/* Description */}
                            <Text style={[styles.description, { color: theme.textTertiary }]} numberOfLines={2}>
                                {t.description}
                            </Text>

                            {/* Color Swatches */}
                            <View style={styles.swatches}>
                                {t.swatches.map((color, i) => (
                                    <View
                                        key={i}
                                        style={[
                                            styles.swatch,
                                            {
                                                backgroundColor: color,
                                                borderColor: color === '#ffffff' || color === '#f8f8f8' ? theme.border : 'transparent',
                                                borderWidth: color === '#ffffff' || color === '#f8f8f8' ? 1 : 0,
                                            },
                                        ]}
                                    />
                                ))}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.lg,
    },
    heading: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        fontSize: FontSizes.sm,
        marginBottom: Spacing.xl,
        lineHeight: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    card: {
        width: '47%',
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        position: 'relative',
        minHeight: 160,
    },
    activeBadge: {
        position: 'absolute',
        top: Spacing.sm,
        right: Spacing.sm,
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: FontWeights.bold,
    },
    emoji: {
        fontSize: 28,
        marginBottom: Spacing.sm,
    },
    name: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
        marginBottom: Spacing.xs,
    },
    description: {
        fontSize: FontSizes.xs,
        lineHeight: 16,
        marginBottom: Spacing.md,
    },
    swatches: {
        flexDirection: 'row',
        gap: 6,
        marginTop: 'auto',
    },
    swatch: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
});
