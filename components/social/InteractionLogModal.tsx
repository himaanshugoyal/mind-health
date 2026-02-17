import { FontSizes, FontWeights, Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Interaction, InteractionType } from '@/types/relationship';
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

interface InteractionLogModalProps {
    visible: boolean;
    relationshipName: string;
    onClose: () => void;
    onLog: (
        type: InteractionType,
        feeling?: Interaction['feeling'],
        notes?: string,
        duration?: number
    ) => void;
}

const INTERACTION_TYPES: { type: InteractionType; label: string; icon: string }[] = [
    { type: 'in-person', label: 'In Person', icon: '🤝' },
    { type: 'call', label: 'Phone Call', icon: '📞' },
    { type: 'video', label: 'Video Call', icon: '📹' },
    { type: 'text', label: 'Text/Message', icon: '💬' },
    { type: 'other', label: 'Other', icon: '✨' },
];

const FEELINGS: { feeling: Interaction['feeling']; label: string; emoji: string }[] = [
    { feeling: 'great', label: 'Great', emoji: '😊' },
    { feeling: 'good', label: 'Good', emoji: '🙂' },
    { feeling: 'neutral', label: 'Neutral', emoji: '😐' },
    { feeling: 'difficult', label: 'Difficult', emoji: '😕' },
    { feeling: 'draining', label: 'Draining', emoji: '😔' },
];

export function InteractionLogModal({
    visible,
    relationshipName,
    onClose,
    onLog,
}: InteractionLogModalProps) {
    const { theme } = useAppTheme();
    const [type, setType] = useState<InteractionType>('in-person');
    const [feeling, setFeeling] = useState<Interaction['feeling']>('good');
    const [notes, setNotes] = useState('');

    const handleLog = () => {
        onLog(type, feeling, notes.trim() || undefined);

        // Reset form
        setType('in-person');
        setFeeling('good');
        setNotes('');
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: theme.card }]}>
                    <View style={styles.header}>
                        <View>
                            <Text style={[styles.title, { color: theme.text }]}>Log Interaction</Text>
                            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                                with {relationshipName}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={theme.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>
                            How did you connect?
                        </Text>
                        <View style={styles.typeGrid}>
                            {INTERACTION_TYPES.map((item) => (
                                <TouchableOpacity
                                    key={item.type}
                                    style={[
                                        styles.typeChip,
                                        {
                                            backgroundColor:
                                                type === item.type ? theme.primaryLight : theme.background,
                                            borderColor: type === item.type ? theme.primary : theme.border,
                                        },
                                    ]}
                                    onPress={() => {
                                        setType(item.type);
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    }}
                                >
                                    <Text style={styles.typeIcon}>{item.icon}</Text>
                                    <Text
                                        style={[
                                            styles.typeLabel,
                                            { color: type === item.type ? theme.primary : theme.textSecondary },
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

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
                            Notes (Optional)
                        </Text>
                        <TextInput
                            style={[
                                styles.input,
                                styles.notesInput,
                                {
                                    backgroundColor: theme.background,
                                    color: theme.text,
                                    borderColor: theme.border,
                                },
                            ]}
                            placeholder="What did you talk about? Any insights?"
                            placeholderTextColor={theme.textTertiary}
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                            numberOfLines={4}
                        />
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.logButton, { backgroundColor: theme.primary }]}
                        onPress={handleLog}
                    >
                        <Text style={styles.logButtonText}>Log Interaction</Text>
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
        marginTop: 2,
    },
    label: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.medium,
        marginBottom: Spacing.sm,
        marginTop: Spacing.md,
    },
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    typeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: Radius.md,
        borderWidth: 2,
    },
    typeIcon: {
        fontSize: 18,
    },
    typeLabel: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.medium,
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
        minWidth: 70,
    },
    feelingEmoji: {
        fontSize: 24,
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
    notesInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    logButton: {
        paddingVertical: 16,
        borderRadius: Radius.md,
        alignItems: 'center',
        marginTop: Spacing.lg,
    },
    logButtonText: {
        color: 'white',
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
    },
});
