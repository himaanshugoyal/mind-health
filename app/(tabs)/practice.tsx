import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/Card';
import { Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

// ─── Practice Config ──────────────────────────────────────────────────────────

interface PracticeItem {
    icon: string;
    title: string;
    subtitle: string;
    route: string;
    color: string;      // accent color key
    colorLight: string; // background color key
    isNew?: boolean;
}

const PRACTICES: PracticeItem[] = [
    {
        icon: '🌊',
        title: 'Emotional Release',
        subtitle: 'Let it go safely',
        route: '/practice/meditation?type=emotional-release',
        color: 'emotion',
        colorLight: 'emotionLight',
        isNew: true,
    },
    {
        icon: '🌙',
        title: 'Sleep',
        subtitle: 'Drift off peacefully',
        route: '/practice/meditation?type=sleep',
        color: 'spirit',
        colorLight: 'spiritLight',
        isNew: true,
    },
    {
        icon: '🧘',
        title: 'Calm & Focus',
        subtitle: 'Center your mind',
        route: '/practice/meditation?type=calm-focus',
        color: 'primary',
        colorLight: 'primaryLight',
        isNew: true,
    },
    {
        icon: '🦶',
        title: 'Body Scan',
        subtitle: 'Relax every muscle',
        route: '/practice/meditation?type=body-scan',
        color: 'sky',
        colorLight: 'skyLight',
        isNew: true,
    },
    {
        icon: '✨',
        title: 'Spiritual',
        subtitle: 'Connect within',
        route: '/practice/meditation?type=spiritual',
        color: 'spirit',
        colorLight: 'spiritLight',
        isNew: true,
    },
    {
        icon: '🌬️',
        title: 'Breathwork',
        subtitle: 'Box, 4-7-8, Calm',
        route: '/practice/breathwork',
        color: 'sky',
        colorLight: 'skyLight',
    },
    {
        icon: '🦋',
        title: 'Affirmations',
        subtitle: 'Swipe for positivity',
        route: '/practice/affirmations',
        color: 'accent',
        colorLight: 'accentLight',
    },
    {
        icon: '🕉️',
        title: 'Daily Mantra',
        subtitle: 'Wisdom & Focus',
        route: '/practice/mantra',
        color: 'spirit',
        colorLight: 'spiritLight',
    },
];

const HABITS = [
    { icon: '📝', label: 'Journal', done: true },
    { icon: '🧘', label: 'Meditate', done: true },
    { icon: '🙏', label: 'Gratitude', done: false },
    { icon: '💪', label: 'Exercise', done: false },
    { icon: '📖', label: 'Read', done: false },
    { icon: '💤', label: 'Sleep', done: false },
];

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function PracticeScreen() {
    const { theme } = useAppTheme();
    const router = useRouter();

    const [habits, setHabits] = useState(HABITS);

    const toggleHabit = (index: number) => {
        const newHabits = [...habits];
        newHabits[index].done = !newHabits[index].done;
        setHabits(newHabits);
    };

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
                {/* Habits - Compact */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Daily Habits
                </Text>
                <View style={[styles.habitsScroll, { borderColor: theme.border }]}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.md, paddingHorizontal: Spacing.sm }}>
                        {habits.map((habit, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[
                                    styles.habitChip,
                                    {
                                        backgroundColor: habit.done ? theme.primary + '15' : theme.backgroundSecondary,
                                        borderColor: habit.done ? theme.primary : theme.border,
                                    }
                                ]}
                                onPress={() => toggleHabit(i)}
                            >
                                <Text style={styles.habitIcon}>{habit.icon}</Text>
                                <Text style={[
                                    styles.habitLabel,
                                    { color: habit.done ? theme.primary : theme.textSecondary }
                                ]}>
                                    {habit.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Practices - 2 Column Grid */}
                <Text style={[styles.sectionTitle, { color: theme.text, marginTop: Spacing.xl }]}>
                    All Practices
                </Text>

                <View style={styles.grid}>
                    {PRACTICES.map((item, index) => {
                        const accent = (theme as any)[item.color] || theme.primary;
                        const bg = (theme as any)[item.colorLight] || theme.primaryLight;

                        return (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.7}
                                style={[
                                    styles.gridCard,
                                    { backgroundColor: bg, borderColor: accent + '20' }
                                ]}
                                onPress={() => router.push(item.route as any)}
                            >
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardEmoji}>{item.icon}</Text>
                                    {item.isNew && (
                                        <View style={[styles.newBadge, { backgroundColor: accent }]}>
                                            <Text style={styles.newText}>NEW</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>
                                    {item.title}
                                </Text>
                                <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]} numberOfLines={1}>
                                    {item.subtitle}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingHorizontal: Spacing.xl },
    sectionTitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        marginBottom: Spacing.md,
    },
    habitsScroll: {
        borderRadius: Radius.lg,
        paddingVertical: Spacing.sm,
    },
    habitChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: Radius.full,
        borderWidth: 1,
        gap: Spacing.xs,
    },
    habitIcon: { fontSize: 14 },
    habitLabel: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium },

    // Grid
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    gridCard: {
        width: '47.5%', // Slightly less than 50% to account for gap
        padding: Spacing.md,
        borderRadius: Radius.lg,
        borderWidth: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.sm,
    },
    cardEmoji: { fontSize: 24 },
    newBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: Radius.xs,
    },
    newText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: FontWeights.bold,
    },
    cardTitle: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: FontSizes.xs,
    },
});
