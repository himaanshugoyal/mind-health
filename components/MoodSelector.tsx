import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

const MOODS = [
    { emoji: '😢', label: 'Terrible', value: 1, color: '#ef4444' },
    { emoji: '😔', label: 'Bad', value: 2, color: '#f97316' },
    { emoji: '😐', label: 'Okay', value: 3, color: '#eab308' },
    { emoji: '🙂', label: 'Good', value: 4, color: '#22c55e' },
    { emoji: '😄', label: 'Great', value: 5, color: '#10b981' },
];

interface MoodSelectorProps {
    selectedMood: number | null;
    onSelect: (mood: number) => void;
}

export function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
    const { theme, colorScheme } = useAppTheme();

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
                How are you feeling?
            </Text>
            <View style={styles.moods}>
                {MOODS.map((mood) => (
                    <TouchableOpacity
                        key={mood.value}
                        onPress={() => onSelect(mood.value)}
                        style={[
                            styles.moodButton,
                            {
                                backgroundColor:
                                    selectedMood === mood.value
                                        ? mood.color + '20'
                                        : colorScheme === 'dark'
                                            ? theme.card
                                            : theme.backgroundSecondary,
                                borderColor:
                                    selectedMood === mood.value ? mood.color : theme.border,
                                borderWidth: selectedMood === mood.value ? 2 : 1,
                            },
                        ]}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.emoji}>{mood.emoji}</Text>
                        <Text
                            style={[
                                styles.moodLabel,
                                {
                                    color:
                                        selectedMood === mood.value
                                            ? mood.color
                                            : theme.textSecondary,
                                    fontWeight:
                                        selectedMood === mood.value
                                            ? FontWeights.bold
                                            : FontWeights.normal,
                                },
                            ]}
                        >
                            {mood.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.lg,
    },
    label: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.medium,
        marginBottom: Spacing.md,
    },
    moods: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: Spacing.sm,
    },
    moodButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xs,
        borderRadius: Radius.md,
    },
    emoji: {
        fontSize: 28,
        marginBottom: Spacing.xs,
    },
    moodLabel: {
        fontSize: FontSizes.xs,
    },
});
