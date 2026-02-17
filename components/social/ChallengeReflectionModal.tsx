import { FontSizes, FontWeights, Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { SocialChallenge } from '@/types/challenge';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ChallengeReflectionModalProps {
    visible: boolean;
    challenge: SocialChallenge | null;
    onClose: () => void;
    onComplete: (reflection?: string, feeling?: SocialChallenge['feeling']) => void;
}

const FEELINGS: { feeling: SocialChallenge['feeling']; label: string; emoji: string }[] = [
    { feeling: 'empowered', label: 'Empowered', emoji: '💪' },
    { feeling: 'proud', label: 'Proud', emoji: '🌟' },
    { feeling: 'nervous', label: 'Nervous', emoji: '😰' },
    { feeling: 'uncomfortable', label: 'Uncomfortable', emoji: '😬' },
    { feeling: 'neutral', label: 'Neutral', emoji: '😐' },
];

export function ChallengeReflectionModal({
    visible,
    challenge,
    onClose,
    onComplete,
}: ChallengeReflectionModalProps) {
    const { theme } = useAppTheme();
    const [feeling, setFeeling] = useState<SocialChallenge['feeling']>('proud');
    const [reflection, setReflection] = useState('');

    const handleComplete = () => {
        onComplete(reflection.trim() || undefined, feeling);

        // Reset form
        setFeeling('proud');
        setReflection('');
        onClose();
    };

    if (!challenge) return null;

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: theme.card }]}>
                    <View style={styles.header}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.title, { color: theme.text }]}>Challenge Complete! 🎉</Text>
                            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                                {challenge.title}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={theme.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>
                            How did it feel?
                        </Text>
                        <View style={styles.feelingGrid}>
                            {FEELINGS.map((item) => (
                                <TouchableOpacity
                                    key={item.feeling}
                                    style={[
                                        styles.feelingChip,
                                        {
                                            backgroundColor:
                                                feeling === item.feeling ? theme.primaryLight : theme.background,
                                            borderColor: feeling === item.feeling ? theme.primary : theme.border,
                                        },
                                    ]}
                                    onPress={() => {
                                        setFeeling(item.feeling);
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    }}
                                >
                                    <Text style={styles.feelingEmoji}>{item.emoji}</Text>
                                    <Text
                                        style={[
                                            styles.feelingLabel,
                                            {
                                                color:
                                                    feeling === item.feeling ? theme.primary : theme.textSecondary,
                                            },
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={[styles.label, { color: theme.textSecondary }]}>
                            Reflection (Optional)
                        </Text>
                        <Text style={[styles.hint, { color: theme.textTertiary }]}>
                            What did you learn? How did it go? What would you do differently next time?
                        </Text>
                        <TextInput
                            style={[
                                styles.input,
                                styles.reflectionInput,
                                {
                                    backgroundColor: theme.background,
                                    color: theme.text,
                                    borderColor: theme.border,
                                },
                            ]}
                            placeholder="Share your experience..."
                            placeholderTextColor={theme.textTertiary}
                            value={reflection}
                            onChangeText={setReflection}
                            multiline
                            numberOfLines={6}
                        />
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.completeButton, { backgroundColor: theme.primary }]}
                        onPress={handleComplete}
                    >
                        <Ionicons name="checkmark-circle" size={20} color="white" style={{ marginRight: 8 }} />
                        <Text style={styles.completeButtonText}>Mark as Complete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        borderTopLeftRadius: Radius.xl,
        borderTopRightRadius: Radius.xl,
        padding: Spacing.xl,
        maxHeight: '85%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
    },
    subtitle: {
        fontSize: FontSizes.sm,
        marginTop: 4,
    },
    label: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.medium,
        marginBottom: Spacing.sm,
        marginTop: Spacing.md,
    },
    hint: {
        fontSize: FontSizes.xs,
        marginBottom: Spacing.sm,
        lineHeight: 16,
    },
    feelingGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    feelingChip: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: Radius.md,
        borderWidth: 2,
        minWidth: 80,
    },
    feelingEmoji: {
        fontSize: 28,
    },
    feelingLabel: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.medium,
    },
    input: {
        borderWidth: 1,
        borderRadius: Radius.md,
        padding: Spacing.md,
        fontSize: FontSizes.md,
    },
    reflectionInput: {
        height: 120,
        textAlignVertical: 'top',
    },
    completeButton: {
        flexDirection: 'row',
        paddingVertical: 16,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.lg,
    },
    completeButtonText: {
        color: 'white',
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
    },
});
