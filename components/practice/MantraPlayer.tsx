import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withSequence,
    runOnJS,
} from 'react-native-reanimated';
import { Colors, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

export type MantraType = 'peace' | 'strength' | 'clarity' | 'healing';

interface Props {
    type: MantraType;
    isActive: boolean;
}

const MANTRAS: Record<MantraType, { sanskrit: string; meaning: string }> = {
    'peace': {
        sanskrit: 'Om Shanti Shanti Shanti',
        meaning: 'Peace in body, peace in mind, peace in spirit.',
    },
    'strength': {
        sanskrit: 'Aham Brahmasmi',
        meaning: 'I am the universe. I am infinite power.',
    },
    'clarity': {
        sanskrit: 'Om Gam Ganapataye Namaha',
        meaning: 'Remove obstacles. Clear my path.',
    },
    'healing': {
        sanskrit: 'Ra Ma Da Sa',
        meaning: 'Sun, Moon, Earth, Infinity: I am healing.',
    },
};

export function MantraPlayer({ type, isActive }: Props) {
    const { theme } = useAppTheme();
    const opacity = useSharedValue(0);
    const [showSanskrit, setShowSanskrit] = useState(true);
    const mantra = MANTRAS[type];

    useEffect(() => {
        if (isActive) {
            startLoop();
        } else {
            opacity.value = withTiming(0);
        }
    }, [isActive, type]);

    const startLoop = () => {
        opacity.value = withSequence(
            withTiming(1, { duration: 2000 }),
            withDelay(3000, withTiming(0, { duration: 2000 }, (finished) => {
                if (finished) {
                    runOnJS(toggleText)();
                }
            }))
        );
    };

    const toggleText = () => {
        setShowSanskrit(prev => !prev);
        startLoop();
    };

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <View style={styles.container}>
            <Animated.Text
                style={[
                    styles.text,
                    { color: theme.text },
                    animatedStyle,
                ]}
            >
                {showSanskrit ? mantra.sanskrit : mantra.meaning}
            </Animated.Text>

            <Text style={[styles.label, { color: theme.textSecondary }]}>
                {showSanskrit ? 'Sanskrit' : 'Meaning'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
        paddingHorizontal: Spacing.xl,
    },
    text: {
        fontSize: FontSizes['3xl'],
        fontWeight: FontWeights.bold,
        textAlign: 'center',
        lineHeight: 40,
    },
    label: {
        marginTop: Spacing.xl,
        fontSize: FontSizes.sm,
        textTransform: 'uppercase',
        letterSpacing: 2,
        opacity: 0.5,
    },
});
