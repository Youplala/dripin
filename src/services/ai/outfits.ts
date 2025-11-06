import { WardrobeItem, OutfitGenerationContext, Weather } from '../../types/database';
import { AI_PROMPTS } from '../../utils/constants';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

interface OutfitSuggestion {
  item_ids: string[];
  reason: string;
  vibe: string;
}

export async function generateOutfits(
  items: WardrobeItem[],
  context: OutfitGenerationContext
): Promise<OutfitSuggestion[]> {
  try {
    const wardrobeContext = items.map(item => ({
      id: item.id,
      category: item.category,
      subcategory: item.subcategory,
      colors: item.colors,
      style_tags: item.style_tags,
      season: item.season,
      occasions: item.occasions,
      times_worn: item.times_worn,
    }));

    const contextString = `
Wardrobe Items: ${JSON.stringify(wardrobeContext, null, 2)}
Weather: ${context.weather ? `${context.weather.temp}°F, ${context.weather.condition}` : 'Not specified'}
Occasion: ${context.occasion || 'Any'}
Recently Worn Items: ${context.recently_worn?.join(', ') || 'None'}
Style Preferences: ${context.style_preferences?.join(', ') || 'Any'}
    `.trim();

    const response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a professional fashion stylist. Create complete, wearable outfits from the user\'s wardrobe.',
          },
          {
            role: 'user',
            content: AI_PROMPTS.GENERATE_OUTFITS(contextString),
          },
        ],
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return result.outfits || result || [];
  } catch (error) {
    console.error('Error generating outfits:', error);
    return generateOutfitsMock(items, context);
  }
}

// Mock function for testing
export async function generateOutfitsMock(
  items: WardrobeItem[],
  context: OutfitGenerationContext
): Promise<OutfitSuggestion[]> {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const tops = items.filter(i => i.category === 'tops');
  const bottoms = items.filter(i => i.category === 'bottoms');
  const shoes = items.filter(i => i.category === 'shoes');

  const outfits: OutfitSuggestion[] = [];

  for (let i = 0; i < Math.min(3, tops.length); i++) {
    const outfit: OutfitSuggestion = {
      item_ids: [tops[i].id],
      reason: `Perfect for ${context.occasion || 'any occasion'}`,
      vibe: 'Stylish',
    };

    if (bottoms.length > 0) {
      outfit.item_ids.push(bottoms[i % bottoms.length].id);
    }

    if (shoes.length > 0) {
      outfit.item_ids.push(shoes[i % shoes.length].id);
    }

    outfits.push(outfit);
  }

  return outfits.slice(0, 3);
}

export async function getOutfitRecommendation(
  items: WardrobeItem[],
  weather?: Weather,
  occasion?: string
): Promise<OutfitSuggestion | null> {
  const outfits = await generateOutfits(items, {
    weather,
    occasion,
  });

  return outfits.length > 0 ? outfits[0] : null;
}
