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
        title: 'What am I holding today?',
        subtitle: 'Name the weight you\'re carrying',
        prompt: 'Close your eyes. What feels heavy today? What thoughts are sticking?',
        icon: '🎒'
    },
    {
        title: 'What drained me?',
        subtitle: 'Identify what took your energy',
        prompt: 'Look back at your day. What interaction or task left you feeling empty?',
        icon: '🔋'
    },
    {
        title: 'What gave me energy?',
        subtitle: 'Notice what filled your cup',
        prompt: 'What moment today made you smile or feel lighter?',
        icon: '⚡'
    },
    {
        title: 'What do I need right now?',
        subtitle: 'Listen to your inner voice',
        prompt: 'If you could ask for anything—rest, connection, silence—what would it be?',
        icon: '🤲'
    },
    {
        title: 'What am I avoiding?',
        subtitle: 'Gently face what\'s beneath the surface',
        prompt: 'Is there a task or feeling you\'re pushing away? Why?',
        icon: '🙈'
    },
    {
        title: 'What matters most right now?',
        subtitle: 'Find your center of gravity',
        prompt: 'Amidst the noise, what is the one true thing you want to focus on?',
        icon: '🧭'
    },
];

export default function ReflectJournalScreen() {
    const { theme } = useAppTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ fontSize: FontSizes.md, color: theme.primary }}>← Back</Text>
                </TouchableOpacity>
            </View>

            <ScreenHeader
                title="Reflect"
                subtitle="Awareness and gentle insight"
            />

            <ScrollView contentContainerStyle={styles.scroll}>
                {OPTIONS.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.7}
                        onPress={() => router.push({
                            pathname: '/journal/prompt-journal',
                            params: {
                                type: 'reflect',
                                title: item.title,
                                prompt: item.prompt
                            }
                        })}
                    >
                        <Card style={{ marginBottom: Spacing.md }}>
                            <View style={styles.cardContent}>
                                <View style={[styles.iconBox, { backgroundColor: theme.primary + '15' }]}>
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
