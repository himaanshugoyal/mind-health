import { FontSizes, FontWeights, Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { ContactFrequency, RelationshipType } from '@/types/relationship';
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

interface AddRelationshipModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (
        name: string,
        type: RelationshipType,
        frequency: ContactFrequency,
        emoji?: string,
        notes?: string
    ) => void;
}

const RELATIONSHIP_TYPES: { type: RelationshipType; label: string; emoji: string }[] = [
    { type: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
    { type: 'friend', label: 'Friend', emoji: '👥' },
    { type: 'partner', label: 'Partner', emoji: '💑' },
    { type: 'colleague', label: 'Colleague', emoji: '💼' },
    { type: 'other', label: 'Other', emoji: '👤' },
];

const CONTACT_FREQUENCIES: { frequency: ContactFrequency; label: string }[] = [
    { frequency: 'daily', label: 'Daily' },
    { frequency: 'weekly', label: 'Weekly' },
    { frequency: 'biweekly', label: 'Bi-weekly' },
    { frequency: 'monthly', label: 'Monthly' },
    { frequency: 'occasionally', label: 'Occasionally' },
];

export function AddRelationshipModal({ visible, onClose, onAdd }: AddRelationshipModalProps) {
    const { theme } = useAppTheme();
    const [name, setName] = useState('');
    const [type, setType] = useState<RelationshipType>('friend');
    const [frequency, setFrequency] = useState<ContactFrequency>('weekly');
    const [notes, setNotes] = useState('');

    const handleAdd = () => {
        if (!name.trim()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        const selectedType = RELATIONSHIP_TYPES.find(t => t.type === type);
        onAdd(name.trim(), type, frequency, selectedType?.emoji, notes.trim() || undefined);

        // Reset form
        setName('');
        setType('friend');
        setFrequency('weekly');
        setNotes('');
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: theme.card }]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.text }]}>Add Relationship</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={theme.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Name</Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: theme.background,
                                    color: theme.text,
                                    borderColor: theme.border,
                                },
                            ]}
                            placeholder="Who do you want to track?"
                            placeholderTextColor={theme.textTertiary}
                            value={name}
                            onChangeText={setName}
                            autoFocus
                        />

                        <Text style={[styles.label, { color: theme.textSecondary }]}>Relationship Type</Text>
                        <View style={styles.typeGrid}>
                            {RELATIONSHIP_TYPES.map((item) => (
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
                                    <Text style={styles.typeEmoji}>{item.emoji}</Text>
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
                            How often do you want to connect?
                        </Text>
                        <View style={styles.frequencyList}>
                            {CONTACT_FREQUENCIES.map((item) => (
                                <TouchableOpacity
                                    key={item.frequency}
                                    style={[
                                        styles.frequencyChip,
                                        {
                                            backgroundColor:
                                                frequency === item.frequency ? theme.primaryLight : theme.background,
                                            borderColor:
                                                frequency === item.frequency ? theme.primary : theme.border,
                                        },
                                    ]}
                                    onPress={() => {
                                        setFrequency(item.frequency);
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.frequencyLabel,
                                            {
                                                color:
                                                    frequency === item.frequency ? theme.primary : theme.textSecondary,
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
                            placeholder="Any reminders or context..."
                            placeholderTextColor={theme.textTertiary}
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                            numberOfLines={3}
                        />
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: theme.primary }]}
                        onPress={handleAdd}
                    >
                        <Text style={styles.addButtonText}>Add Relationship</Text>
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
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
    },
    label: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.medium,
        marginBottom: Spacing.sm,
        marginTop: Spacing.md,
    },
    input: {
        borderWidth: 1,
        borderRadius: Radius.md,
        padding: Spacing.md,
        fontSize: FontSizes.md,
    },
    notesInput: {
        height: 80,
        textAlignVertical: 'top',
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
    typeEmoji: {
        fontSize: 18,
    },
    typeLabel: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.medium,
    },
    frequencyList: {
        gap: Spacing.sm,
    },
    frequencyChip: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: Radius.md,
        borderWidth: 2,
    },
    frequencyLabel: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.medium,
    },
    addButton: {
        paddingVertical: 16,
        borderRadius: Radius.md,
        alignItems: 'center',
        marginTop: Spacing.lg,
    },
    addButtonText: {
        color: 'white',
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
    },
});
