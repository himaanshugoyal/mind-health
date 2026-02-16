import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, TextInput, StyleSheet,
    TouchableOpacity, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { EmotionTagSelector } from '@/components/EmotionTagSelector';
import {
    EmotionTag, AI_REFRAMES, ThoughtEntry,
} from '@/src/types/journal';
import { saveEntry, checkOverthinking } from '@/src/storage/journal-storage';
import { Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

export default function ThoughtJournalScreen() {
    const { theme } = useAppTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [content, setContent] = useState('');
    const [tags, setTags] = useState<EmotionTag[]>([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [reframe, setReframe] = useState<string | null>(null);
    const [overthinking, setOverthinking] = useState<{ flag: boolean; tag?: string; count?: number }>({ flag: false });

    const toggleTag = (tag: EmotionTag) => {
        setTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const getReframe = (selectedTags: EmotionTag[]): string | null => {
        for (const tag of selectedTags) {
            const options = AI_REFRAMES[tag];
            if (options && options.length > 0) {
                return options[Math.floor(Math.random() * options.length)];
            }
        }
        return null;
    };

    const handleSave = async () => {
        if (!content.trim()) return;
        setSaving(true);
        try {
            await saveEntry({
                type: 'thought',
                content: content.trim(),
                tags,
                aiReframe: undefined,
            } as Omit<ThoughtEntry, 'id' | 'createdAt' | 'updatedAt'>);

            // Generate reframe
            const r = getReframe(tags);
            setReframe(r);

            // Check overthinking
            const ot = await checkOverthinking();
            if (ot.isOverthinking) {
                setOverthinking({ flag: true, tag: ot.repeatedTag, count: ot.count });
            }

            setSaved(true);
        } catch (e) {
            Alert.alert('Error', 'Failed to save entry');
        } finally {
            setSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View
                style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={[styles.backText, { color: theme.primary }]}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: theme.text }]}>💭 Thought Journal</Text>
                    <View style={{ width: 50 }} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {!saved ? (
                        <>
                            {/* Writing Area */}
                            <Card variant="elevated">
                                <Text style={[styles.prompt, { color: theme.textSecondary }]}>
                                    What's on your mind?
                                </Text>
                                <TextInput
                                    style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                                    placeholder="Write freely... no judgments here."
                                    placeholderTextColor={theme.textTertiary}
                                    multiline
                                    textAlignVertical="top"
                                    value={content}
                                    onChangeText={setContent}
                                    autoFocus
                                />
                                <Text style={[styles.charCount, { color: theme.textTertiary }]}>
                                    {content.length} characters
                                </Text>
                            </Card>

                            {/* Emotion Tags */}
                            <EmotionTagSelector selected={tags} onToggle={toggleTag} />

                            {/* Save Button */}
                            <Button
                                title="Save Thought"
                                onPress={handleSave}
                                disabled={!content.trim()}
                                loading={saving}
                                size="lg"
                                style={{ marginTop: Spacing.md }}
                            />
                        </>
                    ) : (
                        <>
                            {/* Success State */}
                            <Card variant="elevated" style={{ backgroundColor: theme.primaryLight, alignItems: 'center' as const }}>
                                <Text style={styles.successEmoji}>✅</Text>
                                <Text style={[styles.successText, { color: theme.primary }]}>
                                    Thought saved
                                </Text>
                                <Text style={[styles.successSub, { color: theme.textSecondary }]}>
                                    Thank you for being honest with yourself.
                                </Text>
                            </Card>

                            {/* AI Reframe */}
                            {reframe && (
                                <Card variant="elevated" style={{ backgroundColor: theme.spiritLight }}>
                                    <Text style={styles.reframeLabel}>
                                        🧠 A different perspective
                                    </Text>
                                    <Text style={[styles.reframeText, { color: theme.text }]}>
                                        "{reframe}"
                                    </Text>
                                    <Text style={[styles.reframeNote, { color: theme.textTertiary }]}>
                                        This is a gentle reframe, not a dismissal of how you feel.
                                    </Text>
                                </Card>
                            )}

                            {/* Overthinking Warning */}
                            {overthinking.flag && (
                                <Card variant="outlined" style={{ borderColor: theme.warning + '60' }}>
                                    <Text style={styles.otIcon}>🔄</Text>
                                    <Text style={[styles.otTitle, { color: theme.warning }]}>
                                        Pattern noticed
                                    </Text>
                                    <Text style={[styles.otText, { color: theme.textSecondary }]}>
                                        You've tagged "{overthinking.tag}" in {overthinking.count} of your
                                        last 5 entries. That's okay — noticing the pattern is the first step.
                                        Try a breathing exercise or a gratitude entry to shift perspective.
                                    </Text>
                                </Card>
                            )}

                            <View style={styles.postActions}>
                                <Button
                                    title="Write Another"
                                    onPress={() => {
                                        setContent('');
                                        setTags([]);
                                        setReframe(null);
                                        setOverthinking({ flag: false });
                                        setSaved(false);
                                    }}
                                    variant="secondary"
                                    size="lg"
                                />
                                <Button
                                    title="Done"
                                    onPress={() => router.back()}
                                    size="lg"
                                    style={{ marginTop: Spacing.sm }}
                                />
                            </View>
                        </>
                    )}
                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    },
    backText: { fontSize: FontSizes.md, fontWeight: FontWeights.medium },
    title: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold },
    scroll: { paddingHorizontal: Spacing.xl },
    prompt: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, marginBottom: Spacing.md },
    input: {
        minHeight: 160, fontSize: FontSizes.md, lineHeight: 24,
        borderWidth: 1, borderRadius: Radius.md, padding: Spacing.md,
    },
    charCount: { fontSize: FontSizes.xs, textAlign: 'right', marginTop: Spacing.xs },
    successEmoji: { fontSize: 40, marginBottom: Spacing.md },
    successText: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold },
    successSub: { fontSize: FontSizes.sm, marginTop: Spacing.xs, textAlign: 'center' },
    reframeLabel: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, marginBottom: Spacing.sm },
    reframeText: { fontSize: FontSizes.md, fontStyle: 'italic', lineHeight: 24, marginBottom: Spacing.sm },
    reframeNote: { fontSize: FontSizes.xs },
    otIcon: { fontSize: 24, marginBottom: Spacing.sm },
    otTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, marginBottom: Spacing.xs },
    otText: { fontSize: FontSizes.sm, lineHeight: 20 },
    postActions: { marginTop: Spacing.xl },
});
