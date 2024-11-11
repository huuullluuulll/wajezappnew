import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { booksApi } from '../lib/api';
import { BookCard } from '../components/books/BookCard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const Library: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: books, isLoading } = useQuery(['books'], booksApi.getAll);

  const filteredBooks = books?.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col items-start mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">المكتبة</h1>
        <div className="w-full max-w-2xl">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="ابحث عن كتاب أو مؤلف..."
              className="w-full bg-[#2A2A2A] text-gray-100 rounded-xl py-3 pr-11 pl-4 border border-[#3A3A3A] focus:border-neon focus:ring-1 focus:ring-neon placeholder-gray-500 transition-colors duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon" />
        </div>
      ) : filteredBooks && filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">لم يتم العثور على أي كتب</p>
        </div>
      )}
    </div>
  );
};