# Garde Streaming Platform - Setup Guide

## ✅ Completed Steps
- [x] Environment variables configured
- [x] Dependencies installed  
- [x] Development server running on http://localhost:3000
- [x] Mux and Supabase credentials added

## ⚠️ Before You Can Use the App

### Step 1: Create Supabase Database Tables

You need to create the following table in your Supabase project:

1. Go to: https://app.supabase.com
2. Select Project: `zqrnyuyxbfrhxqfnfssl`
3. Go to **SQL Editor** → Click **New Query**
4. Copy and run this SQL:

```sql
-- Create content table
CREATE TABLE IF NOT EXISTS content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url VARCHAR(2048),
  backdrop_url VARCHAR(2048),
  type VARCHAR(50) CHECK (type IN ('movie', 'series', 'live')),
  genre TEXT[] DEFAULT '{}',
  rating VARCHAR(10),
  year INTEGER,
  duration VARCHAR(50),
  is_premium BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  mux_asset_id VARCHAR(255),
  mux_playback_id VARCHAR(255),
  language VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

-- Enable RLS (Row Level Security)
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "content is viewable by everyone" ON content
  FOR SELECT USING (true);

CREATE POLICY "users can view their own watchlist" ON watchlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users can add to their own watchlist" ON watchlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users can remove from their own watchlist" ON watchlist
  FOR DELETE USING (auth.uid() = user_id);
```

5. Click **Run** to create the tables

### Step 2: Configure Supabase Auth Settings

1. Go to **Authentication** → **Providers** → **Email**
2. Enable **Email/Password** and **Email OTP**
3. Go to **Authentication** → **URL Configuration**
4. Add URL: `http://localhost:3000`

### Step 3: Initialize Sample Data

Once tables are created:
1. Open http://localhost:3000 in your browser
2. Click **"Initialize Library"** button
3. The sample content will be seeded to your database

## 🎯 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend | ✅ Running | http://localhost:3000 |
| Database | ❌ Needs Setup | Create tables from SQL above |
| Authentication | ⚠️ Ready | Needs URL configuration |
| Video Streaming | ✅ Ready | Mux tokens configured |
| Search & Browse | ⚠️ Ready | Works after DB setup |

## 🚀 After Setup

Once tables are created and seeded:
- Browse movies and series
- Add to watchlist (after signing in)
- Stream videos with Mux player
- Search content by title

## 📞 Troubleshooting

**Error: "Supabase credentials missing"**
- Verify .env.local has correct NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

**Error: "relation 'content' does not exist"**
- Run the SQL setup from Step 1

**Error: "Failed to fetch" in login**
- Ensure Email OTP is enabled in Supabase Authentication settings

**Videos not playing**
- Verify MUX_TOKEN_ID and MUX_TOKEN_SECRET are correct
- See SOURCES.txt for debug info
