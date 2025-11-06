import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useWardrobe } from '../../hooks/useWardrobe';
import { useCamera } from '../../hooks/useCamera';
import { WardrobeItem, Category } from '../../types/database';
import { CATEGORIES } from '../../utils/constants';
import { theme } from '../../theme';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - theme.spacing.lg * 3) / 2;

export function WardrobeScreen() {
  const { user } = useAuth();
  const { items, loading, loadItems, addWardrobeItem, deleteWardrobeItem } = useWardrobe({
    userId: user?.id || '',
  });
  const { pickFromGallery } = useCamera();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [adding, setAdding] = useState(false);

  const filteredItems = selectedCategory
    ? items.filter(item => item.category === selectedCategory)
    : items;

  const handleAddItem = async () => {
    try {
      setShowAddModal(false);
      const imageUri = await pickFromGallery();

      if (imageUri) {
        setAdding(true);
        await addWardrobeItem(imageUri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    try {
      await deleteWardrobeItem(selectedItem.id);
      setSelectedItem(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const renderItem = ({ item }: { item: WardrobeItem }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedItem(item);
      }}
    >
      <GlassCard style={styles.itemCard}>
        <Image
          source={{ uri: item.image_no_bg_url || item.image_url }}
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemCategory}>{item.category}</Text>
          <Text style={styles.itemWorn}>Worn {item.times_worn}x</Text>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );

  const renderCategory = (category: Category) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryChip,
        selectedCategory === category && styles.categoryChipActive,
      ]}
      onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === category && styles.categoryTextActive,
        ]}
      >
        {CATEGORIES[category]}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Wardrobe</Text>
        <Text style={styles.subtitle}>{items.length} items</Text>
      </View>

      <View style={styles.categories}>
        {(Object.keys(CATEGORIES) as Category[]).map(renderCategory)}
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadItems}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>👔</Text>
            <Text style={styles.emptyText}>No items yet</Text>
            <Text style={styles.emptySubtext}>Add your first clothing item to get started</Text>
          </View>
        }
      />

      <Button
        title={adding ? 'Adding...' : 'Add Item'}
        onPress={() => setShowAddModal(true)}
        variant="primary"
        style={styles.addButton}
        disabled={adding}
      />

      {/* Add Item Modal */}
      <Modal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        variant="sheet"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Item</Text>
          <Button
            title="Take Photo"
            onPress={handleAddItem}
            variant="primary"
            style={styles.modalButton}
          />
          <Button
            title="Choose from Gallery"
            onPress={handleAddItem}
            variant="secondary"
            style={styles.modalButton}
          />
        </View>
      </Modal>

      {/* Item Detail Modal */}
      <Modal
        visible={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        variant="center"
      >
        {selectedItem && (
          <View style={styles.detailContent}>
            <Image
              source={{ uri: selectedItem.image_no_bg_url || selectedItem.image_url }}
              style={styles.detailImage}
              resizeMode="contain"
            />
            <Text style={styles.detailCategory}>{selectedItem.subcategory || selectedItem.category}</Text>
            <Text style={styles.detailDescription}>{selectedItem.ai_description}</Text>

            <View style={styles.tags}>
              {selectedItem.colors.map(color => (
                <View key={color} style={styles.tag}>
                  <Text style={styles.tagText}>{color}</Text>
                </View>
              ))}
            </View>

            <View style={styles.detailButtons}>
              <Button
                title="Delete"
                onPress={handleDeleteItem}
                variant="glass"
                style={styles.detailButton}
              />
              <Button
                title="Close"
                onPress={() => setSelectedItem(null)}
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
  categories: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  categoryTextActive: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.semibold,
  },
  grid: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  itemContainer: {
    width: ITEM_SIZE,
    marginRight: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  itemCard: {
    padding: 0,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: ITEM_SIZE * 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  itemInfo: {
    padding: theme.spacing.sm,
  },
  itemCategory: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    textTransform: 'capitalize',
  },
  itemWorn: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    marginTop: 2,
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
  addButton: {
    margin: theme.spacing.lg,
  },
  modalContent: {
    padding: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  modalButton: {
    marginBottom: theme.spacing.md,
  },
  detailContent: {
    alignItems: 'center',
  },
  detailImage: {
    width: 200,
    height: 200,
    marginBottom: theme.spacing.md,
  },
  detailCategory: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textTransform: 'capitalize',
  },
  detailDescription: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  tag: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tagText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
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
