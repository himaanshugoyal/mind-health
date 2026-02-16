/**
 * Mind Health — Mood-Based Theme Presets
 * Six distinct color themes, each evoking a different mood.
 * Each preset provides full light + dark color overrides.
 */

import { Colors } from './theme';

// ─── Theme Metadata ──────────────────────────────────────────────────────────

export type MoodThemeId = 'calm' | 'peaceful' | 'soulful' | 'nature' | 'energetic' | 'serene';

export interface MoodThemeMeta {
    id: MoodThemeId;
    name: string;
    emoji: string;
    description: string;
    swatches: string[];  // 4 preview colors
}

export const MOOD_THEMES: MoodThemeMeta[] = [
    {
        id: 'calm',
        name: 'Calm',
        emoji: '🕯️',
        description: 'Warm cream & soft earth tones',
        swatches: ['#f7f5f0', '#8B9A7B', '#C5B9D4', '#c49352'],
    },
    {
        id: 'peaceful',
        name: 'Peaceful',
        emoji: '🌊',
        description: 'Serene ocean blue & teal',
        swatches: ['#f2f7f9', '#5B8F8F', '#B8D8E0', '#7BADC4'],
    },
    {
        id: 'soulful',
        name: 'Soulful',
        emoji: '🌙',
        description: 'Deep twilight & rose gold',
        swatches: ['#f5f0f5', '#7B6BA5', '#D4A99A', '#9E8CC0'],
    },
    {
        id: 'nature',
        name: 'Nature',
        emoji: '🌿',
        description: 'Forest green & earthy amber',
        swatches: ['#f2f5ef', '#5A7B5A', '#C9A96E', '#7DA37D'],
    },
    {
        id: 'energetic',
        name: 'Energetic',
        emoji: '🌅',
        description: 'Warm sunrise coral & gold',
        swatches: ['#fdf5f0', '#D4836B', '#E0C17B', '#E8A88F'],
    },
    {
        id: 'serene',
        name: 'Serene',
        emoji: '🪨',
        description: 'Minimalist monochrome zen',
        swatches: ['#f8f8f8', '#6B6B6B', '#B8B8B8', '#9A9A9A'],
    },
];

// ─── Type for theme colors ───────────────────────────────────────────────────

export type ThemeColors = typeof Colors.light;

// ─── Theme Overrides ─────────────────────────────────────────────────────────

const themeOverrides: Record<MoodThemeId, { light: Partial<ThemeColors>; dark: Partial<ThemeColors> }> = {
    // Calm — uses the default Colors from theme.ts (warm cream/beige)
    calm: {
        light: {},
        dark: {},
    },

    // Peaceful — serene ocean blue & teal
    peaceful: {
        light: {
            background: '#f2f7f9',
            backgroundSecondary: '#fafcfd',
            card: '#ffffff',
            border: '#e0eaed',
            tint: '#5B8F8F',
            primary: '#5B8F8F',
            primaryLight: '#e5f2f2',
            accent: '#7BADC4',
            accentLight: '#eaf4f8',
            spirit: '#6888A5',
            spiritLight: '#edf2f7',
            tabIconSelected: '#5B8F8F',
            tabBarBorder: '#e0eaed',
            gradientStart: '#e5f2f2',
            gradientEnd: '#edf2f7',
            headerGradientStart: '#5B8F8F',
            headerGradientEnd: '#6888A5',
            success: '#4a9a7a',
        },
        dark: {
            background: '#0f1516',
            backgroundSecondary: '#151d1e',
            card: '#1a2425',
            border: '#253233',
            tint: '#6aadad',
            primary: '#6aadad',
            primaryLight: '#1a2e2e',
            accent: '#8bbcd0',
            accentLight: '#1a2a33',
            spirit: '#7a9ab8',
            spiritLight: '#1a2230',
            tabIconSelected: '#6aadad',
            tabBarBackground: '#121a1b',
            tabBarBorder: '#253233',
            gradientStart: '#142222',
            gradientEnd: '#1a2030',
            headerGradientStart: '#3b5e5e',
            headerGradientEnd: '#4a6880',
        },
    },

    // Soulful — deep twilight purple & rose gold
    soulful: {
        light: {
            background: '#f5f0f5',
            backgroundSecondary: '#fcf9fc',
            card: '#ffffff',
            border: '#e8dfe8',
            tint: '#7B6BA5',
            primary: '#7B6BA5',
            primaryLight: '#f0e8f5',
            accent: '#D4A99A',
            accentLight: '#f9f0ed',
            spirit: '#9E8CC0',
            spiritLight: '#f0e8f8',
            tabIconSelected: '#7B6BA5',
            tabBarBorder: '#e8dfe8',
            gradientStart: '#f0e8f5',
            gradientEnd: '#f9f0ed',
            headerGradientStart: '#7B6BA5',
            headerGradientEnd: '#9E8CC0',
            success: '#6a9a6a',
        },
        dark: {
            background: '#141018',
            backgroundSecondary: '#1a151f',
            card: '#201a28',
            border: '#302840',
            tint: '#a893bd',
            primary: '#a893bd',
            primaryLight: '#281e38',
            accent: '#d4a99a',
            accentLight: '#302220',
            spirit: '#b8a0d4',
            spiritLight: '#281e3a',
            tabIconSelected: '#a893bd',
            tabBarBackground: '#161018',
            tabBarBorder: '#302840',
            gradientStart: '#201830',
            gradientEnd: '#2a1e22',
            headerGradientStart: '#5f4d80',
            headerGradientEnd: '#7a68a0',
        },
    },

    // Nature — forest green & earthy amber
    nature: {
        light: {
            background: '#f2f5ef',
            backgroundSecondary: '#f9faf7',
            card: '#ffffff',
            border: '#dfe5d8',
            tint: '#5A7B5A',
            primary: '#5A7B5A',
            primaryLight: '#e5ede5',
            accent: '#C9A96E',
            accentLight: '#f5efe2',
            spirit: '#7DA37D',
            spiritLight: '#e8f2e8',
            tabIconSelected: '#5A7B5A',
            tabBarBorder: '#dfe5d8',
            gradientStart: '#e5ede5',
            gradientEnd: '#f5efe2',
            headerGradientStart: '#5A7B5A',
            headerGradientEnd: '#7DA37D',
            success: '#4a8a4a',
        },
        dark: {
            background: '#101410',
            backgroundSecondary: '#161a16',
            card: '#1a201a',
            border: '#2a342a',
            tint: '#7DA37D',
            primary: '#7DA37D',
            primaryLight: '#1e2e1e',
            accent: '#C9A96E',
            accentLight: '#2a241a',
            spirit: '#8ab88a',
            spiritLight: '#1e2a1e',
            tabIconSelected: '#7DA37D',
            tabBarBackground: '#121612',
            tabBarBorder: '#2a342a',
            gradientStart: '#162016',
            gradientEnd: '#221e14',
            headerGradientStart: '#3c5a3c',
            headerGradientEnd: '#5a805a',
        },
    },

    // Energetic — warm sunrise coral & gold
    energetic: {
        light: {
            background: '#fdf5f0',
            backgroundSecondary: '#fffaf7',
            card: '#ffffff',
            border: '#f0e2d8',
            tint: '#D4836B',
            primary: '#D4836B',
            primaryLight: '#fdeee8',
            accent: '#E0C17B',
            accentLight: '#faf4e5',
            spirit: '#E8A88F',
            spiritLight: '#fdf0ea',
            tabIconSelected: '#D4836B',
            tabBarBorder: '#f0e2d8',
            gradientStart: '#fdeee8',
            gradientEnd: '#faf4e5',
            headerGradientStart: '#D4836B',
            headerGradientEnd: '#E8A88F',
            success: '#7aaa5a',
        },
        dark: {
            background: '#181210',
            backgroundSecondary: '#1e1815',
            card: '#281e18',
            border: '#382a22',
            tint: '#e8a88f',
            primary: '#e8a88f',
            primaryLight: '#382218',
            accent: '#e0c17b',
            accentLight: '#302818',
            spirit: '#f0b8a0',
            spiritLight: '#301e18',
            tabIconSelected: '#e8a88f',
            tabBarBackground: '#1a1410',
            tabBarBorder: '#382a22',
            gradientStart: '#2a1a14',
            gradientEnd: '#28221a',
            headerGradientStart: '#a05840',
            headerGradientEnd: '#c48068',
        },
    },

    // Serene — minimalist monochrome zen
    serene: {
        light: {
            background: '#f8f8f8',
            backgroundSecondary: '#fdfdfd',
            card: '#ffffff',
            border: '#e8e8e8',
            tint: '#6B6B6B',
            primary: '#6B6B6B',
            primaryLight: '#f0f0f0',
            accent: '#9A9A9A',
            accentLight: '#f2f2f2',
            spirit: '#808080',
            spiritLight: '#f0f0f0',
            emotion: '#a08080',
            emotionLight: '#f5f0f0',
            sky: '#7090a0',
            skyLight: '#f0f4f6',
            tabIconSelected: '#6B6B6B',
            tabBarBorder: '#e8e8e8',
            gradientStart: '#f0f0f0',
            gradientEnd: '#f2f2f2',
            headerGradientStart: '#6B6B6B',
            headerGradientEnd: '#808080',
            success: '#6a8a6a',
        },
        dark: {
            background: '#121212',
            backgroundSecondary: '#181818',
            card: '#1e1e1e',
            border: '#2e2e2e',
            tint: '#9A9A9A',
            primary: '#9A9A9A',
            primaryLight: '#252525',
            accent: '#B8B8B8',
            accentLight: '#222222',
            spirit: '#aaaaaa',
            spiritLight: '#242424',
            emotion: '#b8a0a0',
            emotionLight: '#282020',
            sky: '#8ab0c0',
            skyLight: '#1a2228',
            tabIconSelected: '#9A9A9A',
            tabBarBackground: '#141414',
            tabBarBorder: '#2e2e2e',
            gradientStart: '#1a1a1a',
            gradientEnd: '#1c1c1c',
            headerGradientStart: '#4a4a4a',
            headerGradientEnd: '#606060',
        },
    },
};

// ─── Resolve Theme Colors ────────────────────────────────────────────────────

/**
 * Get the full color set for a given mood theme and color scheme (light/dark).
 * Merges the base Colors with theme-specific overrides.
 */
export function getMoodThemeColors(
    moodTheme: MoodThemeId,
    colorScheme: 'light' | 'dark'
): ThemeColors {
    const base = Colors[colorScheme];
    const overrides = themeOverrides[moodTheme]?.[colorScheme] ?? {};
    return { ...base, ...overrides } as ThemeColors;
}
