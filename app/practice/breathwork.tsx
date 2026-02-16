import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/ScreenHeader';
import { BreathingExercise, BreathingPattern } from '@/components/practice/BreathingExercise';
import { Button } from '@/components/Button';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';

const PATTERNS: { id: BreathingPattern; label: string }[] = [
    { id: 'box', label: 'Box' },
    { id: '4-7-8', label: '4-7-8' },
    { id: 'calm', label: 'Calm' },
];

export default function BreathworkScreen() {
    const { theme } = useAppTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [pattern, setPattern] = useState<BreathingPattern>('4-7-8');
    const [isActive, setIsActive] = useState(false);

    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ fontSize: FontSizes.md, color: theme.primary }}>← Back</Text>
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>Breathwork</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <BreathingExercise pattern={pattern} isActive={isActive} />

                <View style={styles.controls}>
                    {/* Pattern Selector */}
                    <View style={[styles.selector, { backgroundColor: theme.border }]}>
                        {PATTERNS.map((p) => (
                            <TouchableOpacity
                                key={p.id}
                                style={[
                                    styles.option,
                                    pattern === p.id && { backgroundColor: theme.background },
                                ]}
                                onPress={() => {
                                    setPattern(p.id);
                                    setIsActive(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        {
                                            color: pattern === p.id ? theme.text : theme.textSecondary,
                                            fontWeight: pattern === p.id ? FontWeights.semibold : FontWeights.medium,
                                        },
                                    ]}
                                >
                                    {p.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Button
                        title={isActive ? "Stop" : "Start Breathing"}
                        onPress={() => setIsActive(!isActive)}
                        size="lg"
                        style={{ width: '100%', marginTop: Spacing.xl }}
                        variant={isActive ? 'secondary' : 'primary'}
                    />
                </View>
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
        paddingBottom: Spacing.lg,
    },
    title: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.xl * 2,
    },
    controls: {
        width: '100%',
    },
    selector: {
        flexDirection: 'row',
        padding: 4,
        borderRadius: Radius.lg,
    },
    option: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderRadius: Radius.md,
    },
    optionText: {
        fontSize: FontSizes.sm,
    },
});
