import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { booksApi } from '../lib/api';
import { AdvancedPlayer } from '../components/audio/AdvancedPlayer';
import { formatDuration } from '../utils/format';
import { BookOpenIcon, ClockIcon, UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: book, isLoading, isError } = useQuery(
    ['book', id],
    () => id ? booksApi.getById(id) : null,
    { 
      enabled: !!id,
      retry: 1,
      staleTime: 30000
    }
  );

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 mb-4">عذراً، لم نتمكن من تحميل تفاصيل الكتاب</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-700"
        >
          <ArrowRightIcon className="h-5 w-5 ml-1" />
          العودة
        </button>
      </div>
    );
  }

  if (isLoading || !book) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Hero section */}
        <div className="relative h-64 bg-gradient-to-br from-indigo-600 to-indigo-800">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            {book.cover_url ? (
              <img
                src={book.cover_url}
                alt={book.title}
                className="h-48 w-32 object-cover rounded-lg shadow-2xl transform hover:scale-105 transition-transform"
              />
            ) : (
              <div className="h-48 w-32 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <span className="text-white text-4xl font-bold">{book.title[0]}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600">{book.author}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <UserIcon className="h-6 w-6 text-indigo-600 mb-2" />
              <span className="text-sm text-gray-600">المؤلف</span>
              <span className="font-medium">{book.author}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <BookOpenIcon className="h-6 w-6 text-indigo-600 mb-2" />
              <span className="text-sm text-gray-600">التصنيف</span>
              <span className="font-medium">{book.category.name}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <ClockIcon className="h-6 w-6 text-indigo-600 mb-2" />
              <span className="text-sm text-gray-600">المدة</span>
              <span className="font-medium">{formatDuration(book.audio_duration || 0)}</span>
            </div>
          </div>

          {book.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">عن الكتاب</h2>
              <p className="text-gray-600 leading-relaxed">{book.description}</p>
            </div>
          )}

          {book.audio_url && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                مشغل الكتاب الصوتي
              </h2>
              <AdvancedPlayer
                bookId={book.id}
                audioUrl={book.audio_url}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};