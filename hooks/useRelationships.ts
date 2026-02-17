import { ContactFrequency, Interaction, Relationship, RelationshipStats } from '@/types/relationship';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const RELATIONSHIPS_STORAGE_KEY = '@mind_health_relationships';
const INTERACTIONS_STORAGE_KEY = '@mind_health_interactions';

export function useRelationships() {
    const [relationships, setRelationships] = useState<Relationship[]>([]);
    const [interactions, setInteractions] = useState<Interaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [storedRelationships, storedInteractions] = await Promise.all([
                AsyncStorage.getItem(RELATIONSHIPS_STORAGE_KEY),
                AsyncStorage.getItem(INTERACTIONS_STORAGE_KEY),
            ]);

            if (storedRelationships) {
                setRelationships(JSON.parse(storedRelationships));
            }
            if (storedInteractions) {
                setInteractions(JSON.parse(storedInteractions));
            }
        } catch (error) {
            console.error('Failed to load relationships:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveRelationships = async (newRelationships: Relationship[]) => {
        try {
            await AsyncStorage.setItem(RELATIONSHIPS_STORAGE_KEY, JSON.stringify(newRelationships));
            setRelationships(newRelationships);
        } catch (error) {
            console.error('Failed to save relationships:', error);
        }
    };

    const saveInteractions = async (newInteractions: Interaction[]) => {
        try {
            await AsyncStorage.setItem(INTERACTIONS_STORAGE_KEY, JSON.stringify(newInteractions));
            setInteractions(newInteractions);
        } catch (error) {
            console.error('Failed to save interactions:', error);
        }
    };

    const addRelationship = useCallback(async (
        name: string,
        relationshipType: Relationship['relationshipType'],
        contactFrequency: ContactFrequency,
        photoEmoji?: string,
        notes?: string
    ) => {
        const newRelationship: Relationship = {
            id: Date.now().toString(),
            name,
            relationshipType,
            contactFrequency,
            createdAt: new Date().toISOString(),
            photoEmoji,
            notes,
        };

        await saveRelationships([...relationships, newRelationship]);
    }, [relationships]);

    const updateRelationship = useCallback(async (id: string, updates: Partial<Relationship>) => {
        const updatedRelationships = relationships.map(rel =>
            rel.id === id ? { ...rel, ...updates } : rel
        );
        await saveRelationships(updatedRelationships);
    }, [relationships]);

    const deleteRelationship = useCallback(async (id: string) => {
        const updatedRelationships = relationships.filter(rel => rel.id !== id);
        const updatedInteractions = interactions.filter(int => int.relationshipId !== id);

        await Promise.all([
            saveRelationships(updatedRelationships),
            saveInteractions(updatedInteractions),
        ]);
    }, [relationships, interactions]);

    const logInteraction = useCallback(async (
        relationshipId: string,
        type: Interaction['type'],
        feeling?: Interaction['feeling'],
        notes?: string,
        duration?: number
    ) => {
        const newInteraction: Interaction = {
            id: Date.now().toString(),
            relationshipId,
            date: new Date().toISOString(),
            type,
            feeling,
            notes,
            duration,
        };

        // Update relationship's lastContactDate
        const updatedRelationships = relationships.map(rel =>
            rel.id === relationshipId
                ? { ...rel, lastContactDate: newInteraction.date }
                : rel
        );

        await Promise.all([
            saveInteractions([...interactions, newInteraction]),
            saveRelationships(updatedRelationships),
        ]);
    }, [relationships, interactions]);

    const getRelationshipInteractions = useCallback((relationshipId: string) => {
        return interactions
            .filter(int => int.relationshipId === relationshipId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [interactions]);

    const getDaysSinceLastContact = useCallback((relationship: Relationship): number | null => {
        if (!relationship.lastContactDate) return null;

        const lastContact = new Date(relationship.lastContactDate);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lastContact.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    }, []);

    const isOverdue = useCallback((relationship: Relationship): boolean => {
        const days = getDaysSinceLastContact(relationship);
        if (days === null) return true; // Never contacted

        const frequencyDays: Record<ContactFrequency, number> = {
            daily: 1,
            weekly: 7,
            biweekly: 14,
            monthly: 30,
            occasionally: 60,
        };

        return days > frequencyDays[relationship.contactFrequency];
    }, [getDaysSinceLastContact]);

    const getRelationshipsNeedingAttention = useCallback(() => {
        return relationships.filter(rel => isOverdue(rel));
    }, [relationships, isOverdue]);

    const getStats = useCallback((): RelationshipStats => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const interactionsThisWeek = interactions.filter(
            int => new Date(int.date) >= weekAgo
        ).length;

        const interactionsThisMonth = interactions.filter(
            int => new Date(int.date) >= monthAgo
        ).length;

        return {
            totalRelationships: relationships.length,
            needsAttention: getRelationshipsNeedingAttention().length,
            interactionsThisWeek,
            interactionsThisMonth,
        };
    }, [relationships, interactions, getRelationshipsNeedingAttention]);

    return {
        relationships,
        interactions,
        isLoading,
        addRelationship,
        updateRelationship,
        deleteRelationship,
        logInteraction,
        getRelationshipInteractions,
        getDaysSinceLastContact,
        isOverdue,
        getRelationshipsNeedingAttention,
        getStats,
    };
}
