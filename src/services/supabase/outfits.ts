import { SupabaseService, supabase } from './client';
import { Outfit, WardrobeItem } from '../../types/database';

export const outfitService = new SupabaseService<Outfit>('outfits');

export async function createOutfit(
  userId: string,
  data: {
    name: string;
    item_ids: string[];
    occasion?: string;
    season?: string;
    ai_generated?: boolean;
    ai_reason?: string;
    vibe?: string;
  }
): Promise<Outfit> {
  return await outfitService.create({
    user_id: userId,
    favorite: false,
    times_worn: 0,
    ai_generated: data.ai_generated || false,
    ...data,
  } as any);
}

export async function getOutfitWithItems(outfitId: string): Promise<Outfit & { items: WardrobeItem[] }> {
  const outfit = await outfitService.getById(outfitId);
  if (!outfit) throw new Error('Outfit not found');

  // Fetch all items for this outfit
  const { data: items, error } = await supabase
    .from('wardrobe_items')
    .select('*')
    .in('id', outfit.item_ids);

  if (error) throw error;

  return {
    ...outfit,
    items: items || [],
  };
}

export async function toggleOutfitFavorite(outfitId: string): Promise<Outfit> {
  const outfit = await outfitService.getById(outfitId);
  if (!outfit) throw new Error('Outfit not found');

  return await outfitService.update(outfitId, {
    favorite: !outfit.favorite,
  } as any);
}

export async function incrementOutfitWearCount(outfitId: string): Promise<Outfit> {
  const outfit = await outfitService.getById(outfitId);
  if (!outfit) throw new Error('Outfit not found');

  return await outfitService.update(outfitId, {
    times_worn: outfit.times_worn + 1,
    last_worn: new Date().toISOString(),
  } as any);
}

export async function getOutfitsByOccasion(userId: string, occasion: string): Promise<Outfit[]> {
  return await outfitService.getAll(userId, { occasion });
}

export async function getFavoriteOutfits(userId: string): Promise<Outfit[]> {
  return await outfitService.getAll(userId, { favorite: true });
}

export async function getRecentlyWornOutfits(userId: string, limit: number = 5): Promise<Outfit[]> {
  const { data, error } = await supabase
    .from('outfits')
    .select('*')
    .eq('user_id', userId)
    .not('last_worn', 'is', null)
    .order('last_worn', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as Outfit[];
}

export async function getUnwornOutfits(userId: string): Promise<Outfit[]> {
  return await outfitService.getAll(userId, { times_worn: 0 });
}

export async function deleteOutfit(outfitId: string): Promise<void> {
  await outfitService.delete(outfitId);
}
