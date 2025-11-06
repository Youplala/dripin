import { ChatMessage, ChatContext, WardrobeItem } from '../../types/database';
import { AI_PROMPTS } from '../../utils/constants';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export async function chatWithStylist(
  message: string,
  context: ChatContext,
  wardrobeItems: WardrobeItem[],
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const wardrobeContext = wardrobeItems.map(item => ({
      id: item.id,
      category: item.category,
      subcategory: item.subcategory,
      colors: item.colors,
      style_tags: item.style_tags,
      occasions: item.occasions,
      description: item.ai_description,
    }));

    const systemContext = `
${AI_PROMPTS.STYLE_ASSISTANT}

User's Wardrobe:
${JSON.stringify(wardrobeContext, null, 2)}

${context.weather ? `Current Weather: ${context.weather.temp}°F, ${context.weather.condition}` : ''}
${context.recent_outfits ? `Recent Outfits: ${context.recent_outfits.join(', ')}` : ''}
    `.trim();

    const messages = [
      {
        role: 'system',
        content: systemContext,
      },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: 'user',
        content: message,
      },
    ];

    const response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in chat:', error);
    return "I'm having trouble connecting right now. Please try again!";
  }
}

// Mock function for testing
export async function chatWithStylistMock(
  message: string,
  context: ChatContext,
  wardrobeItems: WardrobeItem[]
): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const responses = [
    "Based on your wardrobe, I'd suggest pairing your blue jeans with that white t-shirt for a casual look!",
    "The weather looks great! How about wearing something light and comfortable today?",
    "I love your style! Let me help you create some new outfit combinations.",
    `You have ${wardrobeItems.length} items in your wardrobe. Let's make the most of them!`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

export async function getQuickSuggestion(
  type: 'today' | 'occasion' | 'item',
  wardrobeItems: WardrobeItem[],
  context?: ChatContext
): Promise<string> {
  const prompts = {
    today: "What should I wear today?",
    occasion: `I need an outfit for ${context?.user_query || 'an event'}`,
    item: `What can I wear with ${context?.user_query || 'this item'}?`,
  };

  return chatWithStylist(prompts[type], context || {}, wardrobeItems);
}
