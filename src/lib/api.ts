import { supabase } from './supabase';
import { Book, Category, AudioProgress, UserProfile, Playlist } from '../types';

// Books API
export const booksApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('books')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as (Book & { category: Category })[];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('books')
      .select('*, category:categories(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Book & { category: Category };
  }
};

// Audio Progress API
export const audioApi = {
  getProgress: async (userId: string, bookId: string): Promise<AudioProgress | null> => {
    try {
      const { data, error } = await supabase
        .from('audio_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching progress:', error);
        return null;
      }

      return data as AudioProgress | null;
    } catch (error) {
      console.error('Error in getProgress:', error);
      return null;
    }
  },

  getUserProgress: async (userId: string) => {
    try {
      const { data: progressData, error: progressError } = await supabase
        .from('audio_progress')
        .select('*')
        .eq('user_id', userId);
      
      if (progressError) throw progressError;

      const { count: completedCount, error: countError } = await supabase
        .from('audio_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_completed', true);

      if (countError) throw countError;

      const bookProgress: Record<string, AudioProgress> = {};
      let totalMinutesListened = 0;

      progressData.forEach((progress: AudioProgress) => {
        bookProgress[progress.book_id] = progress;
        totalMinutesListened += Math.floor((progress.total_listen_time || 0) / 60);
      });

      return {
        bookProgress,
        completedBooks: completedCount || 0,
        totalMinutesListened,
      };
    } catch (error) {
      console.error('Error in getUserProgress:', error);
      return {
        bookProgress: {},
        completedBooks: 0,
        totalMinutesListened: 0,
      };
    }
  },

  saveProgress: async (
    userId: string, 
    bookId: string, 
    position: number, 
    playbackRate: number = 1, 
    volume: number = 1
  ): Promise<AudioProgress | null> => {
    try {
      const roundedPosition = Math.round(position);
      
      const { data: existingProgress } = await supabase
        .from('audio_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .maybeSingle();

      if (!existingProgress) {
        const { data, error } = await supabase
          .from('audio_progress')
          .insert({
            user_id: userId,
            book_id: bookId,
            current_position: roundedPosition,
            playback_speed: playbackRate,
            volume: volume,
            last_played_at: new Date().toISOString(),
            total_listen_time: roundedPosition
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating progress:', error);
          return null;
        }

        return data as AudioProgress;
      }

      const newListenTime = existingProgress.total_listen_time + 
        (roundedPosition > existingProgress.current_position ? 
          roundedPosition - existingProgress.current_position : 0);

      const { data, error } = await supabase
        .from('audio_progress')
        .update({
          current_position: roundedPosition,
          playback_speed: playbackRate,
          volume: volume,
          last_played_at: new Date().toISOString(),
          total_listen_time: newListenTime
        })
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .select()
        .single();

      if (error) {
        console.error('Error updating progress:', error);
        return null;
      }

      return data as AudioProgress;
    } catch (error) {
      console.error('Error in saveProgress:', error);
      return null;
    }
  }
};

// Profile API
export const profileApi = {
  getProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  updateProfile: async (userId: string, updates: Partial<UserProfile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};

// Playlists API
export const playlistsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Playlist[];
  },

  getBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('playlists')
      .select(`
        *,
        books:playlist_books(
          book:books(
            *,
            category:categories(*)
          )
        )
      `)
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    
    const playlist = {
      ...data,
      books: data.books
        .map((item: any) => item.book)
        .filter(Boolean)
    };
    
    return playlist as Playlist;
  },

  getFeatured: async () => {
    const { data, error } = await supabase
      .from('playlists')
      .select(`
        *,
        books:playlist_books(
          book:books(
            *,
            category:categories(*)
          )
        )
      `)
      .limit(4);
    
    if (error) throw error;

    const playlists = data.map(playlist => ({
      ...playlist,
      books: playlist.books
        .map((item: any) => item.book)
        .filter(Boolean)
    }));
    
    return playlists as Playlist[];
  }
};