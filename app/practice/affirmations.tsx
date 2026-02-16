import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AffirmationDeck, AffirmationCategory } from '@/components/practice/AffirmationDeck';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';

const CATEGORIES: { id: AffirmationCategory; label: string }[] = [
    { id: 'self-love', label: 'Self Love' },
    { id: 'gratitude', label: 'Gratitude' },
    { id: 'confidence', label: 'Confidence' },
    { id: 'patience', label: 'Patience' },
    { id: 'letting-go', label: 'Letting Go' },
    { id: 'growth', label: 'Growth' },
];

export default function AffirmationsScreen() {
    const { theme } = useAppTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [category, setCategory] = useState<AffirmationCategory>('self-love');

    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ fontSize: FontSizes.md, color: theme.primary }}>← Back</Text>
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>Affirmations</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={{ height: 60 }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryScroll}
                >
                    {CATEGORIES.map((c) => (
                        <TouchableOpacity
                            key={c.id}
                            style={[
                                styles.categoryChip,
                                category === c.id
                                    ? { backgroundColor: theme.primary, borderColor: theme.primary }
                                    : { backgroundColor: theme.backgroundSecondary, borderColor: theme.border },
                            ]}
                            onPress={() => setCategory(c.id)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    {
                                        color: category === c.id ? '#fff' : theme.textSecondary,
                                        fontWeight: category === c.id ? FontWeights.semibold : FontWeights.medium,
                                    },
                                ]}
                            >
                                {c.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.content}>
                <AffirmationDeck category={category} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.md,
    },
    title: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
    },
    categoryScroll: {
        paddingHorizontal: Spacing.xl,
        gap: Spacing.sm,
        alignItems: 'center',
    },
    categoryChip: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: Radius.full,
        borderWidth: 1,
    },
    categoryText: {
        fontSize: FontSizes.sm,
    },
    content: {
        flex: 1,
    },
});
