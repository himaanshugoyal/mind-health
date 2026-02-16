import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/hooks/use-app-theme';
import { ThemeSelector } from '@/components/ThemeSelector';
import { Card } from '@/components/Card';
import { Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';

export default function ThemeSettingsScreen() {
    const { theme } = useAppTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                    <Text style={[styles.backBtn, { color: theme.primary }]}>← Back</Text>
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>Mood Theme</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Preview Card */}
                <Card variant="elevated" style={{ backgroundColor: theme.primaryLight }}>
                    <Text style={[styles.previewLabel, { color: theme.primary }]}>
                        ✦ PREVIEW
                    </Text>
                    <Text style={[styles.previewText, { color: theme.text }]}>
                        "Your peace matters more than perfection."
                    </Text>
                </Card>

                {/* Theme Selector */}
                <ThemeSelector />

                {/* Info */}
                <View style={[styles.infoCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
                    <Text style={{ fontSize: 18, marginBottom: Spacing.sm }}>💡</Text>
                    <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                        Your theme choice is saved automatically and will be remembered next time you open the app.
                    </Text>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.lg,
    },
    backBtn: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
    },
    title: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
    },
    scroll: {
        paddingHorizontal: Spacing.xl,
    },
    previewLabel: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.semibold,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: Spacing.sm,
    },
    previewText: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.medium,
        fontStyle: 'italic',
        lineHeight: 26,
    },
    infoCard: {
        borderRadius: Radius.lg,
        borderWidth: 1,
        padding: Spacing.lg,
        marginTop: Spacing.lg,
    },
    infoText: {
        fontSize: FontSizes.sm,
        lineHeight: 20,
    },
});
