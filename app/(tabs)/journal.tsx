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
import { getJournalStats } from '@/src/storage/journal-storage';
import { JournalType } from '@/src/types/journal';

// ─── Journal Type Config ─────────────────────────────────────────────────────

type ThemeColorKey = string;

interface JournalTypeConfig {
    icon: string;
    title: string;
    subtitle: string;
    color: ThemeColorKey;
    colorLight: ThemeColorKey;
    route: string;
    type: JournalType;
    isPrivate?: boolean;
}

const JOURNAL_TYPES: JournalTypeConfig[] = [
    {
        icon: '💭',
        title: 'Thought',
        subtitle: 'Capture & reframe',
        color: 'accent',
        colorLight: 'accentLight',
        route: '/journal/thought',
        type: 'thought',
    },
    {
        icon: '🙏',
        title: 'Gratitude',
        subtitle: '3 daily blessings',
        color: 'primary',
        colorLight: 'primaryLight',
        route: '/journal/gratitude',
        type: 'gratitude',
    },
    {
        icon: '🕉️',
        title: 'Spiritual',
        subtitle: 'Inner experiences',
        color: 'spirit',
        colorLight: 'spiritLight',
        route: '/journal/spiritual',
        type: 'spiritual',
    },
    {
        icon: '💝',
        title: 'Vulnerability',
        subtitle: 'Express freely',
        color: 'emotion',
        colorLight: 'emotionLight',
        route: '/journal/vulnerability',
        type: 'vulnerability',
        isPrivate: true,
    },
    {
        icon: '💗',
        title: 'Self Compassion',
        subtitle: 'Be kind to you',
        color: 'compassion',
        colorLight: 'compassionLight',
        route: '/journal/prompt-journal?type=self-compassion',
        type: 'self-compassion',
    },
    {
        icon: '🦋',
        title: 'Opening Up',
        subtitle: 'Speak your truth',
        color: 'openness',
        colorLight: 'opennessLight',
        route: '/journal/prompt-journal?type=opening-up',
        type: 'opening-up',
    },
    {
        icon: '🌱',
        title: 'Patience',
        subtitle: 'Trust the process',
        color: 'patience',
        colorLight: 'patienceLight',
        route: '/journal/prompt-journal?type=patience',
        type: 'patience',
    },
    {
        icon: '🍃',
        title: 'Letting Go',
        subtitle: 'Release & breathe',
        color: 'release',
        colorLight: 'releaseLight',
        route: '/journal/prompt-journal?type=letting-go',
        type: 'letting-go',
    },
];

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function JournalScreen() {
    const { theme } = useAppTheme();
    const router = useRouter();

    const [stats, setStats] = useState({
        totalEntries: 0,
        currentStreak: 0,
        byType: {
            thought: 0, gratitude: 0, spiritual: 0, vulnerability: 0,
            'self-compassion': 0, 'opening-up': 0, 'patience': 0, 'letting-go': 0,
        },
    });

    useFocusEffect(
        useCallback(() => {
            let cancelled = false;
            (async () => {
                const s = await getJournalStats();
                if (!cancelled) setStats(s);
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
                        What is one thing you'd like to release today, and why?
                    </Text>
                    <TouchableOpacity
                        style={[styles.promptButton, { backgroundColor: theme.primary }]}
                        activeOpacity={0.7}
                        onPress={() => router.push('/journal/thought' as any)}
                    >
                        <Text style={styles.promptButtonText}>Start Writing →</Text>
                    </TouchableOpacity>
                </Card>

                {/* Journal Types — 2-column compact grid */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Your Journals
                </Text>

                <View style={styles.grid}>
                    {JOURNAL_TYPES.map((journal, index) => {
                        const accentColor = (theme as any)[journal.color] || theme.primary;
                        const bgColor = (theme as any)[journal.colorLight] || theme.primaryLight;
                        const count = stats.byType[journal.type] || 0;

                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.gridCard,
                                    {
                                        backgroundColor: bgColor,
                                        borderColor: accentColor + '25',
                                    },
                                ]}
                                activeOpacity={0.7}
                                onPress={() => router.push(journal.route as any)}
                            >
                                <View style={styles.gridCardTop}>
                                    <Text style={styles.gridEmoji}>{journal.icon}</Text>
                                    {journal.isPrivate && (
                                        <Text style={styles.lockIcon}>🔒</Text>
                                    )}
                                </View>
                                <Text
                                    style={[styles.gridTitle, { color: theme.text }]}
                                    numberOfLines={1}
                                >
                                    {journal.title}
                                </Text>
                                <Text
                                    style={[styles.gridSubtitle, { color: theme.textSecondary }]}
                                    numberOfLines={1}
                                >
                                    {journal.subtitle}
                                </Text>
                                {count > 0 && (
                                    <Text style={[styles.gridCount, { color: accentColor }]}>
                                        {count} {count === 1 ? 'entry' : 'entries'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

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

// ─── Styles ──────────────────────────────────────────────────────────────────

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

    // ── 2-column compact grid ──
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    gridCard: {
        width: '48.5%',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
        borderRadius: Radius.lg,
        borderWidth: 1,
    },
    gridCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    gridEmoji: {
        fontSize: 26,
    },
    lockIcon: {
        fontSize: 12,
    },
    gridTitle: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
    },
    gridSubtitle: {
        fontSize: FontSizes.xs,
        marginTop: 2,
    },
    gridCount: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.medium,
        marginTop: Spacing.xs,
    },

    // ── Stats ──
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
