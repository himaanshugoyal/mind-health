import React, { useState, useMemo } from 'react';
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
    EmotionTag, SpiritualEntry, SPIRITUAL_PROMPTS, getMoonPhase,
} from '@/src/types/journal';
import { saveEntry } from '@/src/storage/journal-storage';
import { Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

export default function SpiritualJournalScreen() {
    const { theme } = useAppTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const moonPhase = useMemo(() => getMoonPhase(), []);
    const dailyPrompt = useMemo(() => {
        const dayOfYear = Math.floor(
            (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
        );
        return SPIRITUAL_PROMPTS[dayOfYear % SPIRITUAL_PROMPTS.length];
    }, []);

    const [content, setContent] = useState('');
    const [tags, setTags] = useState<EmotionTag[]>([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const toggleTag = (tag: EmotionTag) => {
        setTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const handleSave = async () => {
        if (!content.trim()) return;
        setSaving(true);
        try {
            await saveEntry({
                type: 'spiritual',
                content: content.trim(),
                prompt: dailyPrompt,
                moonPhase: `${moonPhase.emoji} ${moonPhase.phase}`,
                tags,
            } as Omit<SpiritualEntry, 'id' | 'createdAt' | 'updatedAt'>);
            setSaved(true);
        } catch {
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
            <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={[styles.backText, { color: theme.spirit }]}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: theme.text }]}>🕉️ Spiritual</Text>
                    <View style={{ width: 50 }} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {!saved ? (
                        <>
                            {/* Moon Phase */}
                            <Card variant="elevated" style={{ backgroundColor: theme.spiritLight }}>
                                <View style={styles.moonRow}>
                                    <Text style={styles.moonEmoji}>{moonPhase.emoji}</Text>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.moonPhase, { color: theme.spirit }]}>
                                            {moonPhase.phase}
                                        </Text>
                                        <Text style={[styles.moonDate, { color: theme.textSecondary }]}>
                                            {new Date().toLocaleDateString('en-IN', {
                                                weekday: 'long', day: 'numeric', month: 'long',
                                            })}
                                        </Text>
                                    </View>
                                </View>
                            </Card>

                            {/* Daily Prompt */}
                            <Card variant="outlined" style={{ borderColor: theme.spirit + '40' }}>
                                <Text style={[styles.promptLabel, { color: theme.spirit }]}>
                                    ✦ Today's Reflection
                                </Text>
                                <Text style={[styles.promptText, { color: theme.text }]}>
                                    {dailyPrompt}
                                </Text>
                            </Card>

                            {/* Writing Area */}
                            <Card variant="default">
                                <TextInput
                                    style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                                    placeholder="Let your soul speak..."
                                    placeholderTextColor={theme.textTertiary}
                                    multiline
                                    textAlignVertical="top"
                                    value={content}
                                    onChangeText={setContent}
                                />
                            </Card>

                            {/* Emotion Tags */}
                            <EmotionTagSelector selected={tags} onToggle={toggleTag} />

                            <Button
                                title="Save Reflection"
                                onPress={handleSave}
                                disabled={!content.trim()}
                                loading={saving}
                                size="lg"
                                style={{ marginTop: Spacing.sm }}
                            />
                        </>
                    ) : (
                        <>
                            <Card variant="elevated" style={{ backgroundColor: theme.spiritLight, alignItems: 'center' as const }}>
                                <Text style={styles.successEmoji}>🪷</Text>
                                <Text style={[styles.successText, { color: theme.spirit }]}>
                                    Reflection saved
                                </Text>
                                <Text style={[styles.successSub, { color: theme.textSecondary }]}>
                                    Your spiritual awareness grows with each reflection.
                                </Text>
                            </Card>

                            <Card variant="outlined">
                                <Text style={[styles.savedPrompt, { color: theme.textTertiary }]}>
                                    {dailyPrompt}
                                </Text>
                                <Text style={[styles.savedContent, { color: theme.text }]}>
                                    {content}
                                </Text>
                                <Text style={[styles.savedMoon, { color: theme.spirit }]}>
                                    {moonPhase.emoji} {moonPhase.phase}
                                </Text>
                            </Card>

                            <View style={styles.postActions}>
                                <Button title="Done" onPress={() => router.back()} size="lg" />
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
    moonRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    moonEmoji: { fontSize: 36 },
    moonPhase: { fontSize: FontSizes.md, fontWeight: FontWeights.bold },
    moonDate: { fontSize: FontSizes.sm, marginTop: 2 },
    promptLabel: {
        fontSize: FontSizes.xs, fontWeight: FontWeights.semibold,
        textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.sm,
    },
    promptText: { fontSize: FontSizes.md, lineHeight: 24, fontStyle: 'italic' },
    input: {
        minHeight: 180, fontSize: FontSizes.md, lineHeight: 24,
        borderWidth: 1, borderRadius: Radius.md, padding: Spacing.md,
    },
    successEmoji: { fontSize: 40, marginBottom: Spacing.md },
    successText: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold },
    successSub: { fontSize: FontSizes.sm, marginTop: Spacing.xs, textAlign: 'center' },
    savedPrompt: {
        fontSize: FontSizes.xs, fontWeight: FontWeights.semibold,
        textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.md,
    },
    savedContent: { fontSize: FontSizes.md, lineHeight: 24, marginBottom: Spacing.md },
    savedMoon: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
    postActions: { marginTop: Spacing.xl },
});
