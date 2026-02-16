import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - Spacing.xl * 2;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

export type AffirmationCategory = 'self-love' | 'patience' | 'letting-go' | 'confidence' | 'gratitude' | 'growth';

interface Props {
    category: AffirmationCategory;
}

const AFFIRMATIONS: Record<AffirmationCategory, string[]> = {
    'self-love': [
        "I am enough exactly as I am.",
        "I deserve my own love and affection.",
        "My worth is not defined by my productivity.",
        "I honor my body and my mind.",
        "I am worthy of good things.",
    ],
    'patience': [
        "I trust the timing of my life.",
        "I release the need to rush.",
        "Peace is available to me in this moment.",
        "Slow progress is still progress.",
        "I am exactly where I need to be.",
    ],
    'letting-go': [
        "I release what I cannot control.",
        "I forgive myself for past mistakes.",
        "I make space for new beginnings.",
        "I am free from the weight of the past.",
        "I surrender to the flow of life.",
    ],
    'confidence': [
        "I believe in my ability to figure things out.",
        "I speak my truth with clarity and grace.",
        "I am capable of achieving my goals.",
        "My voice matters.",
        "I stand tall in my power.",
    ],
    'gratitude': [
        "I am grateful for this breath.",
        "I find joy in the simple moments.",
        "My life is full of abundance.",
        "I appreciate the lessons in every challenge.",
        "Thank you for this day.",
    ],
    'growth': [
        "I am evolving every single day.",
        "Challenges are opportunities to grow.",
        "I embrace the unknown with curiosity.",
        "My potential is limitless.",
        "I learning to love the journey.",
    ],
};

const GRADIENTS: Record<AffirmationCategory, [string, string]> = {
    'self-love': ['#FF9A9E', '#FECFEF'],
    'patience': ['#a18cd1', '#fbc2eb'],
    'letting-go': ['#84fab0', '#8fd3f4'],
    'confidence': ['#fccb90', '#d57eeb'],
    'gratitude': ['#e0c3fc', '#8ec5fc'],
    'growth': ['#43e97b', '#38f9d7'],
};

export function AffirmationDeck({ category }: Props) {
    const { theme } = useAppTheme();
    const affirmations = AFFIRMATIONS[category];
    const gradient = GRADIENTS[category];

    const handleShare = async (text: string) => {
        try {
            await Share.share({
                message: `${text} — Mind Health Affirmation`,
            });
        } catch (error) {
            // ignore
        }
    };

    return (
        <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            decelerationRate="fast"
            snapToInterval={width}
        >
            {affirmations.map((text, index) => (
                <View key={index} style={styles.cardContainer}>
                    <LinearGradient
                        colors={gradient}
                        style={styles.card}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.text}>"{text}"</Text>

                        <TouchableOpacity
                            style={styles.shareButton}
                            onPress={() => handleShare(text)}
                        >
                            <Text style={styles.shareIcon}>📤</Text>
                            <Text style={styles.shareText}>Share</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <Text style={[styles.counter, { color: theme.textTertiary }]}>
                        {index + 1} / {affirmations.length}
                    </Text>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingVertical: Spacing.xl,
    },
    cardContainer: {
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: Radius.xl,
        padding: Spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    text: {
        fontSize: FontSizes['3xl'],
        fontWeight: FontWeights.bold,
        color: '#fff', // Always white on gradients
        textAlign: 'center',
        lineHeight: 40,
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },
    shareButton: {
        position: 'absolute',
        bottom: Spacing.xl,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.md,
        borderRadius: Radius.full,
    },
    shareIcon: {
        fontSize: 16,
        marginRight: Spacing.xs,
        color: '#fff',
    },
    shareText: {
        color: '#fff',
        fontWeight: FontWeights.medium,
        fontSize: FontSizes.sm,
    },
    counter: {
        marginTop: Spacing.lg,
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.medium,
    },
});
