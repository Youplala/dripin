import { useState, useEffect, useCallback } from 'react';
import { WardrobeItem, Category } from '../types/database';
import {
  wardrobeService,
  addWardrobeItem as addItem,
  deleteWardrobeItem as deleteItem,
  incrementWearCount,
  getWardrobeStats,
} from '../services/supabase/wardrobe';
import { tagWardrobeItemMock } from '../services/ai/tagging';

interface UseWardrobeOptions {
  userId: string;
  category?: Category;
  autoLoad?: boolean;
}

export function useWardrobe({ userId, category, autoLoad = true }: UseWardrobeOptions) {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const filters = category ? { category } : undefined;
      const data = await wardrobeService.getAll(userId, filters);
      setItems(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load wardrobe';
      setError(message);
      console.error('Error loading wardrobe:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, category]);

  useEffect(() => {
    if (autoLoad && userId) {
      loadItems();

      // Subscribe to real-time updates
      const subscription = wardrobeService.subscribe(userId, (payload) => {
        if (payload.eventType === 'INSERT') {
          setItems(prev => [payload.new as WardrobeItem, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setItems(prev =>
            prev.map(item =>
              item.id === payload.new.id ? (payload.new as WardrobeItem) : item
            )
          );
        } else if (payload.eventType === 'DELETE') {
          setItems(prev => prev.filter(item => item.id !== payload.old.id));
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [autoLoad, userId, loadItems]);

  const addWardrobeItem = useCallback(
    async (imageUri: string) => {
      try {
        setError(null);

        // Tag the item with AI
        const tags = await tagWardrobeItemMock(imageUri);

        // Add to database
        const newItem = await addItem(userId, imageUri, {
          category: tags.category,
          subcategory: tags.subcategory,
          colors: tags.colors,
          style_tags: tags.style_tags,
          season: tags.season,
          occasions: tags.occasions,
          ai_description: tags.description,
        });

        setItems(prev => [newItem, ...prev]);
        return newItem;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add item';
        setError(message);
        throw err;
      }
    },
    [userId]
  );

  const updateWardrobeItem = useCallback(
    async (itemId: string, updates: Partial<WardrobeItem>) => {
      try {
        setError(null);
        const updatedItem = await wardrobeService.update(itemId, updates as any);
        setItems(prev =>
          prev.map(item => (item.id === itemId ? updatedItem : item))
        );
        return updatedItem;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update item';
        setError(message);
        throw err;
      }
    },
    []
  );

  const deleteWardrobeItem = useCallback(async (itemId: string) => {
    try {
      setError(null);
      await deleteItem(itemId);
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete item';
      setError(message);
      throw err;
    }
  }, []);

  const markAsWorn = useCallback(async (itemId: string) => {
    try {
      const updatedItem = await incrementWearCount(itemId);
      setItems(prev =>
        prev.map(item => (item.id === itemId ? updatedItem : item))
      );
    } catch (err) {
      console.error('Error marking item as worn:', err);
    }
  }, []);

  const getStats = useCallback(async () => {
    try {
      return await getWardrobeStats(userId);
    } catch (err) {
      console.error('Error getting stats:', err);
      return null;
    }
  }, [userId]);

  return {
    items,
    loading,
    error,
    loadItems,
    addWardrobeItem,
    updateWardrobeItem,
    deleteWardrobeItem,
    markAsWorn,
    getStats,
  };
}
