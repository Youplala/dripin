import { SupabaseService, uploadImage, deleteImage } from './client';
import { WardrobeItem } from '../../types/database';
import { STORAGE_BUCKETS } from '../../utils/constants';

export const wardrobeService = new SupabaseService<WardrobeItem>('wardrobe_items');

export async function addWardrobeItem(
  userId: string,
  imageUri: string,
  metadata: Omit<WardrobeItem, 'id' | 'user_id' | 'created_at' | 'image_url' | 'times_worn'>
): Promise<WardrobeItem> {
  try {
    // Upload original image
    const imageBlob = await uriToBlob(imageUri);
    const imagePath = `${userId}/${Date.now()}.jpg`;
    const imageUrl = await uploadImage(
      STORAGE_BUCKETS.WARDROBE_IMAGES,
      imagePath,
      imageBlob
    );

    // Create wardrobe item
    const item = await wardrobeService.create({
      user_id: userId,
      image_url: imageUrl,
      times_worn: 0,
      ...metadata,
    } as any);

    return item;
  } catch (error) {
    console.error('Error adding wardrobe item:', error);
    throw error;
  }
}

export async function updateWardrobeItemBackground(
  itemId: string,
  processedImageUri: string,
  userId: string
): Promise<WardrobeItem> {
  const imageBlob = await uriToBlob(processedImageUri);
  const imagePath = `${userId}/${Date.now()}_no_bg.png`;
  const processedUrl = await uploadImage(
    STORAGE_BUCKETS.WARDROBE_PROCESSED,
    imagePath,
    imageBlob,
    'image/png'
  );

  return await wardrobeService.update(itemId, {
    image_no_bg_url: processedUrl,
  } as any);
}

export async function deleteWardrobeItem(itemId: string): Promise<void> {
  const item = await wardrobeService.getById(itemId);
  if (!item) throw new Error('Item not found');

  // Delete images from storage
  try {
    const imagePath = item.image_url.split('/').pop();
    if (imagePath) {
      await deleteImage(STORAGE_BUCKETS.WARDROBE_IMAGES, imagePath);
    }

    if (item.image_no_bg_url) {
      const processedPath = item.image_no_bg_url.split('/').pop();
      if (processedPath) {
        await deleteImage(STORAGE_BUCKETS.WARDROBE_PROCESSED, processedPath);
      }
    }
  } catch (error) {
    console.error('Error deleting images:', error);
  }

  // Delete database record
  await wardrobeService.delete(itemId);
}

export async function incrementWearCount(itemId: string): Promise<WardrobeItem> {
  const item = await wardrobeService.getById(itemId);
  if (!item) throw new Error('Item not found');

  return await wardrobeService.update(itemId, {
    times_worn: item.times_worn + 1,
    last_worn: new Date().toISOString(),
  } as any);
}

export async function getWardrobeStats(userId: string) {
  const items = await wardrobeService.getAll(userId);

  const stats = {
    total: items.length,
    byCategory: {} as Record<string, number>,
    byColor: {} as Record<string, number>,
    byStyle: {} as Record<string, number>,
    mostWorn: items.sort((a, b) => b.times_worn - a.times_worn).slice(0, 5),
    leastWorn: items.filter(i => i.times_worn === 0),
    recentlyAdded: items.slice(0, 10),
  };

  items.forEach(item => {
    // Category stats
    stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;

    // Color stats
    item.colors.forEach(color => {
      stats.byColor[color] = (stats.byColor[color] || 0) + 1;
    });

    // Style stats
    item.style_tags.forEach(style => {
      stats.byStyle[style] = (stats.byStyle[style] || 0) + 1;
    });
  });

  return stats;
}

// Helper function to convert URI to Blob
async function uriToBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri);
  return await response.blob();
}
