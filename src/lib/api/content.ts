import { supabase } from '../supabase';
import { Content } from '../../types';

// Client side functions
export async function getTrendingContent(): Promise<Content[]> {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .order('view_count', { ascending: false })
    .limit(10);
  if (error) throw error;
  return data as Content[];
}

export async function getNewReleases(): Promise<Content[]> {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  if (error) throw error;
  return data as Content[];
}

export async function getContentByType(type: 'movie' | 'series'): Promise<Content[]> {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('type', type)
    .order('view_count', { ascending: false })
    .limit(10);
  if (error) throw error;
  return data as Content[];
}

export async function getContentById(id: string): Promise<Content | null> {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as Content;
}

export async function searchContent(query: string): Promise<Content[]> {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(20);
  if (error) throw error;
  return data as Content[];
}

export async function getFeaturedContent(): Promise<Content | null> {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('is_featured', true)
    .single();
  if (error) return null;
  return data as Content;
}

export async function seedDatabase() {
  const now = new Date().toISOString();
  const sampleContent = [
    {
      title: "Sintel",
      description: "A young woman named Sintel is searching for her baby dragon, Scales. She finds him being taken away by an adult dragon and sets out on a journey to rescue him.",
      thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Sintel_poster.jpg/800px-Sintel_poster.jpg",
      backdrop_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Sintel_01.15.00.png/1280px-Sintel_01.15.00.png",
      type: "movie",
      genre: ["Animation", "Fantasy", "Adventure"],
      rating: "4.8",
      year: 2010,
      duration: "15m",
      is_premium: false,
      is_featured: true,
      view_count: 1500,
      mux_playback_id: "6fiS00pS49Z6Y4q01S4pY5S02N6reD0088",
      language: "English",
      created_at: now
    },
    {
      title: "Tears of Steel",
      description: "In a future where robots have taken over, a group of scientists and soldiers try to stop the machines using ancient technology.",
      thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Tears_of_Steel_poster.jpg/800px-Tears_of_Steel_poster.jpg",
      backdrop_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Tears_of_Steel_-_Shot_01.png/1280px-Tears_of_Steel_-_Shot_01.png",
      type: "movie",
      genre: ["Sci-Fi", "Action"],
      rating: "4.5",
      year: 2012,
      duration: "12m",
      is_premium: true,
      is_featured: false,
      view_count: 1200,
      mux_playback_id: "v69R01990199020120102010201020102010201",
      language: "English",
      created_at: now
    },
    {
      title: "Big Buck Bunny",
      description: "A large, lovable rabbit deals with three mischievous squirrels who are bullying him and his forest friends.",
      thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_Buck_Bunny_Poster_2008.png/800px-Big_Buck_Bunny_Poster_2008.png",
      backdrop_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Big_Buck_Bunny_Screenshot_01.png/1280px-Big_Buck_Bunny_Screenshot_01.png",
      type: "movie",
      genre: ["Animation", "Comedy"],
      rating: "4.2",
      year: 2008,
      duration: "10m",
      is_premium: false,
      is_featured: false,
      view_count: 2000,
      mux_playback_id: "0201020102010201020102010201020102010201",
      language: "English",
      created_at: now
    },
    {
      title: "Cosmos Laundromat",
      description: "On a desolate island, a suicidal sheep named Franck meets a mysterious salesman who offers him a way out of his misery.",
      thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Cosmos_Laundromat_poster.jpg/800px-Cosmos_Laundromat_poster.jpg",
      backdrop_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Cosmos_Laundromat_-_Franck_and_Victor.png/1280px-Cosmos_Laundromat_-_Franck_and_Victor.png",
      type: "series",
      genre: ["Animation", "Fantasy", "Sci-Fi"],
      rating: "4.9",
      year: 2015,
      duration: "12m",
      is_premium: true,
      is_featured: false,
      view_count: 800,
      mux_playback_id: "0301030103010301030103010301030103010301",
      language: "English",
      created_at: now
    }
  ];

  console.log('[Seeding] Starting database seed with', sampleContent.length, 'items...');

  const { data, error } = await supabase
    .from('content')
    .insert(sampleContent);
  
  if (error) {
    console.error('[Seeding] Error:', error);
    throw new Error(`Database seeding failed: ${error.message}. Make sure the 'content' table exists in Supabase. See SETUP_GUIDE.md for instructions.`);
  }
  
  console.log('[Seeding] Successfully inserted', sampleContent.length, 'items');
  return data;
}
