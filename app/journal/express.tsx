import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/Card';
import { Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

const OPTIONS = [
    {
        title: 'Unsent Message',
        subtitle: 'Write to someone without sending',
        prompt: 'Who is this for? What do you wish you could say to them?',
        icon: '📨'
    },
    {
        title: 'What I Couldn\'t Say',
        subtitle: 'Give voice to unspoken words',
        prompt: 'What words got stuck in your throat recently? Let them out here.',
        icon: '😶'
    },
    {
        title: 'Forgiveness Letter',
        subtitle: 'Release resentment gently',
        prompt: 'I forgive you for... I forgive myself for...',
        icon: '🕊️'
    },
    {
        title: 'Emotional Release',
        subtitle: 'Let it all out without filter',
        prompt: 'Don\'t hold back. What are you really feeling right now?',
        icon: '🌊'
    },
    {
        title: 'Appreciation Note',
        subtitle: 'Express gratitude openly',
        prompt: 'Who or what are you appreciating right now? Tell them why.',
        icon: '💌'
    },
];

export default function ExpressJournalScreen() {
    const { theme } = useAppTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ fontSize: FontSizes.md, color: theme.emotion }}>← Back</Text>
                </TouchableOpacity>
            </View>

            <ScreenHeader
                title="Express"
                subtitle="Release what you're holding inside"
            />

            <ScrollView contentContainerStyle={styles.scroll}>
                {OPTIONS.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.7}
                        onPress={() => router.push({
                            pathname: '/journal/prompt-journal',
                            params: {
                                type: 'express',
                                title: item.title,
                                prompt: item.prompt
                            }
                        })}
                    >
                        <Card style={{ marginBottom: Spacing.md }}>
                            <View style={styles.cardContent}>
                                <View style={[styles.iconBox, { backgroundColor: theme.emotion + '15' }]}>
                                    <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.optionTitle, { color: theme.text }]}>{item.title}</Text>
                                    <Text style={[styles.optionSubtitle, { color: theme.textSecondary }]}>{item.subtitle}</Text>
                                </View>
                                <Text style={{ fontSize: 20, color: theme.textTertiary }}>→</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.sm },
    scroll: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl },
    cardContent: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    iconBox: {
        width: 48, height: 48, borderRadius: 24,
        alignItems: 'center', justifyContent: 'center',
    },
    optionTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.bold },
    optionSubtitle: { fontSize: FontSizes.sm, marginTop: 2 },
});
