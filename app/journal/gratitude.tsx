import React, { useState } from 'react';
import {
    View, Text, ScrollView, TextInput, StyleSheet,
    TouchableOpacity, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { GratitudeEntry } from '@/src/types/journal';
import { saveEntry } from '@/src/storage/journal-storage';
import { Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

const DEEPENING_PROMPTS = [
    'Why does this matter to you?',
    'How did this make you feel?',
    'What would life be like without this?',
];

export default function GratitudeJournalScreen() {
    const { theme } = useAppTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [items, setItems] = useState([
        { text: '', reflection: '', expanded: false },
        { text: '', reflection: '', expanded: false },
        { text: '', reflection: '', expanded: false },
    ]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const updateItem = (index: number, field: 'text' | 'reflection', value: string) => {
        setItems((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: value };
            return copy;
        });
    };

    const toggleExpand = (index: number) => {
        setItems((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], expanded: !copy[index].expanded };
            return copy;
        });
    };

    const filledCount = items.filter((i) => i.text.trim()).length;

    const handleSave = async () => {
        if (filledCount === 0) return;
        setSaving(true);
        try {
            await saveEntry({
                type: 'gratitude',
                items: items
                    .filter((i) => i.text.trim())
                    .map((i) => ({
                        text: i.text.trim(),
                        reflection: i.reflection.trim() || undefined,
                    })),
                tags: ['grateful'],
            } as Omit<GratitudeEntry, 'id' | 'createdAt' | 'updatedAt'>);
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
                    <Text style={[styles.title, { color: theme.text }]}>🙏 Gratitude</Text>
                    <View style={{ width: 50 }} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {!saved ? (
                        <>
                            <Card variant="elevated" style={{ backgroundColor: theme.primaryLight }}>
                                <Text style={[styles.introText, { color: theme.primary }]}>
                                    ✦ 3 things I'm grateful for today
                                </Text>
                                <Text style={[styles.introSub, { color: theme.textSecondary }]}>
                                    Even small things count. A warm cup of tea, a kind word, a moment of peace.
                                </Text>
                            </Card>

                            {items.map((item, index) => (
                                <Card key={index} variant="default">
                                    <View style={styles.itemHeader}>
                                        <Text style={[styles.itemNumber, { color: theme.primary }]}>
                                            {index + 1}
                                        </Text>
                                        <Text style={[styles.itemLabel, { color: theme.textSecondary }]}>
                                            I'm grateful for...
                                        </Text>
                                    </View>
                                    <TextInput
                                        style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                                        placeholder={
                                            index === 0
                                                ? 'Something that made me smile...'
                                                : index === 1
                                                    ? 'Someone who matters to me...'
                                                    : 'A simple blessing in my life...'
                                        }
                                        placeholderTextColor={theme.textTertiary}
                                        multiline
                                        textAlignVertical="top"
                                        value={item.text}
                                        onChangeText={(v) => updateItem(index, 'text', v)}
                                    />

                                    {item.text.trim() && (
                                        <TouchableOpacity
                                            onPress={() => toggleExpand(index)}
                                            style={styles.deepenButton}
                                        >
                                            <Text style={[styles.deepenText, { color: theme.spirit }]}>
                                                {item.expanded ? '▾' : '▸'} Go deeper: {DEEPENING_PROMPTS[index]}
                                            </Text>
                                        </TouchableOpacity>
                                    )}

                                    {item.expanded && (
                                        <TextInput
                                            style={[
                                                styles.reflectionInput,
                                                { color: theme.text, borderColor: theme.spirit + '40', backgroundColor: theme.spiritLight },
                                            ]}
                                            placeholder="Reflect on why this matters..."
                                            placeholderTextColor={theme.textTertiary}
                                            multiline
                                            textAlignVertical="top"
                                            value={item.reflection}
                                            onChangeText={(v) => updateItem(index, 'reflection', v)}
                                        />
                                    )}
                                </Card>
                            ))}

                            <Button
                                title={`Save Gratitude (${filledCount}/3)`}
                                onPress={handleSave}
                                disabled={filledCount === 0}
                                loading={saving}
                                size="lg"
                                style={{ marginTop: Spacing.sm }}
                            />
                        </>
                    ) : (
                        <>
                            <Card
                                variant="elevated"
                                style={{ backgroundColor: theme.primaryLight, alignItems: 'center' as const }}
                            >
                                <Text style={styles.successEmoji}>🌸</Text>
                                <Text style={[styles.successText, { color: theme.primary }]}>
                                    Gratitude saved
                                </Text>
                                <Text style={[styles.successSub, { color: theme.textSecondary }]}>
                                    Gratitude is the heart's memory. You just made yours stronger.
                                </Text>
                            </Card>

                            <Card variant="outlined">
                                <Text style={[styles.summaryLabel, { color: theme.textTertiary }]}>
                                    Today you're grateful for:
                                </Text>
                                {items.filter((i) => i.text.trim()).map((item, i) => (
                                    <View key={i} style={styles.summaryItem}>
                                        <Text style={[styles.summaryBullet, { color: theme.primary }]}>
                                            {i + 1}.
                                        </Text>
                                        <Text style={[styles.summaryText, { color: theme.text }]}>
                                            {item.text}
                                        </Text>
                                    </View>
                                ))}
                            </Card>

                            <View style={styles.postActions}>
                                <Button
                                    title="Done"
                                    onPress={() => router.back()}
                                    size="lg"
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
    introText: {
        fontSize: FontSizes.md, fontWeight: FontWeights.semibold,
        textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.xs,
    },
    introSub: { fontSize: FontSizes.sm, lineHeight: 20 },
    itemHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
    itemNumber: { fontSize: FontSizes['2xl'], fontWeight: FontWeights.bold, opacity: 0.3 },
    itemLabel: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
    input: {
        minHeight: 72, fontSize: FontSizes.md, lineHeight: 22,
        borderWidth: 1, borderRadius: Radius.md, padding: Spacing.md,
    },
    deepenButton: { marginTop: Spacing.md },
    deepenText: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
    reflectionInput: {
        minHeight: 60, fontSize: FontSizes.sm, lineHeight: 20,
        borderWidth: 1, borderRadius: Radius.md, padding: Spacing.md, marginTop: Spacing.sm,
    },
    successEmoji: { fontSize: 40, marginBottom: Spacing.md },
    successText: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold },
    successSub: { fontSize: FontSizes.sm, marginTop: Spacing.xs, textAlign: 'center', lineHeight: 20 },
    summaryLabel: {
        fontSize: FontSizes.xs, fontWeight: FontWeights.semibold,
        textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.md,
    },
    summaryItem: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
    summaryBullet: { fontSize: FontSizes.md, fontWeight: FontWeights.bold },
    summaryText: { fontSize: FontSizes.md, flex: 1, lineHeight: 22 },
    postActions: { marginTop: Spacing.xl },
});
