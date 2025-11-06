# DripIn - Quick Start Guide

Welcome to DripIn! This guide will get you up and running in 10 minutes.

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env
```

Then edit `.env` and add your Supabase credentials (see below).

### 3. Start the App
```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## 🔑 Getting API Keys

### Supabase (Required)
1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project
3. Copy URL and anon key to `.env`
4. Run the SQL from `SUPABASE_SETUP.md` in SQL Editor
5. Create storage buckets as described in setup guide

### Optional API Keys (for full functionality)

**OpenAI** (for real AI tagging/generation):
- Get key from [platform.openai.com](https://platform.openai.com)
- Add to `EXPO_PUBLIC_OPENAI_API_KEY`

**OpenWeatherMap** (for weather features):
- Get free key from [openweathermap.org](https://openweathermap.org/api)
- Add to `EXPO_PUBLIC_WEATHER_API_KEY`

## 🧪 Testing Without API Keys

The app works with **mock AI services** by default! You can:
- ✅ Add wardrobe items (with mock tagging)
- ✅ Generate outfits (with mock AI)
- ✅ Chat with stylist (with mock responses)
- ✅ All UI features work perfectly

This is great for:
- Testing the app
- UI/UX development
- Demoing features

## 📱 First Launch

1. **Sign Up**: Create account with any email/password
2. **Onboarding**: Swipe through intro screens
3. **Add Items**: Click "Add Item" and upload photos
4. **Generate Outfits**: Once you have 3+ items, click "Generate Outfits"
5. **Chat**: Ask the AI stylist for advice!

## 🎨 Features Available

### ✅ Fully Implemented
- **Authentication**: Email/password sign in/up
- **Wardrobe Management**: Add, view, filter, delete items
- **AI Tagging**: Automatic categorization (mock mode works!)
- **Outfit Generation**: AI creates outfits from your wardrobe
- **Chat Assistant**: Talk to your AI stylist
- **Profile**: View stats and settings
- **Onboarding**: Beautiful intro flow
- **Real-time Updates**: Thanks to Supabase
- **Beautiful UI**: Glassmorphic design with animations

### 🔄 Using Mock Services (Testing Mode)
By default, the app uses mock AI services:
- `tagWardrobeItemMock` in `src/services/ai/tagging.ts`
- `generateOutfitsMock` in `src/services/ai/outfits.ts`
- `chatWithStylistMock` in `src/services/ai/chat.ts`

These return realistic mock data instantly without API calls!

### 🚀 Enabling Real AI
To use real OpenAI APIs:

1. Add `EXPO_PUBLIC_OPENAI_API_KEY` to `.env`

2. Update hook calls to use real functions:
   ```typescript
   // In useWardrobe.ts
   import { tagWardrobeItem } from '../services/ai/tagging';
   // Instead of tagWardrobeItemMock

   // In useOutfits.ts
   import { generateOutfits } from '../services/ai/outfits';
   // Instead of generateOutfitsMock

   // In ChatScreen.tsx
   import { chatWithStylist } from '../../services/ai/chat';
   // Instead of chatWithStylistMock
   ```

## 🎯 Recommended Testing Flow

1. **Create Account**: Sign up with test email
2. **Complete Onboarding**: Go through the intro
3. **Add 5-10 Items**: Use your own photos or sample images
4. **Test Filters**: Try category filtering in Wardrobe
5. **Generate Outfits**: Should work with 3+ items
6. **Test Chat**: Ask questions like "What should I wear today?"
7. **Check Profile**: View your wardrobe statistics
8. **Test Favorites**: Mark outfits as favorites

## 🐛 Troubleshooting

### App Won't Start
```bash
# Clear cache and restart
npx expo start -c
```

### Database Errors
- Check Supabase credentials in `.env`
- Run SQL schema from `SUPABASE_SETUP.md`
- Verify RLS policies are enabled

### Images Not Uploading
- Check storage buckets exist in Supabase
- Verify bucket permissions (should be public)
- Check storage policies are created

### Build Errors
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## 📚 Next Steps

1. **Read Full README**: See `README.md` for complete docs
2. **Set Up Database**: Follow `SUPABASE_SETUP.md` carefully
3. **Customize**: Modify theme in `src/theme/index.ts`
4. **Add Features**: See `CONTRIBUTING.md` for guidelines

## 💡 Pro Tips

- **Mock Mode**: Perfect for demos and testing UI
- **Image Quality**: The app compresses images automatically
- **Offline**: Some features work offline with cached data
- **Performance**: Use React DevTools to monitor performance

## 🎨 Customization

### Change Theme Colors
Edit `src/theme/index.ts`:
```typescript
colors: {
  primary: '#007AFF', // Change this!
  // ...
}
```

### Adjust Animations
Edit animation settings in theme:
```typescript
animations: {
  spring: {
    damping: 15, // Adjust bounce
    stiffness: 100, // Adjust speed
  }
}
```

## 🤝 Need Help?

- Check `README.md` for detailed info
- Review `SUPABASE_SETUP.md` for database setup
- Open an issue on GitHub
- Join our Discord (coming soon!)

## 🎉 You're Ready!

The app is fully functional with mock services. Enjoy exploring!

To enable production features:
1. Add OpenAI API key
2. Switch from mock to real AI functions
3. Add weather API for weather-based outfits
4. Deploy to App Store / Play Store

Happy styling! ✨
