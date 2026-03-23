export type ContentType = 'movie' | 'series' | 'live';

export interface Content {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  backdrop_url: string;
  type: 'movie' | 'series' | 'live';
  genre: string[];
  rating: string;
  year: number;
  duration?: string;
  is_premium: boolean;
  is_featured: boolean;
  view_count: number;
  mux_asset_id?: string;
  mux_playback_id?: string;
  language: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_plan: 'free' | 'basic' | 'premium';
  subscription_valid_until?: string;
}
