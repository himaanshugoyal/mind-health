import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GuidedMeditation, MeditationStep } from '@/components/practice/GuidedMeditation';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type MeditationType = 'emotional-release' | 'sleep' | 'calm-focus' | 'body-scan' | 'spiritual';

const MEDITATIONS: Record<MeditationType, { title: string; steps: MeditationStep[]; color: string }> = {
    'emotional-release': {
        title: 'Emotional Release',
        color: 'emotion',
        steps: [
            { text: 'Find a comfortable position and close your eyes.', duration: 5 },
            { text: 'Take a deep breath in... and let it go with a sigh.', duration: 8 },
            { text: 'Visualize the emotion you are holding as a color in your chest.', duration: 10 },
            { text: 'Watch it soften and flow down your arms and legs.', duration: 15 },
            { text: 'With each exhale, release a little more tension.', duration: 15 },
            { text: 'You are safe. You are lighter.', duration: 10 },
        ],
    },
    'sleep': {
        title: 'Sleep Preparation',
        color: 'spirit',
        steps: [
            { text: 'Lie down comfortably and close your eyes.', duration: 5 },
            { text: 'Relax your jaw. Relax your shoulders.', duration: 8 },
            { text: 'Let your breath become slow and gentle.', duration: 10 },
            { text: 'Imagine a warm, soft light wrapping around you.', duration: 15 },
            { text: 'Drift deeper into relaxation...', duration: 20 },
            { text: 'Sleep is coming smoothly to you.', duration: 10 },
        ],
    },
    'calm-focus': {
        title: 'Calm & Focus',
        color: 'primary',
        steps: [
            { text: 'Sit upright with a straight spine.', duration: 5 },
            { text: 'Focus all your attention on your breath.', duration: 10 },
            { text: 'If your mind wanders, gently bring it back.', duration: 15 },
            { text: 'Clear mind. Steady heart.', duration: 10 },
            { text: 'You are present and capable.', duration: 10 },
        ],
    },
    'body-scan': {
        title: 'Body Scan',
        color: 'sky',
        steps: [
            { text: 'Bring attention to your toes. Wiggle them.', duration: 8 },
            { text: 'Notice your legs. Are they heavy?', duration: 10 },
            { text: 'Feel your belly rise and fall with breath.', duration: 10 },
            { text: 'Soften your hands. Let go of any gripping.', duration: 10 },
            { text: 'Relax your face. Smooth your forehead.', duration: 10 },
            { text: 'Your whole body is at rest.', duration: 10 },
        ],
    },
    'spiritual': {
        title: 'Spiritual Connection',
        color: 'spirit',
        steps: [
            { text: 'Connect to the silence within you.', duration: 10 },
            { text: 'Feel the energy that connects you to everything.', duration: 15 },
            { text: 'You are a part of a vast, beautiful universe.', duration: 15 },
            { text: 'Gratitude fills your heart.', duration: 10 },
            { text: 'Namaste.', duration: 5 },
        ],
    },
};

export default function MeditationScreen() {
    const { theme } = useAppTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams<{ type: string }>();

    const type = (params.type || 'calm-focus') as MeditationType;
    const session = MEDITATIONS[type];

    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <GuidedMeditation
                title={session.title}
                steps={session.steps}
                colorKey={session.color}
                onComplete={() => { }}
                onExit={() => router.back()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
