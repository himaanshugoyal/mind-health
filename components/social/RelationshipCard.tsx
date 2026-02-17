import { FontSizes, FontWeights, Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Relationship } from '@/types/relationship';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RelationshipCardProps {
    relationship: Relationship;
    daysSinceLastContact: number | null;
    isOverdue: boolean;
    onPress: () => void;
    onLogInteraction: () => void;
}

const RELATIONSHIP_ICONS: Record<Relationship['relationshipType'], string> = {
    family: '👨‍👩‍👧‍👦',
    friend: '👥',
    partner: '💑',
    colleague: '💼',
    other: '👤',
};

export function RelationshipCard({
    relationship,
    daysSinceLastContact,
    isOverdue,
    onPress,
    onLogInteraction,
}: RelationshipCardProps) {
    const { theme } = useAppTheme();

    const getDaysText = () => {
        if (daysSinceLastContact === null) {
            return 'No contact yet';
        }
        if (daysSinceLastContact === 0) {
            return 'Today';
        }
        if (daysSinceLastContact === 1) {
            return '1 day ago';
        }
        return `${daysSinceLastContact} days ago`;
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: theme.card,
                    borderColor: isOverdue ? theme.warning : theme.border,
                    borderWidth: isOverdue ? 2 : 1,
                },
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}>
                    <Text style={styles.emoji}>
                        {relationship.photoEmoji || RELATIONSHIP_ICONS[relationship.relationshipType]}
                    </Text>
                </View>

                <View style={styles.info}>
                    <Text style={[styles.name, { color: theme.text }]}>{relationship.name}</Text>
                    <View style={styles.metaRow}>
                        <Text style={[styles.type, { color: theme.textSecondary }]}>
                            {relationship.relationshipType.charAt(0).toUpperCase() + relationship.relationshipType.slice(1)}
                        </Text>
                        <Text style={[styles.separator, { color: theme.textTertiary }]}>•</Text>
                        <Text
                            style={[
                                styles.lastContact,
                                { color: isOverdue ? theme.warning : theme.textSecondary },
                            ]}
                        >
                            {getDaysText()}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.logButton, { backgroundColor: theme.primary }]}
                    onPress={(e) => {
                        e.stopPropagation();
                        onLogInteraction();
                    }}
                >
                    <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {isOverdue && (
                <View style={[styles.overdueBar, { backgroundColor: theme.warningLight }]}>
                    <Ionicons name="time-outline" size={14} color={theme.warning} />
                    <Text style={[styles.overdueText, { color: theme.warning }]}>
                        Time to reach out!
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: Radius.md,
        marginBottom: Spacing.md,
        overflow: 'hidden',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    emoji: {
        fontSize: 24,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    type: {
        fontSize: FontSizes.sm,
    },
    separator: {
        marginHorizontal: 6,
        fontSize: FontSizes.sm,
    },
    lastContact: {
        fontSize: FontSizes.sm,
    },
    logButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    overdueBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        gap: 6,
    },
    overdueText: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.medium,
    },
});
