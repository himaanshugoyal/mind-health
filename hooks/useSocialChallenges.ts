import { CHALLENGE_LEVELS, ChallengeLevel, SocialChallenge } from '@/types/challenge';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const CHALLENGES_STORAGE_KEY = '@mind_health_social_challenges';

export function useSocialChallenges() {
    const [challenges, setChallenges] = useState<SocialChallenge[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadChallenges();
    }, []);

    const loadChallenges = async () => {
        try {
            const storedChallenges = await AsyncStorage.getItem(CHALLENGES_STORAGE_KEY);
            if (storedChallenges) {
                setChallenges(JSON.parse(storedChallenges));
            } else {
                // Initialize with all challenges from CHALLENGE_LEVELS
                const initialChallenges = initializeChallenges();
                await saveChallenges(initialChallenges);
            }
        } catch (error) {
            console.error('Failed to load challenges:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const initializeChallenges = (): SocialChallenge[] => {
        const allChallenges: SocialChallenge[] = [];

        CHALLENGE_LEVELS.forEach(levelInfo => {
            levelInfo.challenges.forEach((challenge, index) => {
                allChallenges.push({
                    id: `${levelInfo.level}-${index}`,
                    level: levelInfo.level,
                    title: challenge.title,
                    description: challenge.description,
                    completed: false,
                });
            });
        });

        return allChallenges;
    };

    const saveChallenges = async (newChallenges: SocialChallenge[]) => {
        try {
            await AsyncStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(newChallenges));
            setChallenges(newChallenges);
        } catch (error) {
            console.error('Failed to save challenges:', error);
        }
    };

    const completeChallenge = useCallback(async (
        id: string,
        reflection?: string,
        feeling?: SocialChallenge['feeling']
    ) => {
        const updatedChallenges = challenges.map(challenge =>
            challenge.id === id
                ? {
                    ...challenge,
                    completed: true,
                    completedDate: new Date().toISOString(),
                    reflection,
                    feeling,
                }
                : challenge
        );

        await saveChallenges(updatedChallenges);
    }, [challenges]);

    const uncompleteChallenge = useCallback(async (id: string) => {
        const updatedChallenges = challenges.map(challenge =>
            challenge.id === id
                ? {
                    ...challenge,
                    completed: false,
                    completedDate: undefined,
                    reflection: undefined,
                    feeling: undefined,
                }
                : challenge
        );

        await saveChallenges(updatedChallenges);
    }, [challenges]);

    const getChallengesByLevel = useCallback((level: ChallengeLevel) => {
        return challenges.filter(c => c.level === level);
    }, [challenges]);

    const getCurrentLevel = useCallback((): ChallengeLevel => {
        // Determine current level based on completion
        // User is on a level if they haven't completed all challenges in that level
        for (let level = 1; level <= 4; level++) {
            const levelChallenges = getChallengesByLevel(level as ChallengeLevel);
            const allCompleted = levelChallenges.every(c => c.completed);

            if (!allCompleted) {
                return level as ChallengeLevel;
            }
        }

        // All challenges completed, return level 4
        return 4;
    }, [getChallengesByLevel]);

    const isLevelUnlocked = useCallback((level: ChallengeLevel): boolean => {
        if (level === 1) return true;

        // Check if previous level is completed
        const previousLevel = (level - 1) as ChallengeLevel;
        const previousLevelChallenges = getChallengesByLevel(previousLevel);

        return previousLevelChallenges.every(c => c.completed);
    }, [getChallengesByLevel]);

    const getCompletionStats = useCallback(() => {
        const totalChallenges = challenges.length;
        const completedChallenges = challenges.filter(c => c.completed).length;
        const completionPercentage = totalChallenges > 0
            ? Math.round((completedChallenges / totalChallenges) * 100)
            : 0;

        const levelStats = [1, 2, 3, 4].map(level => {
            const levelChallenges = getChallengesByLevel(level as ChallengeLevel);
            const completed = levelChallenges.filter(c => c.completed).length;
            const total = levelChallenges.length;

            return {
                level: level as ChallengeLevel,
                completed,
                total,
                percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
            };
        });

        return {
            totalChallenges,
            completedChallenges,
            completionPercentage,
            currentLevel: getCurrentLevel(),
            levelStats,
        };
    }, [challenges, getChallengesByLevel, getCurrentLevel]);

    return {
        challenges,
        isLoading,
        completeChallenge,
        uncompleteChallenge,
        getChallengesByLevel,
        getCurrentLevel,
        isLevelUnlocked,
        getCompletionStats,
    };
}
