import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

const GROUNDING_STEPS = [
    { count: 5, sense: 'things you can SEE', emoji: '👀' },
    { count: 4, sense: 'things you can TOUCH', emoji: '✋' },
    { count: 3, sense: 'things you can HEAR', emoji: '👂' },
    { count: 2, sense: 'things you can SMELL', emoji: '👃' },
    { count: 1, sense: 'thing you can TASTE', emoji: '👅' },
];

const COMFORTING_MESSAGES = [
    'This feeling is temporary. You are safe.',
    'You have survived every difficult moment so far.',
    'Breathe. You are exactly where you need to be.',
    'It\'s okay to not be okay right now.',
    'You are stronger than you know.',
];

type SOSMode = 'menu' | 'breathing' | 'grounding' | 'affirmation';

export default function SOSScreen() {
    const { theme } = useAppTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [mode, setMode] = useState<SOSMode>('menu');
    const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
    const [breathCount, setBreathCount] = useState(0);
    const [groundingStep, setGroundingStep] = useState(0);
    const breathAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        if (mode !== 'breathing') return;
        const phases: Array<{ phase: typeof breathPhase; duration: number }> = [
            { phase: 'inhale', duration: 4000 },
            { phase: 'hold', duration: 4000 },
            { phase: 'exhale', duration: 4000 },
            { phase: 'rest', duration: 4000 },
        ];
        let currentPhaseIndex = 0;
        let mounted = true;

        const runPhase = () => {
            if (!mounted) return;
            const { phase, duration } = phases[currentPhaseIndex];
            setBreathPhase(phase);

            if (phase === 'inhale') {
                Animated.timing(breathAnim, {
                    toValue: 1,
                    duration,
                    useNativeDriver: true,
                }).start();
            } else if (phase === 'exhale') {
                Animated.timing(breathAnim, {
                    toValue: 0.4,
                    duration,
                    useNativeDriver: true,
                }).start();
            }

            setTimeout(() => {
                currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
                if (currentPhaseIndex === 0) {
                    setBreathCount((c) => c + 1);
                }
                runPhase();
            }, duration);
        };

        runPhase();
        return () => { mounted = false; };
    }, [mode]);

    const phaseLabels = {
        inhale: 'Breathe In...',
        hold: 'Hold...',
        exhale: 'Breathe Out...',
        rest: 'Rest...',
    };

    const randomMessage = COMFORTING_MESSAGES[
        Math.floor(Math.random() * COMFORTING_MESSAGES.length)
    ];

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: theme.spiritLight,
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                },
            ]}
        >
            {/* Close Button */}
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => router.back()}
            >
                <Text style={[styles.closeText, { color: theme.text }]}>✕</Text>
            </TouchableOpacity>

            {mode === 'menu' && (
                <View style={styles.menuContainer}>
                    <Text style={[styles.sosTitle, { color: theme.text }]}>
                        You're safe here 💜
                    </Text>
                    <Text style={[styles.sosSubtitle, { color: theme.textSecondary }]}>
                        {randomMessage}
                    </Text>

                    <View style={styles.menuOptions}>
                        <TouchableOpacity
                            style={[styles.menuCard, { backgroundColor: theme.spiritLight }]}
                            onPress={() => setMode('breathing')}
                        >
                            <Text style={styles.menuEmoji}>🌬️</Text>
                            <Text style={[styles.menuLabel, { color: theme.text }]}>
                                Box Breathing
                            </Text>
                            <Text style={[styles.menuDesc, { color: theme.textSecondary }]}>
                                4-4-4-4 calm technique
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.menuCard, { backgroundColor: theme.primaryLight }]}
                            onPress={() => setMode('grounding')}
                        >
                            <Text style={styles.menuEmoji}>🌍</Text>
                            <Text style={[styles.menuLabel, { color: theme.text }]}>
                                5-4-3-2-1 Grounding
                            </Text>
                            <Text style={[styles.menuDesc, { color: theme.textSecondary }]}>
                                Connect with your senses
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.menuCard, { backgroundColor: theme.accentLight }]}
                            onPress={() => setMode('affirmation')}
                        >
                            <Text style={styles.menuEmoji}>💛</Text>
                            <Text style={[styles.menuLabel, { color: theme.text }]}>
                                Comfort & Affirm
                            </Text>
                            <Text style={[styles.menuDesc, { color: theme.textSecondary }]}>
                                Words of strength
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {mode === 'breathing' && (
                <View style={styles.breathContainer}>
                    <Text style={[styles.breathLabel, { color: theme.textSecondary }]}>
                        Box Breathing • Cycle {breathCount + 1}
                    </Text>
                    <Animated.View
                        style={[
                            styles.breathCircle,
                            {
                                backgroundColor: theme.spirit + '30',
                                borderColor: theme.spirit,
                                transform: [{ scale: breathAnim }],
                            },
                        ]}
                    >
                        <Text style={[styles.breathPhaseText, { color: theme.spirit }]}>
                            {phaseLabels[breathPhase]}
                        </Text>
                    </Animated.View>
                    <Text style={[styles.breathTip, { color: theme.textSecondary }]}>
                        Focus on the circle. Let everything else fade away.
                    </Text>
                    <TouchableOpacity
                        style={[styles.backButton, { borderColor: theme.border }]}
                        onPress={() => { setMode('menu'); setBreathCount(0); }}
                    >
                        <Text style={[styles.backText, { color: theme.textSecondary }]}>
                            ← Back to menu
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {mode === 'grounding' && (
                <View style={styles.groundingContainer}>
                    <Text style={[styles.groundingLabel, { color: theme.textSecondary }]}>
                        5-4-3-2-1 Grounding
                    </Text>
                    <View style={[styles.groundingCard, { backgroundColor: theme.card }]}>
                        <Text style={styles.groundingEmoji}>
                            {GROUNDING_STEPS[groundingStep].emoji}
                        </Text>
                        <Text style={[styles.groundingCount, { color: theme.primary }]}>
                            Name {GROUNDING_STEPS[groundingStep].count}
                        </Text>
                        <Text style={[styles.groundingSense, { color: theme.text }]}>
                            {GROUNDING_STEPS[groundingStep].sense}
                        </Text>
                    </View>
                    <View style={styles.groundingDots}>
                        {GROUNDING_STEPS.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.dot,
                                    {
                                        backgroundColor:
                                            i <= groundingStep ? theme.primary : theme.border,
                                    },
                                ]}
                            />
                        ))}
                    </View>
                    <TouchableOpacity
                        style={[styles.nextButton, { backgroundColor: theme.primary }]}
                        onPress={() => {
                            if (groundingStep < GROUNDING_STEPS.length - 1) {
                                setGroundingStep(groundingStep + 1);
                            } else {
                                setGroundingStep(0);
                                setMode('menu');
                            }
                        }}
                    >
                        <Text style={styles.nextText}>
                            {groundingStep < GROUNDING_STEPS.length - 1 ? 'Next →' : 'Done ✓'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.backButton, { borderColor: theme.border }]}
                        onPress={() => { setMode('menu'); setGroundingStep(0); }}
                    >
                        <Text style={[styles.backText, { color: theme.textSecondary }]}>
                            ← Back to menu
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {mode === 'affirmation' && (
                <View style={styles.affirmContainer}>
                    <Text style={styles.affirmEmoji}>💜</Text>
                    <Text style={[styles.affirmText, { color: theme.text }]}>
                        {randomMessage}
                    </Text>
                    <Text style={[styles.affirmExtra, { color: theme.textSecondary }]}>
                        Take a deep breath. Place your hand on your heart. You are not
                        alone in this. This too shall pass.
                    </Text>
                    <TouchableOpacity
                        style={[styles.backButton, { borderColor: theme.border, marginTop: Spacing['2xl'] }]}
                        onPress={() => setMode('menu')}
                    >
                        <Text style={[styles.backText, { color: theme.textSecondary }]}>
                            ← Back to menu
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center' },
    closeButton: {
        position: 'absolute', top: 60, right: 24, zIndex: 10,
        width: 36, height: 36, borderRadius: 18,
        alignItems: 'center', justifyContent: 'center',
    },
    closeText: { fontSize: 20 },
    menuContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
    sosTitle: { fontSize: FontSizes['2xl'], fontWeight: FontWeights.bold, textAlign: 'center', marginBottom: Spacing.md },
    sosSubtitle: { fontSize: FontSizes.md, textAlign: 'center', lineHeight: 24, marginBottom: Spacing['3xl'] },
    menuOptions: { width: '100%', gap: Spacing.md },
    menuCard: { padding: Spacing.xl, borderRadius: Radius.lg, alignItems: 'center' },
    menuEmoji: { fontSize: 32, marginBottom: Spacing.sm },
    menuLabel: { fontSize: FontSizes.lg, fontWeight: FontWeights.semibold },
    menuDesc: { fontSize: FontSizes.sm, marginTop: Spacing.xs },
    breathContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
    breathLabel: { fontSize: FontSizes.md, marginBottom: Spacing['3xl'] },
    breathCircle: {
        width: width * 0.55, height: width * 0.55, borderRadius: width * 0.275,
        borderWidth: 3, alignItems: 'center', justifyContent: 'center',
    },
    breathPhaseText: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold },
    breathTip: { fontSize: FontSizes.sm, textAlign: 'center', marginTop: Spacing['3xl'], lineHeight: 22 },
    groundingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
    groundingLabel: { fontSize: FontSizes.md, marginBottom: Spacing.xl },
    groundingCard: { padding: Spacing['3xl'], borderRadius: Radius.xl, alignItems: 'center', width: '100%' },
    groundingEmoji: { fontSize: 48, marginBottom: Spacing.lg },
    groundingCount: { fontSize: FontSizes['3xl'], fontWeight: FontWeights.extrabold },
    groundingSense: { fontSize: FontSizes.lg, marginTop: Spacing.sm, textAlign: 'center' },
    groundingDots: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xl },
    dot: { width: 10, height: 10, borderRadius: 5 },
    nextButton: { marginTop: Spacing.xl, paddingVertical: Spacing.md, paddingHorizontal: Spacing['3xl'], borderRadius: Radius.md },
    nextText: { color: '#fff', fontSize: FontSizes.md, fontWeight: FontWeights.semibold },
    backButton: { marginTop: Spacing.lg, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: Radius.md, borderWidth: 1 },
    backText: { fontSize: FontSizes.sm },
    affirmContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing['2xl'] },
    affirmEmoji: { fontSize: 56, marginBottom: Spacing.xl },
    affirmText: { fontSize: FontSizes['2xl'], fontWeight: FontWeights.bold, textAlign: 'center', lineHeight: 38 },
    affirmExtra: { fontSize: FontSizes.md, textAlign: 'center', lineHeight: 24, marginTop: Spacing.xl },
});
