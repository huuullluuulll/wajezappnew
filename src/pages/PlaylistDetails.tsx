import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { playlistsApi } from '../lib/api';
import { BookCard } from '../components/books/BookCard';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export const PlaylistDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: playlist, isLoading } = useQuery(
    ['playlist', slug],
    () => slug ? playlistsApi.getBySlug(slug) : null,
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">
          عذراً، لم يتم العثور على هذه القائمة
        </h2>
        <Link
          to="/playlists"
          className="inline-flex items-center text-neon hover:text-neon/80"
        >
          <ArrowRightIcon className="h-5 w-5 ml-2" />
          العودة إلى القوائم
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="w-full h-[300px] relative overflow-hidden"
        style={{ backgroundColor: playlist.background_color }}
      >
        {playlist.cover_url && (
          <img
            src={playlist.cover_url}
            alt={playlist.title}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative">
          <div className="flex flex-col justify-end h-full pb-12">
            <Link
              to="/playlists"
              className="inline-flex items-center text-white/80 hover:text-white mb-6"
            >
              <ArrowRightIcon className="h-5 w-5 ml-2" />
              العودة إلى القوائم
            </Link>
            
            <h1 className="text-4xl font-bold text-white mb-4">{playlist.title}</h1>
            <p className="text-xl text-white/90">{playlist.subtitle}</p>
            {playlist.description && (
              <p className="mt-4 text-white/80 max-w-2xl">{playlist.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {playlist.books && playlist.books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {playlist.books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">لا توجد كتب في هذه القائمة حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
};