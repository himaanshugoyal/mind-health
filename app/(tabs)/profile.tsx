import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/Card';
import { Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { MOOD_THEMES } from '@/constants/themes';

const GOALS = [
    { icon: '🌟', label: 'Stay Positive', active: true },
    { icon: '🧘', label: 'Practice Spirituality', active: true },
    { icon: '⚖️', label: 'Balance Work & Rest', active: true },
    { icon: '💬', label: 'Open Up with People', active: false },
    { icon: '🎈', label: 'Let Go of Burdens', active: true },
    { icon: '🕰️', label: 'Build Patience', active: true },
];

const SETTINGS = [
    { icon: '🔔', label: 'Notification Style', value: 'Gentle' },
    { icon: '🌙', label: 'Dark Mode', toggle: true },
    { icon: '🔐', label: 'Biometric Lock', toggle: true },
    { icon: '📤', label: 'Export Data' },
    { icon: '❓', label: 'Help & Support' },
    { icon: '📜', label: 'Privacy Policy' },
];

export default function ProfileScreen() {
    const { theme, moodTheme } = useAppTheme();
    const router = useRouter();

    // Find the current mood theme metadata
    const currentThemeMeta = MOOD_THEMES.find(t => t.id === moodTheme);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScreenHeader title="Profile" subtitle="Your journey, your way" />
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Avatar */}
                <Card variant="elevated">
                    <View style={styles.profileRow}>
                        <View style={[styles.avatar, { backgroundColor: theme.primaryLight }]}>
                            <Text style={{ fontSize: 28 }}>🧘</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.name, { color: theme.text }]}>Mindful Soul</Text>
                            <Text style={[styles.since, { color: theme.textSecondary }]}>Journey since Feb 2026</Text>
                        </View>
                        <TouchableOpacity><Text style={{ color: theme.primary, fontWeight: '600' }}>Edit</Text></TouchableOpacity>
                    </View>
                </Card>

                {/* Stats */}
                <Text style={[styles.section, { color: theme.text }]}>Your Journey</Text>
                <View style={styles.statsRow}>
                    {[
                        { icon: '📅', val: '32', label: 'Days Active', c: theme.primary },
                        { icon: '✍️', val: '87', label: 'Entries', c: theme.accent },
                        { icon: '🧘', val: '6.2h', label: 'Meditation', c: theme.spirit },
                    ].map((s, i) => (
                        <Card key={i} style={styles.stat}>
                            <Text style={{ fontSize: 22 }}>{s.icon}</Text>
                            <Text style={[styles.statNum, { color: s.c }]}>{s.val}</Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{s.label}</Text>
                        </Card>
                    ))}
                </View>

                {/* Goals */}
                <Text style={[styles.section, { color: theme.text }]}>Your Goals</Text>
                <Card>
                    <View style={styles.goals}>
                        {GOALS.map((g, i) => (
                            <View key={i} style={[styles.goalChip, {
                                backgroundColor: g.active ? theme.primaryLight : theme.backgroundSecondary,
                                borderColor: g.active ? theme.primary + '40' : theme.border,
                            }]}>
                                <Text>{g.icon}</Text>
                                <Text style={{ color: g.active ? theme.primary : theme.textTertiary, fontSize: 13, fontWeight: '500' }}>{g.label}</Text>
                            </View>
                        ))}
                    </View>
                </Card>

                {/* Settings */}
                <Text style={[styles.section, { color: theme.text }]}>Settings</Text>
                <Card>
                    {/* Mood Theme Setting */}
                    <TouchableOpacity
                        style={[styles.settingRow, { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.border }]}
                        onPress={() => router.push('/theme-settings')}
                        activeOpacity={0.7}
                    >
                        <Text style={{ fontSize: 20 }}>🎨</Text>
                        <Text style={[styles.settingLabel, { color: theme.text }]}>Mood Theme</Text>
                        <View style={styles.themePreview}>
                            {currentThemeMeta && (
                                <>
                                    <Text style={{ fontSize: 14, marginRight: 4 }}>{currentThemeMeta.emoji}</Text>
                                    <Text style={{ color: theme.textSecondary, fontSize: 14 }}>{currentThemeMeta.name}</Text>
                                </>
                            )}
                            <Text style={{ color: theme.textTertiary, fontSize: 18, marginLeft: 6 }}>›</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Other Settings */}
                    {SETTINGS.map((s, i) => (
                        <View key={i} style={[styles.settingRow, i < SETTINGS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.border }]}>
                            <Text style={{ fontSize: 20 }}>{s.icon}</Text>
                            <Text style={[styles.settingLabel, { color: theme.text }]}>{s.label}</Text>
                            {s.toggle ? (
                                <Switch value={false} trackColor={{ false: theme.border, true: theme.primary + '60' }} thumbColor={theme.primary} />
                            ) : s.value ? (
                                <Text style={{ color: theme.textSecondary, fontSize: 14 }}>{s.value}</Text>
                            ) : (
                                <Text style={{ color: theme.textTertiary, fontSize: 22 }}>›</Text>
                            )}
                        </View>
                    ))}
                </Card>

                {/* Premium */}
                <Card variant="elevated" style={{ backgroundColor: theme.spiritLight, marginTop: Spacing.lg }}>
                    <Text style={{ fontSize: 20, marginBottom: 8 }}>👑</Text>
                    <Text style={[styles.premTitle, { color: theme.spirit }]}>Upgrade to Premium</Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 16 }}>
                        Unlock AI coaching, all meditations, themed journeys, and advanced insights.
                    </Text>
                    <TouchableOpacity style={[styles.premBtn, { backgroundColor: theme.spirit }]}>
                        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Start 7-Day Free Trial</Text>
                    </TouchableOpacity>
                </Card>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { paddingHorizontal: Spacing.xl },
    profileRow: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    name: { fontSize: 18, fontWeight: '700' },
    since: { fontSize: 14, marginTop: 2 },
    section: { fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 12 },
    statsRow: { flexDirection: 'row', gap: 12 },
    stat: { flex: 1, alignItems: 'center', paddingVertical: 16 },
    statNum: { fontSize: 22, fontWeight: '700', marginTop: 8 },
    statLabel: { fontSize: 12, marginTop: 4, textAlign: 'center' },
    goals: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    goalChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 99, borderWidth: 1 },
    settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
    settingLabel: { flex: 1, fontSize: 16 },
    themePreview: { flexDirection: 'row', alignItems: 'center' },
    premTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
    premBtn: { paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
});
