import { Card } from '@/components/Card';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MENU_ITEMS = [
    { icon: 'person-circle', label: 'Profile', subtitle: 'Your wellness journey', route: '/more/profile' },
    { icon: 'checkmark-circle', label: 'Habits', subtitle: 'Track your daily habits', route: '/habits' },
    { icon: 'bar-chart', label: 'Mood Tracker', subtitle: 'Check in & view trends', route: '/(tabs)/insights' },
    { icon: 'chatbubbles', label: 'AI Life Coach', subtitle: 'Chat with your AI companion', route: null },
    { icon: 'heart', label: 'Emotional Release', subtitle: 'Let go of what weighs you down', route: null },
    { icon: 'compass', label: 'Themed Journeys', subtitle: 'Structured growth programs', route: null },
    { icon: 'settings', label: 'Settings', subtitle: 'Preferences & theme', route: '/theme-settings' },
];

export default function MoreScreen() {
    const { theme } = useAppTheme();
    const router = useRouter();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScreenHeader title="More" subtitle="Explore your wellness tools" />
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Profile Card */}
                <Card variant="elevated" style={{ backgroundColor: theme.primaryLight, marginBottom: Spacing.lg }}>
                    <View style={styles.profileRow}>
                        <View style={[styles.avatar, { backgroundColor: theme.primary + '40' }]}>
                            <Text style={{ fontSize: 28 }}>🧘</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.name, { color: theme.text }]}>Himanshu Goyal</Text>
                            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Your wellness journey</Text>
                        </View>
                    </View>
                </Card>

                {/* Menu Items */}
                {MENU_ITEMS.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => item.route && router.push(item.route as any)}
                        activeOpacity={0.7}
                        disabled={!item.route}
                    >
                        <Card variant="default" style={styles.menuCard}>
                            <View style={styles.menuRow}>
                                <View style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}>
                                    <Ionicons name={item.icon as any} size={24} color={theme.primary} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.menuLabel, { color: theme.text }]}>{item.label}</Text>
                                    <Text style={[styles.menuSubtitle, { color: theme.textSecondary }]}>{item.subtitle}</Text>
                                </View>
                                {item.route && (
                                    <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
                                )}
                            </View>
                        </Card>
                    </TouchableOpacity>
                ))}

                {/* Restart Onboarding */}
                <TouchableOpacity style={styles.restartButton}>
                    <Ionicons name="refresh" size={16} color={theme.textSecondary} style={{ marginRight: 6 }} />
                    <Text style={[styles.restartText, { color: theme.textSecondary }]}>Restart Onboarding</Text>
                </TouchableOpacity>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { paddingHorizontal: Spacing.xl },
    profileRow: { flexDirection: 'row', alignItems: 'center' },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12
    },
    name: { fontSize: 18, fontWeight: '700' },
    subtitle: { fontSize: 14, marginTop: 2 },
    menuCard: { marginBottom: Spacing.sm },
    menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuLabel: { fontSize: 16, fontWeight: '600' },
    menuSubtitle: { fontSize: 13, marginTop: 2 },
    restartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.lg,
        paddingVertical: Spacing.md,
    },
    restartText: { fontSize: 14, fontWeight: '500' },
});
