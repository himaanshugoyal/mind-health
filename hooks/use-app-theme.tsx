/**
 * useAppTheme — React Context that combines system color scheme with mood-based theme presets.
 *
 * Usage:
 *   // In root layout:
 *   <AppThemeProvider>
 *     <App />
 *   </AppThemeProvider>
 *
 *   // In any component:
 *   const { theme, moodTheme, setMoodTheme } = useAppTheme();
 */

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getMoodThemeColors, type MoodThemeId, type ThemeColors } from '@/constants/themes';
import { saveMoodTheme, loadMoodTheme } from '@/src/storage/theme-storage';

// ─── Context Shape ───────────────────────────────────────────────────────────

interface AppThemeContextValue {
    /** The resolved color object for the current mood theme + color scheme */
    theme: ThemeColors;
    /** The current color scheme (light/dark) */
    colorScheme: 'light' | 'dark';
    /** The current mood theme preset ID */
    moodTheme: MoodThemeId;
    /** Switch to a different mood theme (persists to storage) */
    setMoodTheme: (id: MoodThemeId) => void;
    /** Whether the theme has been loaded from storage yet */
    isThemeLoaded: boolean;
}

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useColorScheme();
    const colorScheme = systemColorScheme ?? 'light';

    const [moodTheme, setMoodThemeState] = useState<MoodThemeId>('calm');
    const [isThemeLoaded, setIsThemeLoaded] = useState(false);

    // Load saved theme on mount
    useEffect(() => {
        loadMoodTheme().then((saved) => {
            if (saved) {
                setMoodThemeState(saved);
            }
            setIsThemeLoaded(true);
        });
    }, []);

    // Persist + update
    const setMoodTheme = useCallback((id: MoodThemeId) => {
        setMoodThemeState(id);
        saveMoodTheme(id);
    }, []);

    // Resolve the color set
    const theme = useMemo(
        () => getMoodThemeColors(moodTheme, colorScheme),
        [moodTheme, colorScheme]
    );

    const value = useMemo<AppThemeContextValue>(
        () => ({ theme, colorScheme, moodTheme, setMoodTheme, isThemeLoaded }),
        [theme, colorScheme, moodTheme, setMoodTheme, isThemeLoaded]
    );

    return (
        <AppThemeContext.Provider value={value}>
            {children}
        </AppThemeContext.Provider>
    );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAppTheme(): AppThemeContextValue {
    const ctx = useContext(AppThemeContext);
    if (!ctx) {
        throw new Error('useAppTheme must be used within <AppThemeProvider>');
    }
    return ctx;
}
