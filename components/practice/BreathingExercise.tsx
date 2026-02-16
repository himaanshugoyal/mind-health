import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withSequence,
    Easing,
    cancelAnimation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.7;

export type BreathingPattern = 'box' | '4-7-8' | 'calm';

interface Props {
    pattern: BreathingPattern;
    isActive: boolean;
}

const PATTERNS: Record<BreathingPattern, {
    name: string;
    stages: { text: string; duration: number; scale: number }[];
}> = {
    'box': {
        name: 'Box Breathing',
        stages: [
            { text: 'Inhale', duration: 4000, scale: 1.5 },
            { text: 'Hold', duration: 4000, scale: 1.5 },
            { text: 'Exhale', duration: 4000, scale: 1.0 },
            { text: 'Hold', duration: 4000, scale: 1.0 },
        ],
    },
    '4-7-8': {
        name: '4-7-8 Relax',
        stages: [
            { text: 'Inhale', duration: 4000, scale: 1.5 },
            { text: 'Hold', duration: 7000, scale: 1.5 },
            { text: 'Exhale', duration: 8000, scale: 1.0 },
        ],
    },
    'calm': {
        name: 'Deep Calm',
        stages: [
            { text: 'Inhale', duration: 5000, scale: 1.5 },
            { text: 'Exhale', duration: 5000, scale: 1.0 },
        ],
    },
};

export function BreathingExercise({ pattern, isActive }: Props) {
    const { theme } = useAppTheme();
    const scale = useSharedValue(1);
    const [instruction, setInstruction] = useState('Ready?');
    const [stageIndex, setStageIndex] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | number | null>(null);

    const currentPattern = PATTERNS[pattern];

    useEffect(() => {
        if (isActive) {
            runStage(0);
        } else {
            reset();
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            cancelAnimation(scale);
        };
    }, [isActive, pattern]);

    const reset = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        cancelAnimation(scale);
        scale.value = withTiming(1, { duration: 1000 });
        setInstruction('Ready?');
        setStageIndex(0);
    };

    const runStage = (index: number) => {
        const stage = currentPattern.stages[index % currentPattern.stages.length];
        setInstruction(stage.text);
        setStageIndex(index);

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        scale.value = withTiming(stage.scale, {
            duration: stage.duration,
            easing: Easing.bezier(0.42, 0.0, 0.58, 1.0), // ease-in-out
        });

        timerRef.current = setTimeout(() => {
            runStage(index + 1);
        }, stage.duration);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <View style={styles.container}>
            <View style={[styles.circleContainer, { borderColor: theme.border }]}>
                {/* Background pulse rings */}
                <View style={[styles.pulseRing, { borderColor: theme.primary + '20' }]} />
                <View style={[styles.pulseRing, { borderColor: theme.primary + '10', width: CIRCLE_SIZE + 60, height: CIRCLE_SIZE + 60 }]} />

                {/* Main animated circle */}
                <Animated.View
                    style={[
                        styles.circle,
                        {
                            backgroundColor: theme.primaryLight,
                            borderColor: theme.primary,
                        },
                        animatedStyle,
                    ]}
                >
                    <Text style={[styles.instruction, { color: theme.primary }]}>
                        {instruction}
                    </Text>
                </Animated.View>
            </View>

            <Text style={[styles.patternName, { color: theme.textSecondary }]}>
                {currentPattern.name}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.xl * 2,
    },
    circleContainer: {
        width: CIRCLE_SIZE + 100,
        height: CIRCLE_SIZE + 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        width: CIRCLE_SIZE * 0.6,
        height: CIRCLE_SIZE * 0.6,
        borderRadius: (CIRCLE_SIZE * 0.6) / 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    pulseRing: {
        position: 'absolute',
        width: CIRCLE_SIZE + 20,
        height: CIRCLE_SIZE + 20,
        borderRadius: (CIRCLE_SIZE + 20) / 2,
        borderWidth: 1,
    },
    instruction: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    patternName: {
        marginTop: Spacing.xl,
        fontSize: FontSizes.md,
        fontWeight: FontWeights.medium,
    },
});
