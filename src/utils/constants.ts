export const CATEGORIES = {
  tops: 'Tops',
  bottoms: 'Bottoms',
  shoes: 'Shoes',
  accessories: 'Accessories',
  outerwear: 'Outerwear',
} as const;

export const SEASONS = {
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall',
  winter: 'Winter',
} as const;

export const STYLE_TAGS = [
  'Casual',
  'Formal',
  'Sporty',
  'Elegant',
  'Streetwear',
  'Vintage',
  'Minimalist',
  'Bohemian',
  'Professional',
  'Trendy',
  'Classic',
  'Edgy',
  'Romantic',
  'Preppy',
  'Grunge',
] as const;

export const OCCASIONS = [
  'Work',
  'Casual',
  'Party',
  'Gym',
  'Beach',
  'Formal Event',
  'Date Night',
  'Travel',
  'Outdoor',
  'Wedding',
  'Meeting',
  'Weekend',
  'Brunch',
  'Concert',
  'Shopping',
] as const;

export const COLORS = [
  'Black',
  'White',
  'Gray',
  'Red',
  'Blue',
  'Navy',
  'Green',
  'Yellow',
  'Orange',
  'Pink',
  'Purple',
  'Brown',
  'Beige',
  'Cream',
  'Burgundy',
  'Olive',
  'Teal',
  'Coral',
  'Gold',
  'Silver',
] as const;

export const ONBOARDING_QUESTIONS = [
  {
    id: 'style_preference',
    question: 'What\'s your style?',
    type: 'image_grid',
    options: [
      { id: 'casual', label: 'Casual' },
      { id: 'formal', label: 'Formal' },
      { id: 'sporty', label: 'Sporty' },
      { id: 'elegant', label: 'Elegant' },
      { id: 'streetwear', label: 'Streetwear' },
      { id: 'minimalist', label: 'Minimalist' },
    ],
  },
  {
    id: 'occasions',
    question: 'Where do you typically dress for?',
    type: 'multi_select',
    options: OCCASIONS.map(o => ({ id: o.toLowerCase().replace(/\s+/g, '_'), label: o })),
  },
  {
    id: 'colors',
    question: 'Favorite colors?',
    type: 'color_palette',
    options: COLORS.map(c => ({ id: c.toLowerCase(), label: c, color: c })),
  },
  {
    id: 'climate',
    question: 'What\'s your climate like?',
    type: 'single_select',
    options: [
      { id: 'tropical', label: 'Tropical', icon: '🌴' },
      { id: 'temperate', label: 'Temperate', icon: '🍂' },
      { id: 'cold', label: 'Cold', icon: '❄️' },
      { id: 'dry', label: 'Dry', icon: '🌵' },
      { id: 'varied', label: 'Varied', icon: '🌦️' },
    ],
  },
  {
    id: 'goals',
    question: 'What are your wardrobe goals?',
    type: 'multi_select',
    options: [
      { id: 'organize', label: 'Organize my closet', icon: '📦' },
      { id: 'discover', label: 'Discover new combinations', icon: '✨' },
      { id: 'elevate', label: 'Elevate my style', icon: '👔' },
      { id: 'minimize', label: 'Build a capsule wardrobe', icon: '🎯' },
      { id: 'shop', label: 'Shop smarter', icon: '🛍️' },
      { id: 'sustainable', label: 'Be more sustainable', icon: '♻️' },
    ],
  },
];

export const STORAGE_BUCKETS = {
  WARDROBE_IMAGES: 'wardrobe-images',
  WARDROBE_PROCESSED: 'wardrobe-processed',
  USER_PHOTOS: 'user-photos',
  OUTFIT_PREVIEWS: 'outfit-previews',
} as const;

export const PERMISSIONS = {
  CAMERA: 'camera',
  NOTIFICATIONS: 'notifications',
  LOCATION: 'location',
} as const;

export const AI_PROMPTS = {
  TAG_ITEM: `Analyze this clothing item carefully and return a JSON object with the following structure:
{
  "category": "tops|bottoms|shoes|accessories|outerwear",
  "subcategory": "specific type (e.g., t-shirt, jeans, sneakers)",
  "colors": ["primary color", "secondary color"],
  "style_tags": ["2-4 style tags like casual, formal, sporty"],
  "season": ["appropriate seasons"],
  "occasions": ["suitable occasions"],
  "description": "brief 1-sentence description"
}

Be specific and accurate. Focus on what makes this item unique.`,

  GENERATE_OUTFITS: (context: string) => `Given this wardrobe and context:
${context}

Generate 3 complete outfit combinations. Return as JSON array:
[{
  "item_ids": ["id1", "id2", "id3"],
  "reason": "why this outfit works (weather, occasion, style)",
  "vibe": "one-word vibe (e.g., Sophisticated, Relaxed, Bold)"
}]

Ensure outfits:
- Match the weather/occasion
- Include items from different categories
- Haven't been recently worn
- Reflect user's style preferences`,

  STYLE_ASSISTANT: `You are a personal fashion stylist with access to the user's complete wardrobe.

Your capabilities:
- Suggest specific outfits using item IDs from their collection
- Provide styling advice based on their wardrobe
- Answer questions about outfit combinations
- Help them discover new ways to wear their clothes
- Consider weather, occasion, and their style preferences

Be encouraging, creative, and specific. Always reference actual items from their wardrobe when making suggestions.`,

  VIRTUAL_TRY_ON: (outfit: string) => `Generate a realistic fashion photograph of a person wearing:
${outfit}

Requirements:
- Professional fashion photography style
- Natural lighting
- Full outfit clearly visible
- Maintain realistic proportions and fit
- Show outfit from front view
- Clean background`,
};
