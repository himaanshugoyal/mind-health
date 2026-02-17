import { FontSizes, FontWeights, Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { SocialChallenge } from '@/types/challenge';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ChallengeCardProps {
    challenge: SocialChallenge;
    isLocked?: boolean;
    onPress: () => void;
}

const LEVEL_COLORS = {
    1: '#4CAF50',
    2: '#2196F3',
    3: '#FF9800',
    4: '#9C27B0',
};

const LEVEL_LABELS = {
    1: 'Breaking the Ice',
    2: 'Opening Up',
    3: 'Building Depth',
    4: 'True Vulnerability',
};

export function ChallengeCard({ challenge, isLocked = false, onPress }: ChallengeCardProps) {
    const { theme } = useAppTheme();
    const levelColor = LEVEL_COLORS[challenge.level];

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: theme.card,
                    borderColor: challenge.completed ? levelColor : theme.border,
                    borderWidth: challenge.completed ? 2 : 1,
                    opacity: isLocked ? 0.5 : 1,
                },
            ]}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={isLocked}
        >
            <View style={styles.header}>
                <View style={[styles.levelBadge, { backgroundColor: levelColor + '20' }]}>
                    <Text style={[styles.levelText, { color: levelColor }]}>
                        Level {challenge.level}
                    </Text>
                </View>

                {challenge.completed ? (
                    <View style={[styles.completedBadge, { backgroundColor: levelColor }]}>
                        <Ionicons name="checkmark-circle" size={20} color="white" />
                    </View>
                ) : isLocked ? (
                    <Ionicons name="lock-closed" size={20} color={theme.textTertiary} />
                ) : null}
            </View>

            <Text style={[styles.title, { color: theme.text }]}>{challenge.title}</Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
                {challenge.description}
            </Text>

            {challenge.completed && challenge.completedDate && (
                <View style={styles.completedInfo}>
                    <Text style={[styles.completedText, { color: theme.textTertiary }]}>
                        Completed {new Date(challenge.completedDate).toLocaleDateString()}
                    </Text>
                </View>
            )}

            {isLocked && (
                <View style={[styles.lockedOverlay, { backgroundColor: theme.background + 'CC' }]}>
                    <Ionicons name="lock-closed" size={24} color={theme.textTertiary} />
                    <Text style={[styles.lockedText, { color: theme.textSecondary }]}>
                        Complete Level {challenge.level - 1} to unlock
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: Radius.md,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    levelBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: Radius.sm,
    },
    levelText: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.semibold,
        textTransform: 'uppercase',
    },
    completedBadge: {
        borderRadius: 20,
    },
    title: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
        marginBottom: 6,
    },
    description: {
        fontSize: FontSizes.sm,
        lineHeight: 20,
    },
    completedInfo: {
        marginTop: Spacing.sm,
        paddingTop: Spacing.sm,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    completedText: {
        fontSize: FontSizes.xs,
        fontStyle: 'italic',
    },
    lockedOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    lockedText: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.medium,
    },
});
