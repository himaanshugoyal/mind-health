export type RelationshipType = 'family' | 'friend' | 'partner' | 'colleague' | 'other';
export type InteractionType = 'call' | 'text' | 'in-person' | 'video' | 'other';
export type ContactFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'occasionally';

export interface Relationship {
    id: string;
    name: string;
    relationshipType: RelationshipType;
    contactFrequency: ContactFrequency;
    lastContactDate?: string; // ISO date string
    createdAt: string;
    notes?: string;
    photoEmoji?: string; // Optional emoji to represent the person
}

export interface Interaction {
    id: string;
    relationshipId: string;
    date: string; // ISO date string
    type: InteractionType;
    feeling?: 'great' | 'good' | 'neutral' | 'difficult' | 'draining';
    notes?: string;
    duration?: number; // in minutes
}

export interface RelationshipStats {
    totalRelationships: number;
    needsAttention: number; // Overdue check-ins
    interactionsThisWeek: number;
    interactionsThisMonth: number;
}
