import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/Card';
import { Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getJournalStats, getEntriesByType } from '@/src/storage/journal-storage';
import { JournalType } from '@/src/types/journal';

type ThemeColorKey = 'accent' | 'accentLight' | 'primary' | 'primaryLight' | 'spirit' | 'spiritLight' | 'emotion' | 'emotionLight';

const JOURNAL_TYPES: {
    icon: string;
    title: string;
    description: string;
    color: string;
    route: string;
    type: JournalType;
    isPrivate?: boolean;
}[] = [
        {
            icon: '💭',
            title: 'Thought Journal',
            description: 'Capture and reframe your thoughts',
            color: 'accent',
            route: '/journal/thought',
            type: 'thought',
        },
        {
            icon: '🙏',
            title: 'Gratitude Journal',
            description: '3 things you\'re grateful for today',
            color: 'primary',
            route: '/journal/gratitude',
            type: 'gratitude',
        },
        {
            icon: '🕉️',
            title: 'Spiritual Journal',
            description: 'Record spiritual experiences & insights',
            color: 'spirit',
            route: '/journal/spiritual',
            type: 'spiritual',
        },
        {
            icon: '💝',
            title: 'Vulnerability Journal',
            description: 'Practice expressing your feelings',
            color: 'emotion',
            route: '/journal/vulnerability',
            type: 'vulnerability',
            isPrivate: true,
        },
    ];

function formatRelativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function JournalScreen() {
    const { theme } = useAppTheme();
    const router = useRouter();

    const [stats, setStats] = useState({ totalEntries: 0, currentStreak: 0, byType: { thought: 0, gratitude: 0, spiritual: 0, vulnerability: 0 } });
    const [lastEntries, setLastEntries] = useState<Record<JournalType, string | null>>({
        thought: null, gratitude: null, spiritual: null, vulnerability: null,
    });

    useFocusEffect(
        useCallback(() => {
            let cancelled = false;
            (async () => {
                const s = await getJournalStats();
                if (cancelled) return;
                setStats(s);

                const types: JournalType[] = ['thought', 'gratitude', 'spiritual', 'vulnerability'];
                const lastMap: Record<string, string | null> = {};
                for (const t of types) {
                    const entries = await getEntriesByType(t);
                    lastMap[t] = entries.length > 0 ? entries[0].createdAt : null;
                }
                if (!cancelled) setLastEntries(lastMap as Record<JournalType, string | null>);
            })();
            return () => { cancelled = true; };
        }, [])
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScreenHeader
                title="Journal Hub"
                subtitle="Your safe space for reflection"
                rightAction={
                    <TouchableOpacity onPress={() => router.push('/journal/entries' as any)}>
                        <Text style={[styles.viewAll, { color: theme.primary }]}>View All</Text>
                    </TouchableOpacity>
                }
            />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Prompt Card */}
                <Card variant="elevated" style={{ backgroundColor: theme.primaryLight }}>
                    <Text style={[styles.promptLabel, { color: theme.primary }]}>
                        ✨ Today's Prompt
                    </Text>
                    <Text style={[styles.promptText, { color: theme.text }]}>
                        What is one thing you'd like to release today, and why are you holding onto it?
                    </Text>
                    <TouchableOpacity
                        style={[styles.promptButton, { backgroundColor: theme.primary }]}
                        activeOpacity={0.7}
                        onPress={() => router.push('/journal/thought' as any)}
                    >
                        <Text style={styles.promptButtonText}>Start Writing →</Text>
                    </TouchableOpacity>
                </Card>

                {/* Journal Types */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Your Journals
                </Text>

                {JOURNAL_TYPES.map((journal, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.7}
                        onPress={() => router.push(journal.route as any)}
                    >
                        <Card variant="default">
                            <View style={styles.journalRow}>
                                <View
                                    style={[
                                        styles.journalIcon,
                                        {
                                            backgroundColor: theme[(journal.color + 'Light') as ThemeColorKey],
                                        },
                                    ]}
                                >
                                    <Text style={styles.journalEmoji}>{journal.icon}</Text>
                                </View>
                                <View style={styles.journalInfo}>
                                    <View style={styles.journalHeader}>
                                        <Text style={[styles.journalTitle, { color: theme.text }]}>
                                            {journal.title}
                                        </Text>
                                        {journal.isPrivate && (
                                            <Text style={styles.privateBadge}>🔒</Text>
                                        )}
                                    </View>
                                    <Text
                                        style={[
                                            styles.journalDescription,
                                            { color: theme.textSecondary },
                                        ]}
                                    >
                                        {journal.description}
                                    </Text>
                                    <View style={styles.journalMeta}>
                                        <Text
                                            style={[styles.metaText, { color: theme.textTertiary }]}
                                        >
                                            {stats.byType[journal.type]} entries
                                        </Text>
                                        <Text
                                            style={[styles.metaDot, { color: theme.textTertiary }]}
                                        >
                                            •
                                        </Text>
                                        <Text
                                            style={[styles.metaText, { color: theme.textTertiary }]}
                                        >
                                            {lastEntries[journal.type]
                                                ? formatRelativeTime(lastEntries[journal.type]!)
                                                : 'No entries yet'}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={[styles.chevron, { color: theme.textTertiary }]}>
                                    ›
                                </Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                ))}

                {/* Stats */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Writing Stats
                </Text>
                <View style={styles.statsRow}>
                    <Card variant="default" style={styles.statCard}>
                        <Text style={styles.statIcon}>📊</Text>
                        <Text style={[styles.statNumber, { color: theme.primary }]}>
                            {stats.totalEntries}
                        </Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                            Total Entries
                        </Text>
                    </Card>
                    <Card variant="default" style={styles.statCard}>
                        <Text style={styles.statIcon}>🔥</Text>
                        <Text style={[styles.statNumber, { color: theme.accent }]}>
                            {stats.currentStreak}
                        </Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                            Day Streak
                        </Text>
                    </Card>
                    <Card variant="default" style={styles.statCard}>
                        <Text style={styles.statIcon}>📝</Text>
                        <Text style={[styles.statNumber, { color: theme.spirit }]}>
                            {stats.byType.thought}
                        </Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                            Thoughts
                        </Text>
                    </Card>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.xl,
    },
    viewAll: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.semibold,
    },
    promptLabel: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.semibold,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: Spacing.sm,
    },
    promptText: {
        fontSize: FontSizes.md,
        lineHeight: 24,
        marginBottom: Spacing.lg,
    },
    promptButton: {
        paddingVertical: Spacing.md,
        borderRadius: Radius.md,
        alignItems: 'center',
    },
    promptButtonText: {
        color: '#fff',
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
    },
    sectionTitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        marginTop: Spacing.xl,
        marginBottom: Spacing.md,
    },
    journalRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    journalIcon: {
        width: 48,
        height: 48,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    journalEmoji: {
        fontSize: 22,
    },
    journalInfo: {
        flex: 1,
    },
    journalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    journalTitle: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
    },
    privateBadge: {
        fontSize: 12,
    },
    journalDescription: {
        fontSize: FontSizes.sm,
        marginTop: 2,
    },
    journalMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.xs,
        gap: Spacing.xs,
    },
    metaText: {
        fontSize: FontSizes.xs,
    },
    metaDot: {
        fontSize: FontSizes.xs,
    },
    chevron: {
        fontSize: 24,
        fontWeight: FontWeights.medium,
        marginLeft: Spacing.sm,
    },
    statsRow: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Spacing.lg,
    },
    statIcon: {
        fontSize: 22,
        marginBottom: Spacing.sm,
    },
    statNumber: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
    },
    statLabel: {
        fontSize: FontSizes.xs,
        marginTop: Spacing.xs,
    },
});
