/**
 * Journal types and interfaces for Mind Health.
 */

export type JournalType = 'thought' | 'gratitude' | 'spiritual' | 'vulnerability';

export type EmotionTag =
    | 'anxious'
    | 'hopeful'
    | 'confused'
    | 'grateful'
    | 'calm'
    | 'sad'
    | 'angry'
    | 'excited'
    | 'peaceful'
    | 'overwhelmed'
    | 'lonely'
    | 'inspired'
    | 'frustrated'
    | 'loved'
    | 'fearful';

export const EMOTION_TAGS: { tag: EmotionTag; emoji: string; color: string }[] = [
    { tag: 'anxious', emoji: '😰', color: '#f97316' },
    { tag: 'hopeful', emoji: '🌟', color: '#22c55e' },
    { tag: 'confused', emoji: '🤔', color: '#a78bfa' },
    { tag: 'grateful', emoji: '🙏', color: '#10b981' },
    { tag: 'calm', emoji: '😌', color: '#06b6d4' },
    { tag: 'sad', emoji: '😢', color: '#6366f1' },
    { tag: 'angry', emoji: '😤', color: '#ef4444' },
    { tag: 'excited', emoji: '🤩', color: '#f59e0b' },
    { tag: 'peaceful', emoji: '🕊️', color: '#14b8a6' },
    { tag: 'overwhelmed', emoji: '😵', color: '#e11d48' },
    { tag: 'lonely', emoji: '🥺', color: '#8b5cf6' },
    { tag: 'inspired', emoji: '✨', color: '#eab308' },
    { tag: 'frustrated', emoji: '😤', color: '#dc2626' },
    { tag: 'loved', emoji: '🥰', color: '#ec4899' },
    { tag: 'fearful', emoji: '😨', color: '#64748b' },
];

export interface JournalEntryBase {
    id: string;
    type: JournalType;
    createdAt: string; // ISO string
    updatedAt: string;
    tags: EmotionTag[];
    mood?: number; // 1–5
}

export interface ThoughtEntry extends JournalEntryBase {
    type: 'thought';
    content: string;
    aiReframe?: string;
    isOverthinking?: boolean;
}

export interface GratitudeEntry extends JournalEntryBase {
    type: 'gratitude';
    items: {
        text: string;
        reflection?: string; // "Why does this matter?"
    }[];
}

export interface SpiritualEntry extends JournalEntryBase {
    type: 'spiritual';
    content: string;
    prompt: string;
    moonPhase?: string;
}

export interface VulnerabilityEntry extends JournalEntryBase {
    type: 'vulnerability';
    content: string;
    prompt: string;
    isPrivate: true;
}

export type JournalEntry =
    | ThoughtEntry
    | GratitudeEntry
    | SpiritualEntry
    | VulnerabilityEntry;

// ─── AI Reframing Placeholders ───────────────────────────────────────────────

export const AI_REFRAMES: Record<EmotionTag, string[]> = {
    anxious: [
        'Anxiety often means you care deeply about something. That caring is a strength.',
        'What if this worry is actually preparing you to handle things well?',
        'You\'ve handled anxious moments before. You have the tools within you.',
    ],
    hopeful: [
        'Hope is a seed — the fact that you planted it means growth is already happening.',
        'Your optimism today is a gift to your future self.',
    ],
    confused: [
        'Confusion is the beginning of understanding. You\'re processing something new.',
        'Not knowing is okay — it means you\'re at the edge of discovery.',
    ],
    grateful: [
        'Noticing gratitude rewires your brain for positivity. You\'re doing the work!',
    ],
    calm: [
        'Peace is your natural state. You\'re simply returning to it.',
    ],
    sad: [
        'Sadness is a sign of depth. It means you\'re connected to something meaningful.',
        'It\'s okay to feel this. Emotions are visitors — they come and they go.',
        'Allowing yourself to feel sad is actually an act of courage.',
    ],
    angry: [
        'Anger often protects a deeper emotion underneath. What might that be?',
        'Your anger is valid. It\'s telling you a boundary was crossed.',
    ],
    excited: [
        'This excitement is your intuition saying you\'re on the right path!',
    ],
    peaceful: [
        'You\'ve earned this peace. Breathe it in deeply.',
    ],
    overwhelmed: [
        'You don\'t have to solve everything right now. Just one small step.',
        'Feeling overwhelmed means you\'re carrying too much. What can you set down?',
        'Break it into pieces. You only need to handle this moment.',
    ],
    lonely: [
        'Loneliness means your heart is open and ready for connection.',
        'Being alone and being lonely are different. You are never truly alone.',
    ],
    inspired: [
        'Capture this feeling. It\'s fuel for your journey ahead!',
    ],
    frustrated: [
        'Frustration means you expect better — and that\'s a sign of growth.',
        'What if this obstacle is redirecting you to something better?',
    ],
    loved: [
        'You deserve every bit of love that comes your way.',
    ],
    fearful: [
        'Fear is just excitement without breath. Try breathing deeply.',
        'The things we fear are often the doorways to our greatest growth.',
    ],
};

// ─── Spiritual Prompts ───────────────────────────────────────────────────────

export const SPIRITUAL_PROMPTS = [
    'What did you feel during meditation today?',
    'Any signs or synchronicities you noticed?',
    'What lesson is the universe teaching you right now?',
    'Describe a moment today when you felt truly connected.',
    'What are you surrendering to the divine today?',
    'What does your inner voice want you to know?',
    'How did you experience stillness today?',
    'What prayer or intention is in your heart?',
];

// ─── Vulnerability Prompts ───────────────────────────────────────────────────

export const VULNERABILITY_PROMPTS = [
    'What\'s one thing you wish you could tell someone?',
    'What are you afraid to admit, even to yourself?',
    'What emotion have you been avoiding lately?',
    'If you could be fully honest right now, what would you say?',
    'What do you need but are afraid to ask for?',
    'What would you forgive if you could?',
    'What mask do you wear most often, and why?',
    'What does your heart need to hear right now?',
];

// ─── Moon Phase Calculation ──────────────────────────────────────────────────

export function getMoonPhase(date: Date = new Date()): { phase: string; emoji: string } {
    // Simple moon phase calculation
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let c = 0, e = 0, jd = 0, b = 0;

    if (month < 3) {
        c = year - 1;
        e = month + 12;
    } else {
        c = year;
        e = month;
    }

    jd = Math.floor(365.25 * (c + 4716)) + Math.floor(30.6001 * (e + 1)) + day - 1524.5;
    jd -= 2451550.1;
    jd /= 29.530588853;
    b = Math.floor(jd);
    jd -= b;
    const age = Math.round(jd * 29.530588853);

    const phases: { phase: string; emoji: string }[] = [
        { phase: 'New Moon', emoji: '🌑' },
        { phase: 'Waxing Crescent', emoji: '🌒' },
        { phase: 'First Quarter', emoji: '🌓' },
        { phase: 'Waxing Gibbous', emoji: '🌔' },
        { phase: 'Full Moon', emoji: '🌕' },
        { phase: 'Waning Gibbous', emoji: '🌖' },
        { phase: 'Last Quarter', emoji: '🌗' },
        { phase: 'Waning Crescent', emoji: '🌘' },
    ];

    const index = Math.floor((age / 29.530588853) * 8) % 8;
    return phases[index];
}
