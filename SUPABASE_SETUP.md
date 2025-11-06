# Supabase Setup Guide

This guide will help you set up the Supabase backend for DripIn.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Fill in project details:
   - Name: dripin
   - Database Password: (save this securely)
   - Region: Choose closest to your users
4. Click "Create new project" and wait for provisioning

## 2. Get API Credentials

1. Go to Project Settings → API
2. Copy the following to your `.env` file:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## 3. Create Database Tables

Go to the SQL Editor in your Supabase dashboard and run the following SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  style_preferences JSONB,
  notification_time TIME DEFAULT '08:00:00',
  photo_url TEXT
);

-- Wardrobe items table
CREATE TABLE wardrobe_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  image_no_bg_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('tops', 'bottoms', 'shoes', 'accessories', 'outerwear')),
  subcategory TEXT,
  colors TEXT[] NOT NULL DEFAULT '{}',
  style_tags TEXT[] NOT NULL DEFAULT '{}',
  season TEXT[] NOT NULL DEFAULT '{}',
  occasions TEXT[] NOT NULL DEFAULT '{}',
  brand TEXT,
  times_worn INTEGER DEFAULT 0,
  last_worn TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ai_description TEXT
);

-- Outfits table
CREATE TABLE outfits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  item_ids UUID[] NOT NULL DEFAULT '{}',
  ai_generated BOOLEAN DEFAULT FALSE,
  occasion TEXT,
  season TEXT,
  times_worn INTEGER DEFAULT 0,
  last_worn TIMESTAMP WITH TIME ZONE,
  favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  thumbnail_url TEXT,
  ai_reason TEXT,
  vibe TEXT
);

-- Wear logs table
CREATE TABLE wear_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  outfit_id UUID REFERENCES outfits(id) ON DELETE SET NULL,
  item_ids UUID[] NOT NULL DEFAULT '{}',
  worn_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weather JSONB,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Style quiz responses table
CREATE TABLE style_quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  question_id TEXT NOT NULL,
  answer JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_wardrobe_items_user_id ON wardrobe_items(user_id);
CREATE INDEX idx_wardrobe_items_category ON wardrobe_items(category);
CREATE INDEX idx_outfits_user_id ON outfits(user_id);
CREATE INDEX idx_outfits_favorite ON outfits(user_id, favorite) WHERE favorite = TRUE;
CREATE INDEX idx_wear_logs_user_id ON wear_logs(user_id);
CREATE INDEX idx_wear_logs_worn_date ON wear_logs(user_id, worn_date DESC);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id, created_at DESC);
```

## 4. Set Up Row Level Security (RLS)

Enable RLS and create policies for each table:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE wear_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_quiz_responses ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Wardrobe items policies
CREATE POLICY "Users can view own wardrobe items"
  ON wardrobe_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wardrobe items"
  ON wardrobe_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wardrobe items"
  ON wardrobe_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wardrobe items"
  ON wardrobe_items FOR DELETE
  USING (auth.uid() = user_id);

-- Outfits policies
CREATE POLICY "Users can view own outfits"
  ON outfits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own outfits"
  ON outfits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own outfits"
  ON outfits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own outfits"
  ON outfits FOR DELETE
  USING (auth.uid() = user_id);

-- Wear logs policies
CREATE POLICY "Users can view own wear logs"
  ON wear_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wear logs"
  ON wear_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wear logs"
  ON wear_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wear logs"
  ON wear_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can view own chat messages"
  ON chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Style quiz responses policies
CREATE POLICY "Users can view own quiz responses"
  ON style_quiz_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz responses"
  ON style_quiz_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## 5. Create Storage Buckets

1. Go to Storage in your Supabase dashboard
2. Create the following buckets:

### Bucket: wardrobe-images
- **Public**: Yes
- **File size limit**: 10 MB
- **Allowed MIME types**: image/jpeg, image/png, image/jpg

### Bucket: wardrobe-processed
- **Public**: Yes
- **File size limit**: 10 MB
- **Allowed MIME types**: image/png

### Bucket: user-photos
- **Public**: Yes
- **File size limit**: 10 MB
- **Allowed MIME types**: image/jpeg, image/png, image/jpg

### Bucket: outfit-previews
- **Public**: Yes
- **File size limit**: 10 MB
- **Allowed MIME types**: image/jpeg, image/png, image/jpg

## 6. Set Up Storage Policies

For each bucket, add the following policies:

```sql
-- Replace 'bucket_name' with actual bucket name (wardrobe-images, etc.)

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'bucket_name');

-- Allow users to view their own files
CREATE POLICY "Users can view own files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'bucket_name');

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'bucket_name');

-- Allow public read access (since buckets are public)
CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'bucket_name');
```

## 7. Configure Authentication

1. Go to Authentication → Settings
2. Enable Email auth
3. (Optional) Configure OAuth providers:
   - Google
   - Apple
   - GitHub

### Email Templates

Customize the email templates under Authentication → Email Templates:
- Confirm signup
- Reset password
- Magic link

## 8. Set Up Real-time Subscriptions

Real-time is enabled by default for all tables. To optimize:

1. Go to Database → Replication
2. Enable replication for:
   - wardrobe_items
   - outfits
   - chat_messages

## 9. Testing Your Setup

Run these queries in the SQL Editor to verify setup:

```sql
-- Check if tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- Verify RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Check storage buckets
SELECT * FROM storage.buckets;
```

## 10. Environment Variables

Add these to your `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Troubleshooting

### Issue: RLS blocks all queries
- Check that policies are created correctly
- Verify `auth.uid()` is available
- Ensure user is authenticated

### Issue: Storage upload fails
- Check bucket exists and is public
- Verify storage policies are created
- Check file size limits

### Issue: Real-time not working
- Enable replication for tables
- Check network connectivity
- Verify subscription code

## Next Steps

- Import sample data for testing
- Set up database backups
- Configure rate limiting
- Monitor usage in dashboard

## Support

For Supabase-specific issues:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)
