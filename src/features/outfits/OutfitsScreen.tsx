import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useOutfits } from '../../hooks/useOutfits';
import { useWardrobe } from '../../hooks/useWardrobe';
import { Outfit } from '../../types/database';
import { theme } from '../../theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - theme.spacing.lg * 2;

export function OutfitsScreen() {
  const { user } = useAuth();
  const { outfits, loading, loadOutfits, generateOutfits, deleteOutfit, toggleFavorite } = useOutfits(user?.id || '');
  const { items } = useWardrobe({ userId: user?.id || '' });

  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerateOutfits = async () => {
    try {
      setGenerating(true);
      await generateOutfits(items);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error generating outfits:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleFavorite = async (outfitId: string) => {
    await toggleFavorite(outfitId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleDeleteOutfit = async () => {
    if (!selectedOutfit) return;

    try {
      await deleteOutfit(selectedOutfit.id);
      setSelectedOutfit(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error deleting outfit:', error);
    }
  };

  const renderOutfit = ({ item }: { item: Outfit }) => (
    <TouchableOpacity
      style={styles.outfitContainer}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedOutfit(item);
      }}
    >
      <GlassCard style={styles.outfitCard}>
        <View style={styles.outfitHeader}>
          <View>
            <Text style={styles.outfitName}>{item.name}</Text>
            {item.ai_generated && (
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>AI Generated</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            onPress={() => handleToggleFavorite(item.id)}
            style={styles.favoriteButton}
          >
            <Text style={styles.favoriteIcon}>{item.favorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        {item.vibe && (
          <Text style={styles.outfitVibe}>Vibe: {item.vibe}</Text>
        )}

        <View style={styles.outfitItems}>
          <Text style={styles.itemCount}>{item.item_ids.length} items</Text>
          {item.times_worn > 0 && (
            <Text style={styles.wornCount}>Worn {item.times_worn}x</Text>
          )}
        </View>

        {item.ai_reason && (
          <Text style={styles.outfitReason} numberOfLines={2}>
            {item.ai_reason}
          </Text>
        )}
      </GlassCard>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Outfits</Text>
        <Text style={styles.subtitle}>{outfits.length} outfits</Text>
      </View>

      <FlatList
        data={outfits}
        renderItem={renderOutfit}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadOutfits}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>✨</Text>
            <Text style={styles.emptyText}>No outfits yet</Text>
            <Text style={styles.emptySubtext}>Generate AI outfits to get started</Text>
          </View>
        }
      />

      <View style={styles.actions}>
        <Button
          title={generating ? 'Generating...' : '✨ Generate Outfits'}
          onPress={handleGenerateOutfits}
          variant="primary"
          disabled={generating || items.length < 3}
        />
        {items.length < 3 && (
          <Text style={styles.hint}>Add at least 3 items to generate outfits</Text>
        )}
      </View>

      {/* Outfit Detail Modal */}
      <Modal
        visible={!!selectedOutfit}
        onClose={() => setSelectedOutfit(null)}
        variant="center"
      >
        {selectedOutfit && (
          <View style={styles.detailContent}>
            <Text style={styles.detailName}>{selectedOutfit.name}</Text>

            {selectedOutfit.vibe && (
              <Text style={styles.detailVibe}>Vibe: {selectedOutfit.vibe}</Text>
            )}

            {selectedOutfit.ai_reason && (
              <Text style={styles.detailReason}>{selectedOutfit.ai_reason}</Text>
            )}

            <View style={styles.detailStats}>
              <Text style={styles.detailStat}>
                {selectedOutfit.item_ids.length} items
              </Text>
              <Text style={styles.detailStat}>
                Worn {selectedOutfit.times_worn}x
              </Text>
            </View>

            <View style={styles.detailButtons}>
              <Button
                title="Delete"
                onPress={handleDeleteOutfit}
                variant="glass"
                style={styles.detailButton}
              />
              <Button
                title="Close"
                onPress={() => setSelectedOutfit(null)}
                variant="primary"
                style={styles.detailButton}
              />
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.base,
  },
  header: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  list: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  outfitContainer: {
    marginBottom: theme.spacing.md,
  },
  outfitCard: {
    padding: theme.spacing.md,
  },
  outfitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  outfitName: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  aiBadge: {
    marginTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  aiBadgeText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.medium,
  },
  favoriteButton: {
    padding: theme.spacing.xs,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  outfitVibe: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: theme.spacing.xs,
  },
  outfitItems: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  itemCount: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  wornCount: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
  },
  outfitReason: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.sm,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  emptySubtext: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  actions: {
    padding: theme.spacing.lg,
  },
  hint: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  detailContent: {
    alignItems: 'center',
  },
  detailName: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  detailVibe: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: theme.spacing.sm,
  },
  detailReason: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.md,
  },
  detailStats: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  detailStat: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
  },
  detailButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    width: '100%',
  },
  detailButton: {
    flex: 1,
  },
});
