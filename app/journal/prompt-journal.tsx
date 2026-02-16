import React, { useState } from 'react';
import {
    View, Text, ScrollView, TextInput, StyleSheet,
    TouchableOpacity, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { EmotionTagSelector } from '@/components/EmotionTagSelector';
import {
    EmotionTag, JournalType, PromptJournalEntry,
    SELF_COMPASSION_PROMPTS, OPENING_UP_PROMPTS, PATIENCE_PROMPTS, LETTING_GO_PROMPTS,
} from '@/src/types/journal';
import { saveEntry } from '@/src/storage/journal-storage';
import { Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

// ─── Config per journal type ─────────────────────────────────────────────────

type PromptType = 'self-compassion' | 'opening-up' | 'patience' | 'letting-go' | 'express' | 'reflect';

const CONFIGS: Record<PromptType, {
    title: string;
    emoji: string;
    prompts: string[];
    accent: string;      // theme color key
    accentLight: string;  // theme color key
    placeholder: string;
    successMessage: string;
}> = {
    'self-compassion': {
        title: 'Self Compassion',
        emoji: '💗',
        prompts: SELF_COMPASSION_PROMPTS,
        accent: 'compassion',
        accentLight: 'compassionLight',
        placeholder: 'Be gentle with yourself... write with kindness.',
        successMessage: 'You showed yourself compassion today. That takes courage.',
    },
    'opening-up': {
        title: 'Opening Up',
        emoji: '🦋',
        prompts: OPENING_UP_PROMPTS,
        accent: 'openness',
        accentLight: 'opennessLight',
        placeholder: 'Let your thoughts flow freely... this is your safe space.',
        successMessage: 'Opening up is brave. Your words matter.',
    },
    'patience': {
        title: 'Patience',
        emoji: '🌱',
        prompts: PATIENCE_PROMPTS,
        accent: 'patience',
        accentLight: 'patienceLight',
        placeholder: 'Slow down... there\'s no rush here.',
        successMessage: 'Patience is a strength you\'re building, one breath at a time.',
    },
    'letting-go': {
        title: 'Letting Go',
        emoji: '🍃',
        prompts: LETTING_GO_PROMPTS,
        accent: 'release',
        accentLight: 'releaseLight',
        placeholder: 'Write what you\'re ready to release...',
        successMessage: 'Letting go takes trust. You\'re making space for something new.',
    },
    'express': {
        title: 'Express',
        emoji: '📨',
        prompts: [], // Overridden by params
        accent: 'rose',
        accentLight: 'roseLight',
        placeholder: 'Express yourself freely...',
        successMessage: 'Releasing this is a gift to yourself.',
    },
    'reflect': {
        title: 'Reflect',
        emoji: '🪞',
        prompts: [], // Overridden by params
        accent: 'sage',
        accentLight: 'sageLight',
        placeholder: 'What comes to mind?',
        successMessage: 'Insight comes from gentle attention.',
    },
};

export default function PromptJournalScreen() {
    const { theme } = useAppTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const params = useLocalSearchParams<{ type: string; title?: string; prompt?: string }>();

    const journalType = (params.type || 'self-compassion') as PromptType;
    const config = CONFIGS[journalType];
    const accentColor = (theme as any)[config.accent] || theme.primary;
    const accentLightColor = (theme as any)[config.accentLight] || theme.primaryLight;

    // Allow overriding title and prompt via params (for Express/Reflect specific options)
    const titleOverride = params.title ? (params.title as string) : config.title;
    const promptOverride = params.prompt as string;

    const [prompt] = useState(
        () => promptOverride || config.prompts[Math.floor(Math.random() * config.prompts.length)]
    );
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
                type: journalType,
                content: content.trim(),
                prompt,
                tags,
            } as Omit<PromptJournalEntry, 'id' | 'createdAt' | 'updatedAt'>);
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
                        <Text style={[styles.backText, { color: accentColor }]}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: theme.text }]}>
                        {config.emoji} {titleOverride}
                    </Text>
                    <View style={{ width: 50 }} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {!saved ? (
                        <>
                            {/* Prompt Card */}
                            <Card variant="elevated" style={{ backgroundColor: accentLightColor }}>
                                <Text style={[styles.promptLabel, { color: accentColor }]}>
                                    ✨ Today's Prompt
                                </Text>
                                <Text style={[styles.promptText, { color: theme.text }]}>
                                    {prompt}
                                </Text>
                            </Card>

                            {/* Writing Area */}
                            <Card variant="elevated">
                                <TextInput
                                    style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                                    placeholder={config.placeholder}
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
                                title="Save Entry"
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
                            <Card variant="elevated" style={{ backgroundColor: accentLightColor, alignItems: 'center' as const }}>
                                <Text style={styles.successEmoji}>{config.emoji}</Text>
                                <Text style={[styles.successText, { color: accentColor }]}>
                                    Entry Saved
                                </Text>
                                <Text style={[styles.successSub, { color: theme.textSecondary }]}>
                                    {config.successMessage}
                                </Text>
                            </Card>

                            <View style={styles.postActions}>
                                <Button
                                    title="Write Another"
                                    onPress={() => {
                                        setContent('');
                                        setTags([]);
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
    promptLabel: {
        fontSize: FontSizes.sm, fontWeight: FontWeights.semibold,
        textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.sm,
    },
    promptText: { fontSize: FontSizes.md, lineHeight: 24, fontStyle: 'italic' },
    input: {
        minHeight: 160, fontSize: FontSizes.md, lineHeight: 24,
        borderWidth: 1, borderRadius: Radius.md, padding: Spacing.md,
    },
    charCount: { fontSize: FontSizes.xs, textAlign: 'right', marginTop: Spacing.xs },
    successEmoji: { fontSize: 40, marginBottom: Spacing.md },
    successText: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold },
    successSub: { fontSize: FontSizes.sm, marginTop: Spacing.xs, textAlign: 'center', lineHeight: 22 },
    postActions: { marginTop: Spacing.xl },
});
