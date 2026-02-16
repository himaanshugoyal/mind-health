import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/Card';
import { Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

const PRACTICES = [
    {
        icon: '🧘',
        title: 'Meditation',
        subtitle: 'Guided & timer sessions',
        description: 'Calm your mind with guided meditations or a simple timer',
        sessions: ['Calm & Focus', 'Emotional Release', 'Body Scan', 'Sleep'],
        color: 'primary',
    },
    {
        icon: '🌬️',
        title: 'Breathwork',
        subtitle: '4 techniques available',
        description: 'Breathing exercises for calm, energy, and emotional release',
        sessions: ['Box Breathing', '4-7-8 Technique', 'Alternate Nostril', 'Deep Calm'],
        color: 'sky',
    },
    {
        icon: '✨',
        title: 'Affirmations',
        subtitle: '6 categories',
        description: 'Personalized affirmations to rewire your thought patterns',
        sessions: ['Self-Love', 'Patience', 'Letting Go', 'Confidence'],
        color: 'accent',
    },
    {
        icon: '🕉️',
        title: 'Daily Mantra',
        subtitle: 'Spiritual wisdom',
        description: 'A verse chosen for your current emotional state',
        sessions: ['Bhagavad Gita', 'Vedic Wisdom', 'Universal Truths'],
        color: 'spirit',
    },
];

const HABITS = [
    { icon: '📝', label: 'Journal', done: true },
    { icon: '🧘', label: 'Meditate', done: true },
    { icon: '🙏', label: 'Gratitude', done: false },
    { icon: '💪', label: 'Exercise', done: false },
    { icon: '📖', label: 'Read', done: false },
    { icon: '💤', label: 'Sleep Early', done: false },
];

type ThemeColorKey = 'accent' | 'accentLight' | 'primary' | 'primaryLight' | 'spirit' | 'spiritLight' | 'sky' | 'skyLight';

export default function PracticeScreen() {
    const { theme } = useAppTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScreenHeader
                title="Practice"
                subtitle="Nurture your mind, body & spirit"
            />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Daily Habits */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Today's Habits
                </Text>
                <Card>
                    <View style={styles.habitsGrid}>
                        {HABITS.map((habit, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[
                                    styles.habitItem,
                                    {
                                        backgroundColor: habit.done
                                            ? theme.primaryLight
                                            : theme.backgroundSecondary,
                                        borderColor: habit.done ? theme.primary + '40' : theme.border,
                                    },
                                ]}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.habitIcon}>{habit.icon}</Text>
                                <Text
                                    style={[
                                        styles.habitLabel,
                                        {
                                            color: habit.done ? theme.primary : theme.textSecondary,
                                            fontWeight: habit.done ? FontWeights.semibold : FontWeights.normal,
                                        },
                                    ]}
                                >
                                    {habit.label}
                                </Text>
                                {habit.done && (
                                    <Text style={[styles.habitCheck, { color: theme.primary }]}>✓</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.habitProgress}>
                        <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        backgroundColor: theme.primary,
                                        width: `${(HABITS.filter((h) => h.done).length / HABITS.length) * 100}%`,
                                    },
                                ]}
                            />
                        </View>
                        <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                            {HABITS.filter((h) => h.done).length}/{HABITS.length} completed
                        </Text>
                    </View>
                </Card>

                {/* Practice Cards */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Practices
                </Text>

                {PRACTICES.map((practice, index) => (
                    <TouchableOpacity key={index} activeOpacity={0.7}>
                        <Card variant="elevated">
                            <View style={styles.practiceHeader}>
                                <View
                                    style={[
                                        styles.practiceIcon,
                                        {
                                            backgroundColor: theme[(practice.color + 'Light') as ThemeColorKey],
                                        },
                                    ]}
                                >
                                    <Text style={styles.practiceEmoji}>{practice.icon}</Text>
                                </View>
                                <View style={styles.practiceInfo}>
                                    <Text style={[styles.practiceTitle, { color: theme.text }]}>
                                        {practice.title}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.practiceSubtitle,
                                            { color: theme.textSecondary },
                                        ]}
                                    >
                                        {practice.subtitle}
                                    </Text>
                                </View>
                                <Text style={[styles.chevron, { color: theme.textTertiary }]}>
                                    ›
                                </Text>
                            </View>
                            <Text
                                style={[
                                    styles.practiceDescription,
                                    { color: theme.textSecondary },
                                ]}
                            >
                                {practice.description}
                            </Text>
                            <View style={styles.sessionTags}>
                                {practice.sessions.map((session, i) => (
                                    <View
                                        key={i}
                                        style={[
                                            styles.sessionTag,
                                            { backgroundColor: theme[(practice.color + 'Light') as ThemeColorKey] },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.sessionTagText,
                                                { color: theme[practice.color as ThemeColorKey] },
                                            ]}
                                        >
                                            {session}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </Card>
                    </TouchableOpacity>
                ))}

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
        marginBottom: Spacing.md,
    },
    habitsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    habitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: Radius.full,
        borderWidth: 1,
        gap: Spacing.xs,
    },
    habitIcon: {
        fontSize: 16,
    },
    habitLabel: {
        fontSize: FontSizes.sm,
    },
    habitCheck: {
        fontSize: 12,
        fontWeight: FontWeights.bold,
    },
    habitProgress: {
        marginTop: Spacing.lg,
        gap: Spacing.sm,
    },
    progressBar: {
        height: 6,
        borderRadius: Radius.full,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: Radius.full,
    },
    progressText: {
        fontSize: FontSizes.sm,
    },
    practiceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    practiceIcon: {
        width: 48,
        height: 48,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    practiceEmoji: {
        fontSize: 22,
    },
    practiceInfo: {
        flex: 1,
    },
    practiceTitle: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
    },
    practiceSubtitle: {
        fontSize: FontSizes.sm,
        marginTop: 2,
    },
    chevron: {
        fontSize: 24,
        fontWeight: FontWeights.medium,
    },
    practiceDescription: {
        fontSize: FontSizes.sm,
        lineHeight: 20,
        marginBottom: Spacing.md,
    },
    sessionTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    sessionTag: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
    },
    sessionTagText: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.medium,
    },
});
