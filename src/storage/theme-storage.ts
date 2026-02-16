/**
 * Theme Storage — persist the user's selected mood theme using AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MoodThemeId } from '@/constants/themes';

const STORAGE_KEY = '@mind_health_mood_theme';

/**
 * Save the selected mood theme ID to local storage.
 */
export async function saveMoodTheme(themeId: MoodThemeId): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, themeId);
    } catch (error) {
        console.warn('[ThemeStorage] Failed to save mood theme:', error);
    }
}

/**
 * Load the saved mood theme ID from local storage.
 * Returns null if no theme has been saved yet.
 */
export async function loadMoodTheme(): Promise<MoodThemeId | null> {
    try {
        const value = await AsyncStorage.getItem(STORAGE_KEY);
        return value as MoodThemeId | null;
    } catch (error) {
        console.warn('[ThemeStorage] Failed to load mood theme:', error);
        return null;
    }
}
