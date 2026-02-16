/**
 * AsyncStorage-based journal entry persistence.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    JournalEntry,
    JournalType,
    ThoughtEntry,
    GratitudeEntry,
    SpiritualEntry,
    VulnerabilityEntry,
} from '@/src/types/journal';

const STORAGE_KEY = '@mind_health_journal_entries';

function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

// ─── Core CRUD ───────────────────────────────────────────────────────────────

export async function getAllEntries(): Promise<JournalEntry[]> {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const entries: JournalEntry[] = JSON.parse(raw);
        return entries.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    } catch (e) {
        console.error('Failed to load journal entries:', e);
        return [];
    }
}

export async function getEntriesByType(type: JournalType): Promise<JournalEntry[]> {
    const all = await getAllEntries();
    return all.filter((e) => e.type === type);
}

export async function getEntry(id: string): Promise<JournalEntry | null> {
    const all = await getAllEntries();
    return all.find((e) => e.id === id) ?? null;
}

export async function saveEntry(
    entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<JournalEntry> {
    const all = await getAllEntries();
    const now = new Date().toISOString();
    const newEntry = {
        ...entry,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
    } as JournalEntry;

    all.unshift(newEntry);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return newEntry;
}

export async function updateEntry(
    id: string,
    updates: Partial<JournalEntry>
): Promise<JournalEntry | null> {
    const all = await getAllEntries();
    const index = all.findIndex((e) => e.id === id);
    if (index === -1) return null;

    all[index] = {
        ...all[index],
        ...updates,
        updatedAt: new Date().toISOString(),
    } as JournalEntry;

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return all[index];
}

export async function deleteEntry(id: string): Promise<boolean> {
    const all = await getAllEntries();
    const filtered = all.filter((e) => e.id !== id);
    if (filtered.length === all.length) return false;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export interface JournalStats {
    totalEntries: number;
    byType: Record<JournalType, number>;
    currentStreak: number;
    longestStreak: number;
}

export async function getJournalStats(): Promise<JournalStats> {
    const all = await getAllEntries();

    const byType: Record<JournalType, number> = {
        thought: 0,
        gratitude: 0,
        spiritual: 0,
        vulnerability: 0,
        'self-compassion': 0,
        'opening-up': 0,
        'patience': 0,
        'letting-go': 0,
        'express': 0,
        'reflect': 0,
    };

    all.forEach((e) => byType[e.type]++);

    // Calculate streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let longestStreak = 0;
    let currentStreak = 0;
    let checkDate = new Date(today);

    // Get unique entry dates
    const entryDates = [...new Set(
        all.map((e) => {
            const d = new Date(e.createdAt);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        })
    )].sort((a, b) => b - a);

    for (const dateTime of entryDates) {
        if (dateTime === checkDate.getTime()) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else if (dateTime < checkDate.getTime()) {
            break;
        }
    }

    // Simple longest streak calculation
    let tempStreak = 0;
    let prevDate: number | null = null;
    for (const dateTime of [...entryDates].sort((a, b) => a - b)) {
        if (prevDate === null || dateTime - prevDate === 86400000) {
            tempStreak++;
        } else {
            tempStreak = 1;
        }
        longestStreak = Math.max(longestStreak, tempStreak);
        prevDate = dateTime;
    }

    return {
        totalEntries: all.length,
        byType,
        currentStreak,
        longestStreak,
    };
}

// ─── Overthinking Detection ──────────────────────────────────────────────────

export async function checkOverthinking(): Promise<{
    isOverthinking: boolean;
    repeatedTag?: string;
    count?: number;
}> {
    const thoughts = (await getEntriesByType('thought')) as ThoughtEntry[];
    const recent = thoughts.slice(0, 5); // Last 5 entries

    if (recent.length < 3) return { isOverthinking: false };

    // Count tag frequency in recent entries
    const tagCount: Record<string, number> = {};
    recent.forEach((entry) => {
        entry.tags.forEach((tag) => {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
    });

    // If any negative tag appears 3+ times, flag overthinking
    const negTags = ['anxious', 'overwhelmed', 'frustrated', 'fearful', 'sad'];
    for (const tag of negTags) {
        if (tagCount[tag] && tagCount[tag] >= 3) {
            return { isOverthinking: true, repeatedTag: tag, count: tagCount[tag] };
        }
    }

    return { isOverthinking: false };
}
