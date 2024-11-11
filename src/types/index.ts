export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  cover_url: string | null;
  audio_url: string | null;
  audio_duration: number | null;
  audio_format: string | null;
  audio_size: number | null;
  category_id: string;
  category?: Category;
  created_at: string;
}

export interface AudioProgress {
  id: string;
  user_id: string;
  book_id: string;
  current_position: number;
  playback_speed: number;
  volume: number;
  last_played_at: string;
  completed_at: string | null;
  is_completed: boolean;
  total_listen_time: number;
  progress_percentage: number;
}

export interface FinishedBook {
  id: string;
  user_id: string;
  book_id: string;
  completed_at: string;
  total_listen_time: number;
  rating?: number;
  review?: string;
  book?: Book & { category: Category };
}

export interface Playlist {
  id: string;
  title: string;
  subtitle: string;
  description: string | null;
  cover_url: string | null;
  background_color: string;
  accent_color?: string;
  slug: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  books?: (Book & { category: Category })[];
}