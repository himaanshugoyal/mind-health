/**
 * Mind Health — Design System
 * A warm, calming palette with cream backgrounds, muted earth tones, and soft accents.
 */

import { Platform } from 'react-native';

// ─── Color Palette ───────────────────────────────────────────────────────────

export const Palette = {
  // Primary — Muted Olive Sage
  sage50: '#f4f5ef',
  sage100: '#e3e6d8',
  sage200: '#cdd2b8',
  sage300: '#adb496',
  sage400: '#8B9A7B',
  sage500: '#6f7f62',
  sage600: '#57654c',
  sage700: '#444f3c',
  sage800: '#374032',
  sage900: '#2d342a',

  // Accent — Warm Taupe Amber
  amber50: '#fdf8f0',
  amber100: '#f9eed9',
  amber200: '#f2ddb5',
  amber300: '#e8c688',
  amber400: '#d4a96a',
  amber500: '#c49352',
  amber600: '#a87540',
  amber700: '#8c5a35',
  amber800: '#73482d',
  amber900: '#5f3c27',

  // Spirit — Soft Lavender
  twilight50: '#f6f3f9',
  twilight100: '#ede5f3',
  twilight200: '#dccde8',
  twilight300: '#C5B9D4',
  twilight400: '#a893bd',
  twilight500: '#8f73a6',
  twilight600: '#7B6BA5',
  twilight700: '#5f4d80',
  twilight800: '#4e3f69',
  twilight900: '#403457',

  // Emotion — Warm Blush Rose
  rose50: '#fdf4f3',
  rose100: '#fbe5e3',
  rose200: '#f7ccc8',
  rose300: '#eeaba5',
  rose400: '#e08a82',
  rose500: '#cc6b62',
  rose600: '#b85348',
  rose700: '#9a433b',
  rose800: '#803b34',
  rose900: '#6b3530',

  // Sky — Soft Teal
  sky50: '#f1f7f7',
  sky100: '#ddeeed',
  sky200: '#bededd',
  sky300: '#93c8c8',
  sky400: '#6aadad',
  sky500: '#5B8F8F',
  sky600: '#467272',
  sky700: '#3b5e5e',
  sky800: '#334e4e',
  sky900: '#2c4242',

  // Neutrals — Warm tones (no cool gray)
  white: '#ffffff',
  gray50: '#faf9f7',
  gray100: '#f7f5f0',     // Main warm cream background
  gray200: '#edeae3',
  gray300: '#ddd9d0',
  gray400: '#c4bfb4',
  gray500: '#a8a194',
  gray600: '#8a8273',
  gray700: '#5e574c',
  gray800: '#3d3832',
  gray900: '#2a2520',
  black: '#000000',
};

// ─── Theme Colors ────────────────────────────────────────────────────────────

export const Colors = {
  light: {
    // Core
    text: Palette.gray900,
    textSecondary: Palette.gray600,
    textTertiary: Palette.gray500,
    background: Palette.gray100,            // Warm cream
    backgroundSecondary: Palette.white,
    card: Palette.white,
    border: Palette.gray200,

    // Brand
    tint: Palette.sage500,
    primary: Palette.sage500,
    primaryLight: Palette.sage50,
    accent: Palette.amber500,
    accentLight: Palette.amber50,
    spirit: Palette.twilight600,
    spiritLight: Palette.twilight50,
    emotion: Palette.rose500,
    emotionLight: Palette.rose50,
    sky: Palette.sky500,
    skyLight: Palette.sky50,

    // Functional
    success: '#5a9a5a',
    warning: Palette.amber500,
    danger: Palette.rose500,
    info: Palette.sky500,

    // Tab bar
    icon: Palette.gray500,
    tabIconDefault: Palette.gray400,
    tabIconSelected: Palette.sage500,
    tabBarBackground: Palette.white,
    tabBarBorder: Palette.gray200,

    // Cards
    cardShadow: 'rgba(42, 37, 32, 0.06)',
    overlay: 'rgba(42, 37, 32, 0.3)',

    // Gradients
    gradientStart: Palette.sage50,
    gradientEnd: Palette.twilight50,
    headerGradientStart: Palette.sage500,
    headerGradientEnd: Palette.twilight600,
  },
  dark: {
    // Core
    text: '#e8e5df',
    textSecondary: '#9e978b',
    textTertiary: '#6b645a',
    background: '#161310',
    backgroundSecondary: '#1e1b17',
    card: '#242019',
    border: '#332e27',

    // Brand
    tint: Palette.sage400,
    primary: Palette.sage400,
    primaryLight: '#242e1e',
    accent: Palette.amber400,
    accentLight: '#332a1a',
    spirit: Palette.twilight400,
    spiritLight: '#2a2035',
    emotion: Palette.rose400,
    emotionLight: '#352020',
    sky: Palette.sky400,
    skyLight: '#1a2e2e',

    // Functional
    success: '#6bb86b',
    warning: Palette.amber400,
    danger: Palette.rose400,
    info: Palette.sky400,

    // Tab bar
    icon: '#6b645a',
    tabIconDefault: '#534d44',
    tabIconSelected: Palette.sage400,
    tabBarBackground: '#1a1712',
    tabBarBorder: '#332e27',

    // Cards
    cardShadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.6)',

    // Gradients
    gradientStart: '#1e261a',
    gradientEnd: '#221e2e',
    headerGradientStart: Palette.sage700,
    headerGradientEnd: Palette.twilight700,
  },
};

// ─── Typography ──────────────────────────────────────────────────────────────

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "'Nunito', 'Segoe UI', system-ui, -apple-system, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'Nunito', 'SF Pro Rounded', sans-serif",
    mono: "'Fira Code', monospace",
  },
});

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  '2xl': 28,
  '3xl': 34,
  display: 42,
};

export const FontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

// ─── Spacing ─────────────────────────────────────────────────────────────────

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
};

// ─── Radius ──────────────────────────────────────────────────────────────────

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

// ─── Shadows ─────────────────────────────────────────────────────────────────

export const Shadows = {
  sm: {
    shadowColor: '#2a2520',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#2a2520',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#2a2520',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
  },
};
