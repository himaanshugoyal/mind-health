import { Card } from '@/components/Card';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ChallengeCard } from '@/components/social/ChallengeCard';
import { ChallengeReflectionModal } from '@/components/social/ChallengeReflectionModal';
import { FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useSocialChallenges } from '@/hooks/useSocialChallenges';
import { CHALLENGE_LEVELS, SocialChallenge } from '@/types/challenge';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const LEVEL_COLORS = {
    1: '#4CAF50',
    2: '#2196F3',
    3: '#FF9800',
    4: '#9C27B0',
};

export default function ChallengesScreen() {
    const { theme } = useAppTheme();
    const router = useRouter();
    const {
        challenges,
        completeChallenge,
        getChallengesByLevel,
        getCurrentLevel,
        isLevelUnlocked,
        getCompletionStats,
    } = useSocialChallenges();

    const [isReflectionModalVisible, setIsReflectionModalVisible] = useState(false);
    const [selectedChallenge, setSelectedChallenge] = useState<SocialChallenge | null>(null);

    const currentLevel = getCurrentLevel();
    const stats = getCompletionStats();

    const handleChallengePress = (challenge: SocialChallenge) => {
        if (challenge.completed) {
            // View reflection
            return;
        }
        setSelectedChallenge(challenge);
        setIsReflectionModalVisible(true);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScreenHeader
                title="Social Challenges"
                subtitle="Build confidence step by step"
                showBack
                onBack={() => router.back()}
            />

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Progress Card */}
                <Card variant="elevated" style={{ backgroundColor: theme.primaryLight, marginBottom: Spacing.lg }}>
                    <View style={styles.progressCard}>
                        <Text style={styles.progressEmoji}>🌱</Text>
                        <Text style={[styles.progressTitle, { color: theme.text }]}>
                            Level {currentLevel} - {CHALLENGE_LEVELS[currentLevel - 1].title}
                        </Text>
                        <Text style={[styles.progressSubtitle, { color: theme.textSecondary }]}>
                            {stats.completedChallenges} of {stats.totalChallenges} challenges completed
                        </Text>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        backgroundColor: theme.primary,
                                        width: `${stats.completionPercentage}%`,
                                    },
                                ]}
                            />
                        </View>
                    </View>
                </Card>

                {/* Level Sections */}
                {CHALLENGE_LEVELS.map((levelInfo) => {
                    const levelChallenges = getChallengesByLevel(levelInfo.level);
                    const locked = !isLevelUnlocked(levelInfo.level);
                    const levelColor = LEVEL_COLORS[levelInfo.level];

                    return (
                        <View key={levelInfo.level} style={styles.levelSection}>
                            <View style={styles.levelHeader}>
                                <View style={[styles.levelBadge, { backgroundColor: levelColor + '20' }]}>
                                    <Text style={[styles.levelNumber, { color: levelColor }]}>
                                        {levelInfo.level}
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.levelTitle, { color: theme.text }]}>
                                        {levelInfo.title}
                                    </Text>
                                    <Text style={[styles.levelDescription, { color: theme.textSecondary }]}>
                                        {levelInfo.description}
                                    </Text>
                                </View>
                                {locked && <Ionicons name="lock-closed" size={20} color={theme.textTertiary} />}
                            </View>

                            {levelChallenges.map((challenge) => (
                                <ChallengeCard
                                    key={challenge.id}
                                    challenge={challenge}
                                    isLocked={locked}
                                    onPress={() => handleChallengePress(challenge)}
                                />
                            ))}
                        </View>
                    );
                })}

                <View style={{ height: 100 }} />
            </ScrollView>

            <ChallengeReflectionModal
                visible={isReflectionModalVisible}
                challenge={selectedChallenge}
                onClose={() => {
                    setIsReflectionModalVisible(false);
                    setSelectedChallenge(null);
                }}
                onComplete={(reflection, feeling) => {
                    if (selectedChallenge) {
                        completeChallenge(selectedChallenge.id, reflection, feeling);
                    }
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { paddingHorizontal: Spacing.xl },
    progressCard: {
        alignItems: 'center',
        paddingVertical: Spacing.md,
    },
    progressEmoji: {
        fontSize: 48,
        marginBottom: Spacing.sm,
    },
    progressTitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        marginBottom: 4,
    },
    progressSubtitle: {
        fontSize: FontSizes.sm,
        marginBottom: Spacing.md,
    },
    progressBar: {
        width: '100%',
        height: 8,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    levelSection: {
        marginBottom: Spacing.xl,
    },
    levelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        marginBottom: Spacing.md,
    },
    levelBadge: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    levelNumber: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
    },
    levelTitle: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
    },
    levelDescription: {
        fontSize: FontSizes.sm,
        marginTop: 2,
    },
});
