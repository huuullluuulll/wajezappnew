import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { booksApi, audioApi } from '../lib/api';
import { BookCard } from '../components/books/BookCard';
import { ProgressStats } from '../components/progress/ProgressStats';
import { useAuthStore } from '../store/authStore';
import { ChartBarIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { Book, Category } from '../types';

export const Progress: React.FC = () => {
  const { user } = useAuthStore();
  const { data: books, isLoading: loadingBooks } = useQuery(['books'], booksApi.getAll);
  const { data: progress, isLoading: loadingProgress } = useQuery(
    ['userProgress'],
    () => user ? audioApi.getUserProgress(user.id) : null,
    { enabled: !!user }
  );

  const isLoading = loadingBooks || loadingProgress;

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

  // Separate books into continue reading and finished
  const { continueReading, finishedBooks } = books?.reduce<{
    continueReading: (Book & { category: Category })[];
    finishedBooks: (Book & { category: Category })[];
  }>(
    (acc, book) => {
      const bookProgress = progress?.bookProgress?.[book.id];
      if (bookProgress?.is_completed) {
        acc.finishedBooks.push(book);
      } else if (bookProgress?.current_position && bookProgress.current_position > 0) {
        acc.continueReading.push(book);
      }
      return acc;
    },
    { continueReading: [], finishedBooks: [] }
  ) ?? { continueReading: [], finishedBooks: [] };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="relative mb-12 bg-[#2A2A2A] rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon/10 to-transparent" />
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4 flex items-center">
            <ChartBarIcon className="h-8 w-8 text-neon mr-3" />
            تقدمي في القراءة
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            تتبع تقدمك في القراءة واستعرض إنجازاتك في رحلة المعرفة
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <section className="mb-12">
        <ProgressStats {...stats} />
      </section>

      {/* Reading Time Distribution */}
      <section className="mb-12">
        <div className="bg-[#2A2A2A] rounded-xl p-6 border border-[#3A3A3A]">
          <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center">
            <ClockIcon className="h-6 w-6 text-neon mr-2" />
            توزيع وقت القراءة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {finishedBooks.slice(0, 3).map(book => {
              const bookProgress = progress?.bookProgress?.[book.id];
              const minutes = Math.floor((bookProgress?.current_position ?? 0) / 60);
              return (
                <div key={book.id} className="flex items-center space-x-4 rtl:space-x-reverse bg-[#1A1A1A] rounded-lg p-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    {book.cover_url ? (
                      <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <div className="w-full h-full bg-[#2A2A2A] rounded-lg flex items-center justify-center">
                        <span className="text-2xl text-gray-500">{book.title[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-100 truncate">{book.title}</h3>
                    <p className="text-sm text-neon">{minutes} دقيقة</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Continue Reading Section */}
      {continueReading.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-100 mb-6">متابعة القراءة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {continueReading.map((book) => (
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

      {/* Completed Books Section */}
      {finishedBooks.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center">
            <CheckCircleIcon className="h-6 w-6 text-neon mr-2" />
            الكتب المكتملة
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {finishedBooks.map((book) => (
              <BookCard 
                key={book.id} 
                book={book}
                progress={100}
                isCompleted
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {continueReading.length === 0 && finishedBooks.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-[#2A2A2A] rounded-xl p-8 max-w-lg mx-auto">
            <ChartBarIcon className="h-12 w-12 text-neon mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-100 mb-2">لم تبدأ القراءة بعد</h3>
            <p className="text-gray-400 mb-6">
              ابدأ رحلتك المعرفية الآن واستمع إلى أفضل الكتب العربية الملخصة صوتياً
            </p>
            <Link 
              to="/library" 
              className="inline-flex items-center px-4 py-2 rounded-xl bg-neon text-black hover:bg-neon/90 transition-colors"
            >
              استكشف المكتبة
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};