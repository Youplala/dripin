export interface User {
  id: string;
  email: string;
  created_at: string;
  onboarding_completed: boolean;
  style_preferences?: StylePreferences;
  notification_time?: string;
  photo_url?: string;
}

export interface StylePreferences {
  styles: string[];
  occasions: string[];
  colors: string[];
  climate?: string;
  goals: string[];
}

export type Category = 'tops' | 'bottoms' | 'shoes' | 'accessories' | 'outerwear';

export type Season = 'spring' | 'summer' | 'fall' | 'winter';

export interface WardrobeItem {
  id: string;
  user_id: string;
  image_url: string;
  image_no_bg_url?: string;
  category: Category;
  subcategory?: string;
  colors: string[];
  style_tags: string[];
  season: Season[];
  occasions: string[];
  brand?: string;
  times_worn: number;
  last_worn?: string;
  created_at: string;
  ai_description?: string;
}

export interface Outfit {
  id: string;
  user_id: string;
  name: string;
  item_ids: string[];
  items?: WardrobeItem[];
  ai_generated: boolean;
  occasion?: string;
  season?: Season;
  times_worn: number;
  last_worn?: string;
  favorite: boolean;
  created_at: string;
  thumbnail_url?: string;
  ai_reason?: string;
  vibe?: string;
}

export interface WearLog {
  id: string;
  user_id: string;
  outfit_id?: string;
  item_ids: string[];
  worn_date: string;
  weather?: Weather;
  rating?: number;
  notes?: string;
}

export interface Weather {
  temp: number;
  condition: string;
  description: string;
  icon?: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  context?: ChatContext;
  created_at: string;
}

export interface ChatContext {
  wardrobe_items?: string[];
  weather?: Weather;
  recent_outfits?: string[];
  user_query?: string;
}

export interface StyleQuizResponse {
  id: string;
  user_id: string;
  question_id: string;
  answer: any;
  created_at: string;
}

export interface AITaggingResponse {
  category: Category;
  subcategory: string;
  colors: string[];
  style_tags: string[];
  season: Season[];
  occasions: string[];
  description: string;
}

export interface OutfitGenerationContext {
  weather?: Weather;
  occasion?: string;
  recently_worn?: string[];
  style_preferences?: string[];
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      wardrobe_items: {
        Row: WardrobeItem;
        Insert: Omit<WardrobeItem, 'id' | 'created_at' | 'times_worn'>;
        Update: Partial<Omit<WardrobeItem, 'id' | 'created_at' | 'user_id'>>;
      };
      outfits: {
        Row: Outfit;
        Insert: Omit<Outfit, 'id' | 'created_at' | 'times_worn'>;
        Update: Partial<Omit<Outfit, 'id' | 'created_at' | 'user_id'>>;
      };
      wear_logs: {
        Row: WearLog;
        Insert: Omit<WearLog, 'id'>;
        Update: Partial<Omit<WearLog, 'id' | 'user_id'>>;
      };
      chat_messages: {
        Row: ChatMessage;
        Insert: Omit<ChatMessage, 'id' | 'created_at'>;
        Update: Partial<Omit<ChatMessage, 'id' | 'created_at' | 'user_id'>>;
      };
      style_quiz_responses: {
        Row: StyleQuizResponse;
        Insert: Omit<StyleQuizResponse, 'id' | 'created_at'>;
        Update: Partial<Omit<StyleQuizResponse, 'id' | 'created_at' | 'user_id'>>;
      };
    };
  };
}
