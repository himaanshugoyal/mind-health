import { Card } from '@/components/Card';
import { ScreenHeader } from '@/components/ScreenHeader';
import { FontSizes, FontWeights, Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useRelationships } from '@/hooks/useRelationships';
import { useSocialChallenges } from '@/hooks/useSocialChallenges';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SocialHubScreen() {
    const { theme } = useAppTheme();
    const router = useRouter();
    const { getStats } = useRelationships();
    const { getCompletionStats } = useSocialChallenges();

    const relationshipStats = getStats();
    const challengeStats = getCompletionStats();

    const sections = [
        {
            title: 'Relationship Tracker',
            subtitle: 'Track meaningful connections',
            icon: '👥',
            route: '/social/relationships',
            stats: [
                { label: 'Relationships', value: relationshipStats.totalRelationships, highlight: false },
                { label: 'Need Attention', value: relationshipStats.needsAttention, highlight: true },
            ],
        },
        {
            title: 'Social Challenges',
            subtitle: 'Build confidence step by step',
            icon: '🌱',
            route: '/social/challenges',
            stats: [
                { label: 'Current Level', value: challengeStats.currentLevel, highlight: false },
                { label: 'Completed', value: `${challengeStats.completionPercentage}%`, highlight: false },
            ],
        },
        {
            title: 'Conversation Starters',
            subtitle: 'Break the ice with ease',
            icon: '💬',
            route: null, // P3 feature
            comingSoon: true,
        },
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScreenHeader
                title="Social & Connection"
                subtitle="Build meaningful relationships"
                showBack
                onBack={() => router.back()}
            />
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <Card variant="elevated" style={{ backgroundColor: theme.primaryLight, marginBottom: Spacing.lg }}>
                    <View style={styles.headerCard}>
                        <Text style={styles.headerEmoji}>🤝</Text>
                        <Text style={[styles.headerTitle, { color: theme.text }]}>
                            Your Social Wellness
                        </Text>
                        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                            Nurture connections and grow your social confidence
                        </Text>
                    </View>
                </Card>

                {sections.map((section, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => section.route && router.push(section.route as any)}
                        activeOpacity={0.7}
                        disabled={!section.route}
                    >
                        <Card variant="default" style={styles.sectionCard}>
                            <View style={styles.sectionHeader}>
                                <View style={[styles.sectionIcon, { backgroundColor: theme.primaryLight }]}>
                                    <Text style={styles.sectionEmoji}>{section.icon}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.sectionTitleRow}>
                                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                                            {section.title}
                                        </Text>
                                        {section.comingSoon && (
                                            <View style={[styles.comingSoonBadge, { backgroundColor: theme.accent + '20' }]}>
                                                <Text style={[styles.comingSoonText, { color: theme.accent }]}>
                                                    Coming Soon
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                                        {section.subtitle}
                                    </Text>
                                </View>
                                {section.route && (
                                    <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
                                )}
                            </View>

                            {section.stats && (
                                <View style={styles.statsRow}>
                                    {section.stats.map((stat, i) => (
                                        <View key={i} style={styles.statItem}>
                                            <Text
                                                style={[
                                                    styles.statValue,
                                                    {
                                                        color: stat.highlight ? theme.warning : theme.primary,
                                                    },
                                                ]}
                                            >
                                                {stat.value}
                                            </Text>
                                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                                                {stat.label}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </Card>
                    </TouchableOpacity>
                ))}

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { paddingHorizontal: Spacing.xl },
    headerCard: {
        alignItems: 'center',
        paddingVertical: Spacing.md,
    },
    headerEmoji: {
        fontSize: 48,
        marginBottom: Spacing.sm,
    },
    headerTitle: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: FontSizes.sm,
        textAlign: 'center',
    },
    sectionCard: {
        marginBottom: Spacing.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        marginBottom: Spacing.md,
    },
    sectionIcon: {
        width: 52,
        height: 52,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionEmoji: {
        fontSize: 28,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
    },
    sectionSubtitle: {
        fontSize: FontSizes.sm,
        marginTop: 2,
    },
    comingSoonBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: Radius.sm,
    },
    comingSoonText: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.medium,
    },
    statsRow: {
        flexDirection: 'row',
        gap: Spacing.lg,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
    },
    statLabel: {
        fontSize: FontSizes.xs,
        marginTop: 2,
    },
});
