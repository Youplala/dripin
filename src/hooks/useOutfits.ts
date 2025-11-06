import { useState, useEffect, useCallback } from 'react';
import { Outfit, WardrobeItem } from '../types/database';
import {
  outfitService,
  createOutfit as createOutfitService,
  getOutfitWithItems,
  toggleOutfitFavorite,
  deleteOutfit as deleteOutfitService,
  incrementOutfitWearCount,
} from '../services/supabase/outfits';
import { generateOutfitsMock } from '../services/ai/outfits';

export function useOutfits(userId: string) {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOutfits = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await outfitService.getAll(userId);
      setOutfits(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load outfits';
      setError(message);
      console.error('Error loading outfits:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadOutfits();

      // Subscribe to real-time updates
      const subscription = outfitService.subscribe(userId, (payload) => {
        if (payload.eventType === 'INSERT') {
          setOutfits(prev => [payload.new as Outfit, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setOutfits(prev =>
            prev.map(outfit =>
              outfit.id === payload.new.id ? (payload.new as Outfit) : outfit
            )
          );
        } else if (payload.eventType === 'DELETE') {
          setOutfits(prev => prev.filter(outfit => outfit.id !== payload.old.id));
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [userId, loadOutfits]);

  const createOutfit = useCallback(
    async (data: {
      name: string;
      item_ids: string[];
      occasion?: string;
      season?: string;
    }) => {
      try {
        setError(null);
        const newOutfit = await createOutfitService(userId, data);
        setOutfits(prev => [newOutfit, ...prev]);
        return newOutfit;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create outfit';
        setError(message);
        throw err;
      }
    },
    [userId]
  );

  const generateOutfits = useCallback(
    async (wardrobeItems: WardrobeItem[], context?: any) => {
      try {
        setLoading(true);
        setError(null);

        const suggestions = await generateOutfitsMock(wardrobeItems, context || {});

        // Create outfits from suggestions
        const createdOutfits = await Promise.all(
          suggestions.map((suggestion, index) =>
            createOutfitService(userId, {
              name: `AI Outfit ${index + 1}`,
              item_ids: suggestion.item_ids,
              ai_generated: true,
              ai_reason: suggestion.reason,
              vibe: suggestion.vibe,
            })
          )
        );

        setOutfits(prev => [...createdOutfits, ...prev]);
        return createdOutfits;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to generate outfits';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const toggleFavorite = useCallback(async (outfitId: string) => {
    try {
      const updatedOutfit = await toggleOutfitFavorite(outfitId);
      setOutfits(prev =>
        prev.map(outfit => (outfit.id === outfitId ? updatedOutfit : outfit))
      );
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  }, []);

  const markAsWorn = useCallback(async (outfitId: string) => {
    try {
      const updatedOutfit = await incrementOutfitWearCount(outfitId);
      setOutfits(prev =>
        prev.map(outfit => (outfit.id === outfitId ? updatedOutfit : outfit))
      );
    } catch (err) {
      console.error('Error marking outfit as worn:', err);
    }
  }, []);

  const deleteOutfit = useCallback(async (outfitId: string) => {
    try {
      setError(null);
      await deleteOutfitService(outfitId);
      setOutfits(prev => prev.filter(outfit => outfit.id !== outfitId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete outfit';
      setError(message);
      throw err;
    }
  }, []);

  return {
    outfits,
    loading,
    error,
    loadOutfits,
    createOutfit,
    generateOutfits,
    toggleFavorite,
    markAsWorn,
    deleteOutfit,
  };
}
