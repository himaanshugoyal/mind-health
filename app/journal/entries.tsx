import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Card } from '@/components/Card';
import { JournalEntryCard } from '@/components/JournalEntryCard';
import { JournalEntry, JournalType } from '@/src/types/journal';
import { getAllEntries, getEntriesByType } from '@/src/storage/journal-storage';
import { Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

type FilterType = 'all' | JournalType;

const FILTERS: { key: FilterType; label: string; icon: string }[] = [
    { key: 'all', label: 'All', icon: '📋' },
    { key: 'thought', label: 'Thoughts', icon: '💭' },
    { key: 'gratitude', label: 'Gratitude', icon: '🙏' },
    { key: 'spiritual', label: 'Spiritual', icon: '🕉️' },
    { key: 'vulnerability', label: 'Vulnerability', icon: '💝' },
    { key: 'self-compassion', label: 'Compassion', icon: '💗' },
    { key: 'opening-up', label: 'Opening Up', icon: '🦋' },
    { key: 'patience', label: 'Patience', icon: '🌱' },
    { key: 'letting-go', label: 'Letting Go', icon: '🍃' },
];

export default function EntriesListScreen() {
    const { theme } = useAppTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const params = useLocalSearchParams<{ type?: string }>();

    const [filter, setFilter] = useState<FilterType>(
        (params.type as FilterType) || 'all'
    );
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const loadEntries = useCallback(async () => {
        setLoading(true);
        try {
            const data =
                filter === 'all'
                    ? await getAllEntries()
                    : await getEntriesByType(filter);
            setEntries(data);
        } catch (e) {
            console.error('Failed to load entries:', e);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    // Reload whenever screen gains focus
    useFocusEffect(
        useCallback(() => {
            loadEntries();
        }, [loadEntries])
    );

    const handleEntryPress = (entry: JournalEntry) => {
        // For now, navigate to the respective journal screen
        router.push(`/journal/${entry.type}` as any);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={[styles.backText, { color: theme.primary }]}>← Back</Text>
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>Journal Entries</Text>
                <View style={{ width: 50 }} />
            </View>

            {/* Filter Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
                contentContainerStyle={styles.filterContent}
            >
                {FILTERS.map((f) => (
                    <TouchableOpacity
                        key={f.key}
                        onPress={() => setFilter(f.key)}
                        activeOpacity={0.7}
                        style={[
                            styles.filterChip,
                            {
                                backgroundColor:
                                    filter === f.key ? theme.primary + '15' : theme.backgroundSecondary,
                                borderColor: filter === f.key ? theme.primary : theme.border,
                            },
                        ]}
                    >
                        <Text style={styles.filterIcon}>{f.icon}</Text>
                        <Text
                            style={[
                                styles.filterLabel,
                                {
                                    color: filter === f.key ? theme.primary : theme.textSecondary,
                                    fontWeight: filter === f.key ? FontWeights.semibold : FontWeights.normal,
                                },
                            ]}
                        >
                            {f.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Entries */}
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={theme.primary} />
                    </View>
                ) : entries.length === 0 ? (
                    <View style={styles.center}>
                        <Text style={styles.emptyEmoji}>📝</Text>
                        <Text style={[styles.emptyTitle, { color: theme.text }]}>
                            No entries yet
                        </Text>
                        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                            Start writing to see your entries here.
                        </Text>
                    </View>
                ) : (
                    <>
                        <Text style={[styles.countText, { color: theme.textTertiary }]}>
                            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                        </Text>
                        {entries.map((entry) => (
                            <JournalEntryCard
                                key={entry.id}
                                entry={entry}
                                onPress={handleEntryPress}
                            />
                        ))}
                    </>
                )}
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    },
    backText: { fontSize: FontSizes.md, fontWeight: FontWeights.medium },
    title: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold },
    filterScroll: { maxHeight: 48 },
    filterContent: { paddingHorizontal: Spacing.xl, gap: Spacing.sm },
    filterChip: {
        flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
        paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
        borderRadius: Radius.full, borderWidth: 1,
    },
    filterIcon: { fontSize: 14 },
    filterLabel: { fontSize: FontSizes.sm },
    scroll: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
    center: { alignItems: 'center', paddingTop: 80 },
    emptyEmoji: { fontSize: 48, marginBottom: Spacing.md },
    emptyTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold },
    emptyText: { fontSize: FontSizes.sm, marginTop: Spacing.xs, textAlign: 'center' },
    countText: {
        fontSize: FontSizes.xs, fontWeight: FontWeights.medium,
        textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.md,
    },
});
