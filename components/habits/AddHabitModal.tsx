import { FontSizes, FontWeights, Palette, Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { HabitCategory } from '@/types/habit';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AddHabitModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (title: string, category: HabitCategory) => void;
}

const CATEGORIES: { id: HabitCategory; label: string; icon: string; color: string }[] = [
    { id: 'mind', label: 'Mind', icon: 'brain', color: Palette.twilight500 },
    { id: 'body', label: 'Body', icon: 'fitness', color: Palette.sage500 },
    { id: 'spirit', label: 'Spirit', icon: 'sparkles', color: Palette.amber500 },
];

const MICRO_GOAL_SUGGESTIONS = [
    "Deep breath for 1 min",
    "Drink water before coffee",
    "Read 1 page",
    "Stretch for 2 mins",
    "Write 1 sentence journal",
    "No phone 30m before bed",
];

export function AddHabitModal({ visible, onClose, onAdd }: AddHabitModalProps) {
    const { theme } = useAppTheme();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<HabitCategory>('mind');

    const handleAdd = () => {
        if (!title.trim()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }
        onAdd(title.trim(), category);
        setTitle('');
        setCategory('mind');
        onClose();
    };

    const handleSuggestion = (suggestion: string) => {
        setTitle(suggestion);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: theme.card }]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.text }]}>New Habit</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={theme.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={[styles.input, {
                            backgroundColor: theme.background,
                            color: theme.text,
                            borderColor: theme.border
                        }]}
                        placeholder="What habit do you want to build?"
                        placeholderTextColor={theme.textTertiary}
                        value={title}
                        onChangeText={setTitle}
                        autoFocus
                    />

                    <Text style={[styles.label, { color: theme.textSecondary }]}>Micro-Goal Suggestions</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestions}>
                        {MICRO_GOAL_SUGGESTIONS.map((s, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.suggestionChip, { backgroundColor: theme.background, borderColor: theme.border }]}
                                onPress={() => handleSuggestion(s)}
                            >
                                <Text style={[styles.suggestionText, { color: theme.textSecondary }]}>{s}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <Text style={[styles.label, { color: theme.textSecondary }]}>Category</Text>
                    <View style={styles.categories}>
                        {CATEGORIES.map(cat => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.categoryChip,
                                    {
                                        borderColor: category === cat.id ? cat.color : theme.border,
                                        backgroundColor: category === cat.id ? cat.color + '20' : theme.background
                                    }
                                ]}
                                onPress={() => {
                                    setCategory(cat.id);
                                    Haptics.selectionAsync();
                                }}
                            >
                                <Ionicons
                                    name={cat.icon as any}
                                    size={16}
                                    color={category === cat.id ? cat.color : theme.textSecondary}
                                    style={{ marginRight: 6 }}
                                />
                                <Text style={{
                                    color: category === cat.id ? cat.color : theme.textSecondary,
                                    fontWeight: category === cat.id ? '600' : '400'
                                }}>
                                    {cat.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: theme.primary }]}
                        onPress={handleAdd}
                    >
                        <Text style={styles.addButtonText}>Create Habit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        padding: Spacing.xl,
        borderTopLeftRadius: Radius.xl,
        borderTopRightRadius: Radius.xl,
        paddingBottom: 40,
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
    input: {
        padding: Spacing.md,
        borderRadius: Radius.md,
        borderWidth: 1,
        fontSize: FontSizes.md,
        marginBottom: Spacing.lg,
    },
    label: {
        fontSize: FontSizes.sm,
        marginBottom: Spacing.md,
        fontWeight: FontWeights.medium,
    },
    suggestions: {
        marginBottom: Spacing.lg,
        paddingRight: Spacing.xl,
    },
    suggestionChip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.full,
        borderWidth: 1,
        marginRight: Spacing.sm,
    },
    suggestionText: {
        fontSize: FontSizes.sm,
    },
    categories: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.xl,
    },
    categoryChip: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.md,
        borderRadius: Radius.md,
        borderWidth: 1,
    },
    addButton: {
        paddingVertical: Spacing.lg,
        borderRadius: Radius.full,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: FontSizes.md,
        fontWeight: FontWeights.bold,
    },
});
