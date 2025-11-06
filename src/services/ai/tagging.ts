import { AITaggingResponse } from '../../types/database';
import { AI_PROMPTS } from '../../utils/constants';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export async function tagWardrobeItem(imageUrl: string): Promise<AITaggingResponse> {
  try {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: AI_PROMPTS.TAG_ITEM,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return {
      category: result.category || 'tops',
      subcategory: result.subcategory || 'Unknown',
      colors: result.colors || ['Unknown'],
      style_tags: result.style_tags || ['Casual'],
      season: result.season || ['spring', 'summer', 'fall', 'winter'],
      occasions: result.occasions || ['Casual'],
      description: result.description || '',
    };
  } catch (error) {
    console.error('Error tagging item:', error);

    // Return default values if AI fails
    return {
      category: 'tops',
      subcategory: 'Unknown',
      colors: ['Unknown'],
      style_tags: ['Casual'],
      season: ['spring', 'summer', 'fall', 'winter'],
      occasions: ['Casual'],
      description: 'Unable to analyze item',
    };
  }
}

// Mock function for testing without API key
export async function tagWardrobeItemMock(imageUrl: string): Promise<AITaggingResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    category: 'tops',
    subcategory: 'T-Shirt',
    colors: ['Blue', 'White'],
    style_tags: ['Casual', 'Comfortable'],
    season: ['spring', 'summer', 'fall'],
    occasions: ['Casual', 'Weekend'],
    description: 'A casual blue and white t-shirt perfect for everyday wear',
  };
}
