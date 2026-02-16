import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { EMOTION_TAGS, EmotionTag } from '@/src/types/journal';
import { Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

interface EmotionTagSelectorProps {
    selected: EmotionTag[];
    onToggle: (tag: EmotionTag) => void;
    maxTags?: number;
}

export function EmotionTagSelector({ selected, onToggle, maxTags = 5 }: EmotionTagSelectorProps) {
    const { theme } = useAppTheme();

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
                How does this make you feel? {selected.length > 0 && `(${selected.length}/${maxTags})`}
            </Text>
            <View style={styles.tagsWrap}>
                {EMOTION_TAGS.map(({ tag, emoji, color }) => {
                    const isSelected = selected.includes(tag);
                    const disabled = !isSelected && selected.length >= maxTags;
                    return (
                        <TouchableOpacity
                            key={tag}
                            onPress={() => !disabled && onToggle(tag)}
                            activeOpacity={0.7}
                            style={[
                                styles.tag,
                                {
                                    backgroundColor: isSelected ? color + '20' : theme.backgroundSecondary,
                                    borderColor: isSelected ? color : theme.border,
                                    opacity: disabled ? 0.4 : 1,
                                },
                            ]}
                        >
                            <Text style={styles.tagEmoji}>{emoji}</Text>
                            <Text
                                style={[
                                    styles.tagLabel,
                                    {
                                        color: isSelected ? color : theme.textSecondary,
                                        fontWeight: isSelected ? FontWeights.semibold : FontWeights.normal,
                                    },
                                ]}
                            >
                                {tag}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.lg,
    },
    label: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.medium,
        marginBottom: Spacing.md,
    },
    tagsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: Radius.full,
        borderWidth: 1,
        gap: Spacing.xs,
    },
    tagEmoji: {
        fontSize: 14,
    },
    tagLabel: {
        fontSize: FontSizes.sm,
        textTransform: 'capitalize',
    },
});
