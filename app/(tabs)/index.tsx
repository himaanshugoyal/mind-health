import { Card } from '@/components/Card';
import { MoodSelector } from '@/components/MoodSelector';
import { QuickAction } from '@/components/QuickAction';
import { StreakBadge } from '@/components/StreakBadge';
import { AddHabitModal } from '@/components/habits/AddHabitModal';
import { HabitList } from '@/components/habits/HabitList';
import { FontSizes, FontWeights, Palette, Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useHabits } from '@/hooks/useHabits';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

function getDayMessage(): string {
  const messages = [
    'Every breath is a fresh start 🌱',
    'You are exactly where you need to be 🌿',
    'Small steps lead to big changes 🌸',
    'Be gentle with yourself today 🦋',
    'This moment is all that matters 🌅',
    'You are growing, even in stillness 🌳',
    'Let go of what you cannot control 🍃',
  ];
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return messages[dayOfYear % messages.length];
}

export default function HomeScreen() {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [isHabitModalVisible, setIsHabitModalVisible] = useState(false);

  const { habits, addHabit, toggleHabitCompletion } = useHabits();

  const activeStreaks = habits.filter(h => h.streak > 0).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + Spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>
              {getGreeting()} ✨
            </Text>
            <Text style={[styles.name, { color: theme.text }]}>
              Welcome back
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.sosButton, { backgroundColor: theme.emotionLight }]}
            onPress={() => router.push('/sos')}
            activeOpacity={0.7}
          >
            <Text style={styles.sosIcon}>🆘</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Intention */}
        <Card variant="elevated" style={{ backgroundColor: theme.primaryLight }}>
          <Text style={[styles.intentionLabel, { color: theme.primary }]}>
            ✦ Today's Intention
          </Text>
          <Text style={[styles.intentionText, { color: theme.text }]}>
            {getDayMessage()}
          </Text>
        </Card>

        {/* Habits Section */}
        <HabitList
          habits={habits}
          onToggleHabit={toggleHabitCompletion}
          onAddHabit={() => setIsHabitModalVisible(true)}
        />

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActions}>
            <QuickAction
              icon="🧘"
              label="Breathe"
              color={Palette.sage500}
              backgroundColor={theme.primaryLight}
              onPress={() => router.push('/practice/breathwork')}
            />
            <QuickAction
              icon="📝"
              label="Journal"
              color={Palette.amber500}
              backgroundColor={theme.accentLight}
              onPress={() => router.push('/(tabs)/journal')}
            />
            <QuickAction
              icon="🧘‍♂️"
              label="Meditate"
              color={Palette.twilight500}
              backgroundColor={theme.spiritLight}
              onPress={() => router.push('/(tabs)/practice')}
            />
            <QuickAction
              icon="🙏"
              label="Gratitude"
              color={Palette.rose500}
              backgroundColor={theme.emotionLight}
              onPress={() => router.push('/journal/gratitude')}
            />
          </View>
        </View>

        {/* Mood Check-in */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Mood Check-in
          </Text>
          <Card>
            <MoodSelector
              selectedMood={selectedMood}
              onSelect={setSelectedMood}
            />
            {selectedMood && (
              <TouchableOpacity
                style={[styles.moodContinue, { backgroundColor: theme.primary }]}
                activeOpacity={0.7}
              >
                <Text style={styles.moodContinueText}>Continue →</Text>
              </TouchableOpacity>
            )}
          </Card>
        </View>

        {/* Streaks (Legacy + Active Habits Summary) */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Your Progress
          </Text>
          <View style={styles.streaks}>
            <StreakBadge icon="🔥" count={activeStreaks} label="Active Habits" isActive={activeStreaks > 0} />
            <StreakBadge icon="📝" count={5} label="Journal" isActive />
            <StreakBadge icon="🧘" count={3} label="Meditate" isActive />
          </View>
        </View>

        {/* Daily Insight */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            AI Insight
          </Text>
          <Card variant="elevated" style={{ backgroundColor: theme.spiritLight }}>
            <Text style={[styles.insightIcon]}>💡</Text>
            <Text style={[styles.insightText, { color: theme.text }]}>
              You've been journaling consistently for 5 days! Studies show that
              regular journaling reduces stress by 25%. Keep going!
            </Text>
          </Card>
        </View>

        {/* Affirmation */}
        <Card variant="outlined">
          <Text style={[styles.affirmationLabel, { color: theme.textTertiary }]}>
            Today's Affirmation
          </Text>
          <Text style={[styles.affirmation, { color: theme.text }]}>
            "I release what I cannot control and trust the journey ahead."
          </Text>
        </Card>

        <View style={{ height: 100 }} />
      </ScrollView>

      <AddHabitModal
        visible={isHabitModalVisible}
        onClose={() => setIsHabitModalVisible(false)}
        onAdd={addHabit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  name: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    marginTop: 2,
  },
  sosButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosIcon: {
    fontSize: 20,
  },
  intentionLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  intentionText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
    lineHeight: 26,
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.sm,
  },
  moodContinue: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  moodContinueText: {
    color: '#fff',
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  streaks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  insightIcon: {
    fontSize: 24,
    marginBottom: Spacing.sm,
  },
  insightText: {
    fontSize: FontSizes.md,
    lineHeight: 24,
  },
  affirmationLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },
  affirmation: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
    fontStyle: 'italic',
    lineHeight: 28,
  },
});
