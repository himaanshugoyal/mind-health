import { ScreenHeader } from '@/components/ScreenHeader';
import { AddHabitModal } from '@/components/habits/AddHabitModal';
import { HabitList } from '@/components/habits/HabitList';
import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useHabits } from '@/hooks/useHabits';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function HabitsScreen() {
    const { theme } = useAppTheme();
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { habits, addHabit, toggleHabitCompletion } = useHabits();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScreenHeader
                title="Habits"
                subtitle="Small steps, big changes"
                showBack
                onBack={() => router.back()}
            />
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <HabitList
                    habits={habits}
                    onToggleHabit={toggleHabitCompletion}
                    onAddHabit={() => setIsModalVisible(true)}
                />

                <View style={{ height: 100 }} />
            </ScrollView>

            <AddHabitModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onAdd={addHabit}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { paddingHorizontal: Spacing.xl },
});
