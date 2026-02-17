export type ChallengeLevel = 1 | 2 | 3 | 4;

export interface SocialChallenge {
    id: string;
    level: ChallengeLevel;
    title: string;
    description: string;
    completed: boolean;
    completedDate?: string; // ISO date string
    reflection?: string;
    feeling?: 'empowered' | 'proud' | 'nervous' | 'uncomfortable' | 'neutral';
}

export interface ChallengeLevelInfo {
    level: ChallengeLevel;
    title: string;
    description: string;
    challenges: Omit<SocialChallenge, 'id' | 'completed' | 'completedDate' | 'reflection' | 'feeling'>[];
}

export const CHALLENGE_LEVELS: ChallengeLevelInfo[] = [
    {
        level: 1,
        title: 'Breaking the Ice',
        description: 'Small, low-risk interactions to build confidence',
        challenges: [
            {
                level: 1,
                title: 'Smile at a stranger',
                description: 'Make eye contact and smile at someone you pass by today.',
            },
            {
                level: 1,
                title: 'Say hello to a neighbor',
                description: 'Greet a neighbor you usually just nod to.',
            },
            {
                level: 1,
                title: 'Thank someone genuinely',
                description: 'Express sincere gratitude to someone who helped you.',
            },
        ],
    },
    {
        level: 2,
        title: 'Opening Up',
        description: 'Start meaningful conversations and express yourself',
        challenges: [
            {
                level: 2,
                title: 'Compliment someone',
                description: 'Give a genuine compliment to a friend, colleague, or stranger.',
            },
            {
                level: 2,
                title: 'Start a conversation',
                description: 'Initiate a conversation with someone you don\'t know well.',
            },
            {
                level: 2,
                title: 'Share your opinion',
                description: 'Express your honest opinion in a group discussion.',
            },
        ],
    },
    {
        level: 3,
        title: 'Building Depth',
        description: 'Share personal experiences and deepen connections',
        challenges: [
            {
                level: 3,
                title: 'Share something personal',
                description: 'Tell a friend about something meaningful to you.',
            },
            {
                level: 3,
                title: 'Ask a deep question',
                description: 'Ask someone about their dreams, fears, or values.',
            },
            {
                level: 3,
                title: 'Admit a mistake',
                description: 'Acknowledge something you did wrong to someone.',
            },
        ],
    },
    {
        level: 4,
        title: 'True Vulnerability',
        description: 'Have authentic, vulnerable conversations',
        challenges: [
            {
                level: 4,
                title: 'Have a vulnerable conversation',
                description: 'Share your struggles or fears with someone you trust.',
            },
            {
                level: 4,
                title: 'Set a boundary',
                description: 'Communicate a personal boundary clearly and kindly.',
            },
            {
                level: 4,
                title: 'Ask for help',
                description: 'Reach out to someone and ask for support you need.',
            },
        ],
    },
];
