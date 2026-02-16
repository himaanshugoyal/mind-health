import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MantraPlayer, MantraType } from '@/components/practice/MantraPlayer';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';

const MANTRAS: { id: MantraType; label: string }[] = [
    { id: 'peace', label: 'Peace' },
    { id: 'strength', label: 'Strength' },
    { id: 'clarity', label: 'Clarity' },
    { id: 'healing', label: 'Healing' },
];

export default function MantraScreen() {
    const { theme } = useAppTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [type, setType] = useState<MantraType>('peace');
    const [isActive, setIsActive] = useState(true);

    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ fontSize: FontSizes.md, color: theme.primary }}>← Back</Text>
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>Daily Mantra</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <MantraPlayer type={type} isActive={isActive} />

                <View style={styles.controls}>
                    <Text style={[styles.selectLabel, { color: theme.textSecondary }]}>
                        Select a focus
                    </Text>
                    <View style={styles.grid}>
                        {MANTRAS.map((m) => (
                            <TouchableOpacity
                                key={m.id}
                                style={[
                                    styles.option,
                                    { borderColor: theme.border },
                                    type === m.id && { backgroundColor: theme.spiritLight, borderColor: theme.spirit },
                                ]}
                                onPress={() => setType(m.id)}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        {
                                            color: type === m.id ? theme.spirit : theme.text,
                                            fontWeight: type === m.id ? FontWeights.semibold : FontWeights.medium,
                                        },
                                    ]}
                                >
                                    {m.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
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
        paddingBottom: Spacing.xl * 2,
    },
    controls: {
        paddingHorizontal: Spacing.xl,
    },
    selectLabel: {
        fontSize: FontSizes.sm,
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    option: {
        width: '47%',
        paddingVertical: Spacing.lg,
        alignItems: 'center',
        borderRadius: Radius.lg,
        borderWidth: 1,
    },
    optionText: {
        fontSize: FontSizes.md,
    },
});
