import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { booksApi, audioApi, playlistsApi } from '../lib/api';
import { BookCard } from '../components/books/BookCard';
import { ProgressStats } from '../components/progress/ProgressStats';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import type { Book, Category } from '../types';

export const Dashboard: React.FC = () => {
  const { user, profile } = useAuthStore();
  
  const { data: books, isLoading: loadingBooks } = useQuery(['books'], booksApi.getAll);
  const { data: progress, isLoading: loadingProgress } = useQuery(
    ['userProgress'],
    () => user ? audioApi.getUserProgress(user.id) : null,
    { enabled: !!user }
  );
  const { data: categories } = useQuery(['categories'], async () => {
    const { data } = await supabase.from('categories').select('*').limit(6);
    return data;
  });
  const { data: featuredPlaylists, isLoading: loadingPlaylists } = useQuery(
    ['featuredPlaylists'],
    playlistsApi.getFeatured
  );

  const isLoading = loadingBooks || loadingProgress || loadingPlaylists;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon" />
      </div>
    );
  }

  const stats = {
    totalBooks: books?.length ?? 0,
    completedBooks: progress?.completedBooks ?? 0,
    totalMinutes: progress?.totalMinutesListened ?? 0,
  };

  // Get latest books (last 4)
  const latestBooks = books?.slice(0, 4) ?? [];

  // Get books in progress
  const inProgressBooks = books?.filter(book => {
    const bookProgress = progress?.bookProgress?.[book.id];
    return bookProgress?.current_position && bookProgress.current_position > 0 && !bookProgress.is_completed;
  }).slice(0, 4) ?? [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#2A2A2A] border-b border-[#3A3A3A] mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="max-w-4xl">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-100 mb-4">
              {profile?.first_name 
                ? `أهلاً ${profile.first_name}، مرحباً بك في منصة وجيز`
                : 'مرحباً بك في وجيز'}
            </h1>
            <p className="text-gray-400 text-base md:text-lg">
              استمع إلى أفضل الكتب العربية الملخصة صوتياً
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
        {/* Stats Section */}
        <section className="rounded-2xl bg-[#2A2A2A]/50 p-6 md:p-8">
          <ProgressStats {...stats} />
        </section>

        {/* Continue Listening Section */}
        {inProgressBooks.length > 0 && (
          <section>
            <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-100">متابعة الاستماع</h2>
              <Link 
                to="/progress" 
                className="text-neon hover:text-neon/80 flex items-center gap-2 text-sm md:text-base"
              >
                عرض الكل
                <ArrowLeftIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {inProgressBooks.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book}
                  progress={
                    ((progress?.bookProgress?.[book.id]?.current_position ?? 0) / 
                    (book.audio_duration ?? 1)) * 100
                  }
                />
              ))}
            </div>
          </section>
        )}

        {/* Featured Playlists Section */}
        {featuredPlaylists && featuredPlaylists.length > 0 && (
          <section>
            <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-100">قوائم القراءة المميزة</h2>
              <Link 
                to="/playlists" 
                className="text-neon hover:text-neon/80 flex items-center gap-2 text-sm md:text-base"
              >
                عرض كل القوائم
                <ArrowLeftIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredPlaylists.map((playlist) => (
                <Link
                  key={playlist.id}
                  to={`/playlists/${playlist.slug}`}
                  className="group relative aspect-square rounded-3xl overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-xl"
                  style={{ backgroundColor: playlist.background_color }}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40" />
                  
                  {/* Cover Image */}
                  {playlist.cover_url && (
                    <img
                      src={playlist.cover_url}
                      alt={playlist.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Latest Books Section */}
        <section>
          <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-100">أحدث الكتب</h2>
            <Link 
              to="/library" 
              className="text-neon hover:text-neon/80 flex items-center gap-2 text-sm md:text-base"
            >
              عرض المكتبة
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {latestBooks.map((book) => (
              <BookCard 
                key={book.id} 
                book={book}
              />
            ))}
          </div>
        </section>

        {/* Categories Section */}
        {categories && categories.length > 0 && (
          <section>
            <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-100">التصنيفات</h2>
              <Link 
                to="/categories" 
                className="text-neon hover:text-neon/80 flex items-center gap-2 text-sm md:text-base"
              >
                عرض كل التصنيفات
                <ArrowLeftIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categories/${category.slug}`}
                  className="group relative bg-[#2A2A2A] rounded-xl p-4 md:p-6 hover:shadow-neon transition-all duration-300 border border-[#3A3A3A]"
                >
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    {category.icon && (
                      <div className="bg-neon/10 rounded-xl p-2 md:p-3 group-hover:bg-neon/20 transition-colors">
                        <img 
                          src={category.icon} 
                          alt=""
                          className="w-5 h-5 md:w-6 md:h-6 text-neon"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-base md:text-lg font-medium text-gray-100 group-hover:text-neon transition-colors">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};