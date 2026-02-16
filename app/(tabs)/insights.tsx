import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/Card';
import { Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

const MOOD_DATA = [
    { day: 'Mon', value: 4, emoji: '🙂' },
    { day: 'Tue', value: 3, emoji: '😐' },
    { day: 'Wed', value: 5, emoji: '😄' },
    { day: 'Thu', value: 2, emoji: '😔' },
    { day: 'Fri', value: 4, emoji: '🙂' },
    { day: 'Sat', value: 5, emoji: '😄' },
    { day: 'Sun', value: 4, emoji: '🙂' },
];

const PATTERNS = [
    {
        icon: '📈',
        title: 'Mood improves after meditation',
        detail: 'Your mood is 30% better on days you meditate. Keep up the practice!',
        color: 'primary',
    },
    {
        icon: '🌙',
        title: 'Sunday evenings feel heavy',
        detail: 'Consider a calming ritual before the week begins — journaling or a walk.',
        color: 'spirit',
    },
    {
        icon: '✍️',
        title: 'Journaling reduces anxiety',
        detail: 'On days you journal, your overthinking drops by 40%. Write more!',
        color: 'accent',
    },
];

const WEEKLY_SUMMARY = {
    avgMood: 3.9,
    journalEntries: 5,
    meditationMinutes: 42,
    habitsCompleted: 18,
    totalHabits: 28,
};

type ThemeKey = 'primary' | 'primaryLight' | 'spirit' | 'spiritLight' | 'accent' | 'accentLight';

export default function InsightsScreen() {
    const { theme } = useAppTheme();
    const maxBarHeight = 80;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScreenHeader
                title="Insights"
                subtitle="Patterns from your journey"
            />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Weekly Mood Chart */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Mood This Week
                </Text>
                <Card variant="elevated">
                    <View style={styles.chartContainer}>
                        {MOOD_DATA.map((item, i) => (
                            <View key={i} style={styles.chartColumn}>
                                <Text style={styles.chartEmoji}>{item.emoji}</Text>
                                <View
                                    style={[
                                        styles.chartBar,
                                        {
                                            height: (item.value / 5) * maxBarHeight,
                                            backgroundColor:
                                                item.value >= 4
                                                    ? theme.primary
                                                    : item.value >= 3
                                                        ? theme.accent
                                                        : theme.emotion,
                                            opacity: item.value >= 3 ? 1 : 0.7,
                                        },
                                    ]}
                                />
                                <Text
                                    style={[styles.chartLabel, { color: theme.textSecondary }]}
                                >
                                    {item.day}
                                </Text>
                            </View>
                        ))}
                    </View>
                    <View style={[styles.avgMood, { borderTopColor: theme.border }]}>
                        <Text style={[styles.avgLabel, { color: theme.textSecondary }]}>
                            Average Mood
                        </Text>
                        <Text style={[styles.avgValue, { color: theme.primary }]}>
                            {WEEKLY_SUMMARY.avgMood}/5.0 🙂
                        </Text>
                    </View>
                </Card>

                {/* Weekly Summary */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Weekly Summary
                </Text>
                <View style={styles.summaryGrid}>
                    <Card variant="default" style={styles.summaryCard}>
                        <Text style={styles.summaryIcon}>📝</Text>
                        <Text style={[styles.summaryNumber, { color: theme.primary }]}>
                            {WEEKLY_SUMMARY.journalEntries}
                        </Text>
                        <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                            Journal Entries
                        </Text>
                    </Card>
                    <Card variant="default" style={styles.summaryCard}>
                        <Text style={styles.summaryIcon}>🧘</Text>
                        <Text style={[styles.summaryNumber, { color: theme.spirit }]}>
                            {WEEKLY_SUMMARY.meditationMinutes}m
                        </Text>
                        <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                            Meditation
                        </Text>
                    </Card>
                    <Card variant="default" style={styles.summaryCard}>
                        <Text style={styles.summaryIcon}>✅</Text>
                        <Text style={[styles.summaryNumber, { color: theme.accent }]}>
                            {Math.round(
                                (WEEKLY_SUMMARY.habitsCompleted / WEEKLY_SUMMARY.totalHabits) *
                                100
                            )}
                            %
                        </Text>
                        <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                            Habits Done
                        </Text>
                    </Card>
                </View>

                {/* Patterns */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Discovered Patterns
                </Text>
                {PATTERNS.map((pattern, i) => (
                    <Card key={i} variant="default">
                        <View style={styles.patternRow}>
                            <View
                                style={[
                                    styles.patternIcon,
                                    {
                                        backgroundColor:
                                            theme[(pattern.color + 'Light') as ThemeKey],
                                    },
                                ]}
                            >
                                <Text style={{ fontSize: 20 }}>{pattern.icon}</Text>
                            </View>
                            <View style={styles.patternInfo}>
                                <Text style={[styles.patternTitle, { color: theme.text }]}>
                                    {pattern.title}
                                </Text>
                                <Text
                                    style={[
                                        styles.patternDetail,
                                        { color: theme.textSecondary },
                                    ]}
                                >
                                    {pattern.detail}
                                </Text>
                            </View>
                        </View>
                    </Card>
                ))}

                {/* AI Summary */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    AI Summary
                </Text>
                <Card variant="elevated" style={{ backgroundColor: theme.spiritLight }}>
                    <Text style={{ fontSize: 20, marginBottom: Spacing.sm }}>🤖</Text>
                    <Text style={[styles.aiSummaryText, { color: theme.text }]}>
                        This week you showed real consistency in journaling — 5 entries is
                        your best yet. Your mood dipped on Thursday, likely related to work
                        stress, but you bounced back beautifully. Try adding a short
                        meditation before bed on stressful days. Your Sunday anxiety
                        pattern is worth exploring in your journal.
                    </Text>
                </Card>

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
    sectionTitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        marginTop: Spacing.xl,
        marginBottom: Spacing.md,
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 130,
        paddingTop: Spacing.lg,
    },
    chartColumn: {
        alignItems: 'center',
        gap: Spacing.xs,
    },
    chartEmoji: {
        fontSize: 16,
    },
    chartBar: {
        width: 28,
        borderRadius: Radius.sm,
    },
    chartLabel: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.medium,
    },
    avgMood: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Spacing.lg,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
    },
    avgLabel: {
        fontSize: FontSizes.sm,
    },
    avgValue: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.bold,
    },
    summaryGrid: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    summaryCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Spacing.lg,
    },
    summaryIcon: {
        fontSize: 22,
        marginBottom: Spacing.sm,
    },
    summaryNumber: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
    },
    summaryLabel: {
        fontSize: FontSizes.xs,
        marginTop: Spacing.xs,
        textAlign: 'center',
    },
    patternRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    patternIcon: {
        width: 40,
        height: 40,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    patternInfo: {
        flex: 1,
    },
    patternTitle: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
        marginBottom: Spacing.xs,
    },
    patternDetail: {
        fontSize: FontSizes.sm,
        lineHeight: 20,
    },
    aiSummaryText: {
        fontSize: FontSizes.md,
        lineHeight: 24,
    },
});
