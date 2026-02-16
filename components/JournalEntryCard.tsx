import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from '@/components/Card';
import { JournalEntry, EMOTION_TAGS } from '@/src/types/journal';
import { Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

interface JournalEntryCardProps {
    entry: JournalEntry;
    onPress: (entry: JournalEntry) => void;
}

function getPreview(entry: JournalEntry): string {
    switch (entry.type) {
        case 'thought':
            return entry.content;
        case 'gratitude':
            return entry.items.map((i) => i.text).join(' • ');
        case 'spiritual':
            return entry.content;
        case 'vulnerability':
            return entry.content;
    }
}

function getTypeInfo(type: JournalEntry['type']): { icon: string; label: string; colorKey: string } {
    switch (type) {
        case 'thought':
            return { icon: '💭', label: 'Thought', colorKey: 'accent' };
        case 'gratitude':
            return { icon: '🙏', label: 'Gratitude', colorKey: 'primary' };
        case 'spiritual':
            return { icon: '🕉️', label: 'Spiritual', colorKey: 'spirit' };
        case 'vulnerability':
            return { icon: '💝', label: 'Vulnerability', colorKey: 'emotion' };
    }
}

function formatDate(iso: string): string {
    const date = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function JournalEntryCard({ entry, onPress }: JournalEntryCardProps) {
    const { theme } = useAppTheme();
    const typeInfo = getTypeInfo(entry.type);
    const preview = getPreview(entry);

    return (
        <TouchableOpacity onPress={() => onPress(entry)} activeOpacity={0.7}>
            <Card>
                <View style={styles.header}>
                    <View style={styles.typeRow}>
                        <Text style={styles.typeIcon}>{typeInfo.icon}</Text>
                        <Text style={[styles.typeLabel, { color: theme.textSecondary }]}>
                            {typeInfo.label}
                        </Text>
                        {entry.type === 'vulnerability' && (
                            <Text style={{ fontSize: 12 }}>🔒</Text>
                        )}
                    </View>
                    <Text style={[styles.date, { color: theme.textTertiary }]}>
                        {formatDate(entry.createdAt)}
                    </Text>
                </View>
                <Text
                    style={[styles.preview, { color: theme.text }]}
                    numberOfLines={2}
                >
                    {preview}
                </Text>
                {entry.tags.length > 0 && (
                    <View style={styles.tags}>
                        {entry.tags.slice(0, 3).map((tag) => {
                            const tagInfo = EMOTION_TAGS.find((t) => t.tag === tag);
                            return (
                                <View
                                    key={tag}
                                    style={[
                                        styles.tagChip,
                                        { backgroundColor: (tagInfo?.color || theme.primary) + '15' },
                                    ]}
                                >
                                    <Text style={{ fontSize: 11 }}>{tagInfo?.emoji}</Text>
                                    <Text
                                        style={[
                                            styles.tagText,
                                            { color: tagInfo?.color || theme.textSecondary },
                                        ]}
                                    >
                                        {tag}
                                    </Text>
                                </View>
                            );
                        })}
                        {entry.tags.length > 3 && (
                            <Text style={[styles.moreTag, { color: theme.textTertiary }]}>
                                +{entry.tags.length - 3}
                            </Text>
                        )}
                    </View>
                )}
            </Card>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    typeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    typeIcon: {
        fontSize: 16,
    },
    typeLabel: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.medium,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    date: {
        fontSize: FontSizes.xs,
    },
    preview: {
        fontSize: FontSizes.md,
        lineHeight: 22,
        marginBottom: Spacing.sm,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.xs,
        marginTop: Spacing.xs,
    },
    tagChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        paddingVertical: 3,
        paddingHorizontal: Spacing.sm,
        borderRadius: Radius.full,
    },
    tagText: {
        fontSize: 11,
        fontWeight: FontWeights.medium,
        textTransform: 'capitalize',
    },
    moreTag: {
        fontSize: 11,
        fontWeight: FontWeights.medium,
        paddingVertical: 3,
        paddingHorizontal: 4,
    },
});
