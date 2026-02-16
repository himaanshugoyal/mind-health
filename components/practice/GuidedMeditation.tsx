import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    FadeIn,
    FadeOut,
} from 'react-native-reanimated';
import { Colors, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Button } from '@/components/Button';

const { width } = Dimensions.get('window');

export interface MeditationStep {
    text: string;
    duration: number; // seconds
}

interface Props {
    title: string;
    steps: MeditationStep[];
    colorKey: string;
    onComplete: () => void;
    onExit: () => void;
}

export function GuidedMeditation({ title, steps, colorKey, onComplete, onExit }: Props) {
    const { theme } = useAppTheme();
    const accentColor = (theme as any)[colorKey] || theme.primary;

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(steps[0].duration);
    const [isPaused, setIsPaused] = useState(false);
    const [completed, setCompleted] = useState(false);

    const progress = useSharedValue(0);
    const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);
    const elapsedRef = useRef(0);

    const timerRef = useRef<NodeJS.Timeout | number | null>(null);

    useEffect(() => {
        if (completed || isPaused) return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleNextStep();
                    return 0;
                }
                return prev - 1;
            });
            elapsedRef.current += 1;
            progress.value = withTiming(elapsedRef.current / totalDuration, { duration: 1000 });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentStepIndex, isPaused, completed]);

    const handleNextStep = () => {
        if (currentStepIndex < steps.length - 1) {
            const nextIndex = currentStepIndex + 1;
            setCurrentStepIndex(nextIndex);
            setTimeLeft(steps[nextIndex].duration);
            if (timerRef.current) clearInterval(timerRef.current);
        } else {
            setCompleted(true);
            onComplete();
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progressStyle = useAnimatedStyle(() => ({
        width: `${progress.value * 100}%`,
    }));

    if (completed) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 60, marginBottom: Spacing.xl }}>✨</Text>
                <Text style={[styles.title, { color: theme.text }]}>Session Complete</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    You've taken a moment for yourself today.
                </Text>
                <Button
                    title="Done"
                    onPress={onExit}
                    style={{ marginTop: Spacing.xl, width: 200, backgroundColor: accentColor }}
                />
            </View>
        );
    }

    const currentStep = steps[currentStepIndex];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onExit}>
                    <Text style={{ fontSize: FontSizes.md, color: theme.textSecondary }}>Close</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>{title}</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Progress Bar */}
            <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
                <Animated.View
                    style={[styles.progressBar, { backgroundColor: accentColor }, progressStyle]}
                />
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Animated.View
                    key={currentStepIndex}
                    entering={FadeIn.duration(1000)}
                    exiting={FadeOut.duration(500)}
                    style={styles.stepContainer}
                >
                    <Text style={[styles.instruction, { color: theme.text }]}>
                        {currentStep.text}
                    </Text>
                </Animated.View>

                <Text style={[styles.timer, { color: theme.textTertiary }]}>
                    {formatTime(timeLeft)}
                </Text>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
                <TouchableOpacity
                    style={[styles.controlButton, { backgroundColor: theme.border }]}
                    onPress={() => setIsPaused(!isPaused)}
                >
                    <Text style={{ fontSize: 24, color: theme.text }}>
                        {isPaused ? '▶️' : '⏸️'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    headerTitle: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
    },
    progressTrack: {
        height: 4,
        borderRadius: Radius.full,
        overflow: 'hidden',
        marginBottom: Spacing.xl * 2,
    },
    progressBar: {
        height: '100%',
        borderRadius: Radius.full,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    instruction: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.medium,
        textAlign: 'center',
        lineHeight: 32,
    },
    subtitle: {
        fontSize: FontSizes.md,
        textAlign: 'center',
        marginTop: Spacing.sm,
    },
    title: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        textAlign: 'center',
    },
    timer: {
        fontSize: FontSizes.lg,
        fontVariant: ['tabular-nums'],
        marginTop: Spacing.xl,
    },
    controls: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    controlButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
