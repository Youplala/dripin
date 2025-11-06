# DripIn - AI Wardrobe App

Your personal AI stylist in your pocket. DripIn helps you organize your wardrobe, get AI-powered outfit suggestions, and elevate your style with intelligent fashion advice.

## Features

### 🎨 Core Features
- **Digital Wardrobe**: Snap photos of your clothes and build a digital wardrobe
- **AI Tagging**: Automatic categorization, color detection, and style tagging using GPT-4 Vision
- **Smart Outfits**: AI-generated outfit combinations based on weather, occasion, and your style
- **Style Assistant**: Chat with your personal AI stylist for fashion advice
- **Weather Integration**: Get weather-appropriate outfit suggestions
- **Daily Notifications**: Receive personalized outfit recommendations every morning
- **Wear Tracking**: Track what you wear and discover underutilized items
- **Virtual Try-On**: Visualize outfits on yourself using AI image generation

### ✨ User Experience
- Beautiful glassmorphism UI design
- Smooth animations with React Native Reanimated
- Haptic feedback for interactions
- Real-time updates with Supabase
- Offline-ready architecture

## Tech Stack

- **Frontend**: React Native + Expo
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI/ML**:
  - OpenAI GPT-4 Vision (image tagging)
  - OpenAI GPT-4 (outfit generation & chat)
  - Google Gemini (virtual try-on)
- **State Management**: Zustand + Custom Hooks
- **Navigation**: React Navigation v6
- **Animations**: React Native Reanimated
- **Weather**: OpenWeatherMap API
- **Image Processing**: Background removal API

## Project Structure

```
/src
  /components
    /ui                  # Reusable UI components (Button, Card, Input, Modal)
    /shared             # Shared components (Camera, ImagePicker, etc.)
  /features
    /onboarding         # Onboarding flow screens
    /auth               # Authentication screens
    /wardrobe           # Wardrobe management screens
    /outfits            # Outfit creation and viewing
    /chat               # AI stylist chat interface
    /profile            # User profile and settings
  /services
    /supabase           # Database and storage services
    /ai                 # AI integration (tagging, generation, chat)
    /weather            # Weather API integration
    /notifications      # Push notifications
  /hooks                # Custom React hooks
  /types                # TypeScript type definitions
  /utils                # Helper functions and constants
  /navigation           # Navigation configuration
  /theme                # Design system (colors, typography, spacing)
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator
- Supabase account
- OpenAI API key
- (Optional) Google Gemini API key
- (Optional) OpenWeatherMap API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dripin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` with your API keys:
   - Get Supabase credentials from your [Supabase dashboard](https://supabase.com/dashboard)
   - Get OpenAI API key from [OpenAI platform](https://platform.openai.com/api-keys)
   - Get Weather API key from [OpenWeatherMap](https://openweathermap.org/api)

4. **Set up Supabase**

   See `SUPABASE_SETUP.md` for detailed instructions on:
   - Creating database tables
   - Setting up Row Level Security (RLS)
   - Configuring storage buckets
   - Setting up authentication

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on your device**
   - **iOS**: Press `i` or scan QR code with Camera app
   - **Android**: Press `a` or scan QR code with Expo Go app
   - **Web**: Press `w`

## Database Setup

### Tables

The app requires the following tables in Supabase:

1. **users** - User profiles and preferences
2. **wardrobe_items** - Clothing items with AI metadata
3. **outfits** - Saved outfit combinations
4. **wear_logs** - History of what was worn
5. **chat_messages** - Chat conversation history
6. **style_quiz_responses** - Onboarding quiz responses

### Storage Buckets

1. **wardrobe-images** - Original photos
2. **wardrobe-processed** - Background-removed images
3. **user-photos** - Profile pictures
4. **outfit-previews** - Generated outfit images

See `SUPABASE_SETUP.md` for complete SQL schema and RLS policies.

## Configuration

### AI Features

The app uses mock AI functions by default for testing. To enable real AI:

1. **Image Tagging**: Update `src/services/ai/tagging.ts` to use `tagWardrobeItem` instead of `tagWardrobeItemMock`
2. **Outfit Generation**: Update `src/services/ai/outfits.ts` to use real API
3. **Chat**: Update `src/services/ai/chat.ts` to use real API

### Notifications

Configure daily notification time in Settings:
- Default: 8:00 AM
- Provides personalized outfit suggestions
- Weather-aware recommendations

## Development

### Running Tests
```bash
npm test
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Building for Production

**iOS**:
```bash
eas build --platform ios
```

**Android**:
```bash
eas build --platform android
```

## Key Features Implementation

### AI Tagging Pipeline
1. User takes photo
2. Image uploaded to Supabase Storage
3. Background removed (optional)
4. Sent to GPT-4 Vision for analysis
5. Metadata extracted and saved to database

### Outfit Generation
1. Fetch user's wardrobe items
2. Consider context (weather, occasion, recent wears)
3. Send to GPT-4 with structured prompt
4. Receive outfit combinations
5. Display with reasoning and styling tips

### Chat Assistant
1. Maintains conversation context
2. Has access to user's wardrobe
3. Provides personalized advice
4. Can reference specific items by ID

## Troubleshooting

### Common Issues

**Supabase connection fails**
- Verify API URL and keys in `.env`
- Check network connectivity
- Ensure Supabase project is active

**Images not loading**
- Check storage bucket permissions
- Verify RLS policies allow read access
- Check image URLs are publicly accessible

**AI features not working**
- Verify OpenAI API key is valid
- Check API quota and limits
- Review console for error messages

**App crashes on startup**
- Clear Expo cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run type-check`

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Roadmap

- [ ] Social features (share outfits, follow stylists)
- [ ] Shopping integration (find similar items)
- [ ] Advanced analytics (cost per wear, style trends)
- [ ] Community outfit challenges
- [ ] Professional stylist consultations
- [ ] Augmented reality try-on
- [ ] Outfit calendar and planning
- [ ] Closet organization tips

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Email: support@dripin.app
- Twitter: @DripInApp

## Acknowledgments

- Design inspiration from modern fashion apps
- AI powered by OpenAI and Google
- Built with Expo and Supabase
- Icons from native emoji sets

---

Made with ❤️ by the DripIn team
