import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { playlistsApi } from '../lib/api';

export const Playlists: React.FC = () => {
  const { data: playlists, isLoading } = useQuery(['playlists'], playlistsApi.getAll);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-100">قوائم القراءة المميزة</h1>
        <p className="mt-2 text-xl text-gray-400">مجموعات مختارة من أفضل الكتب في مختلف المجالات</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {playlists?.map((playlist) => (
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
    </div>
  );
};