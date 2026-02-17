import { ScreenHeader } from '@/components/ScreenHeader';
import { AddRelationshipModal } from '@/components/social/AddRelationshipModal';
import { InteractionLogModal } from '@/components/social/InteractionLogModal';
import { RelationshipCard } from '@/components/social/RelationshipCard';
import { FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useRelationships } from '@/hooks/useRelationships';
import { Relationship } from '@/types/relationship';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RelationshipsScreen() {
    const { theme } = useAppTheme();
    const router = useRouter();
    const {
        relationships,
        addRelationship,
        logInteraction,
        getDaysSinceLastContact,
        isOverdue,
        getRelationshipsNeedingAttention,
    } = useRelationships();

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isLogModalVisible, setIsLogModalVisible] = useState(false);
    const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null);

    const needsAttention = getRelationshipsNeedingAttention();
    const otherRelationships = relationships.filter(
        (rel) => !needsAttention.find((need) => need.id === rel.id)
    );

    const handleLogInteraction = (relationship: Relationship) => {
        setSelectedRelationship(relationship);
        setIsLogModalVisible(true);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScreenHeader
                title="Relationships"
                subtitle="Track meaningful connections"
                showBack
                onBack={() => router.back()}
                rightAction={
                    <TouchableOpacity onPress={() => setIsAddModalVisible(true)}>
                        <Ionicons name="add-circle" size={28} color={theme.primary} />
                    </TouchableOpacity>
                }
            />

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {relationships.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyEmoji}>👥</Text>
                        <Text style={[styles.emptyTitle, { color: theme.text }]}>
                            No relationships tracked yet
                        </Text>
                        <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                            Start tracking the people who matter most to you
                        </Text>
                        <TouchableOpacity
                            style={[styles.addButton, { backgroundColor: theme.primary }]}
                            onPress={() => setIsAddModalVisible(true)}
                        >
                            <Ionicons name="add" size={20} color="white" style={{ marginRight: 6 }} />
                            <Text style={styles.addButtonText}>Add First Relationship</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {needsAttention.length > 0 && (
                            <>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="time-outline" size={20} color={theme.warning} />
                                    <Text style={[styles.sectionTitle, { color: theme.warning }]}>
                                        Needs Attention ({needsAttention.length})
                                    </Text>
                                </View>
                                {needsAttention.map((relationship) => (
                                    <RelationshipCard
                                        key={relationship.id}
                                        relationship={relationship}
                                        daysSinceLastContact={getDaysSinceLastContact(relationship)}
                                        isOverdue={true}
                                        onPress={() => { }}
                                        onLogInteraction={() => handleLogInteraction(relationship)}
                                    />
                                ))}
                            </>
                        )}

                        {otherRelationships.length > 0 && (
                            <>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="checkmark-circle-outline" size={20} color={theme.primary} />
                                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                                        All Good ({otherRelationships.length})
                                    </Text>
                                </View>
                                {otherRelationships.map((relationship) => (
                                    <RelationshipCard
                                        key={relationship.id}
                                        relationship={relationship}
                                        daysSinceLastContact={getDaysSinceLastContact(relationship)}
                                        isOverdue={false}
                                        onPress={() => { }}
                                        onLogInteraction={() => handleLogInteraction(relationship)}
                                    />
                                ))}
                            </>
                        )}
                    </>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            <AddRelationshipModal
                visible={isAddModalVisible}
                onClose={() => setIsAddModalVisible(false)}
                onAdd={addRelationship}
            />

            <InteractionLogModal
                visible={isLogModalVisible}
                relationshipName={selectedRelationship?.name || ''}
                onClose={() => {
                    setIsLogModalVisible(false);
                    setSelectedRelationship(null);
                }}
                onLog={(type, feeling, notes, duration) => {
                    if (selectedRelationship) {
                        logInteraction(selectedRelationship.id, type, feeling, notes, duration);
                    }
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { paddingHorizontal: Spacing.xl },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: Spacing.lg,
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.xl * 2,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: Spacing.lg,
    },
    emptyTitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        marginBottom: Spacing.sm,
    },
    emptySubtitle: {
        fontSize: FontSizes.sm,
        textAlign: 'center',
        marginBottom: Spacing.xl,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 24,
    },
    addButtonText: {
        color: 'white',
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
    },
});
