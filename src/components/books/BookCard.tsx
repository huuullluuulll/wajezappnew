import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Category } from '../../types';
import { formatDuration } from '../../utils/format';
import { ProgressBar } from '../progress/ProgressBar';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface BookCardProps {
  book: Book & { category: Category };
  progress?: number;
  isCompleted?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  progress = 0,
  isCompleted = false 
}) => {
  return (
    <Link 
      to={`/books/${book.id}`} 
      className="group block bg-[#1A1A1A] rounded-xl p-4 transition-all duration-300 hover:shadow-neon hover:-translate-y-1 border border-[#2A2A2A] relative"
    >
      {isCompleted && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-neon rounded-full p-1">
            <CheckCircleIcon className="h-5 w-5 text-black" />
          </div>
        </div>
      )}
      
      <div className="aspect-w-3 aspect-h-4 w-full overflow-hidden rounded-lg bg-[#2A2A2A] relative mb-4">
        {book.cover_url ? (
          <img
            src={book.cover_url}
            alt={book.title}
            className={`h-full w-full object-cover object-center transition-opacity ${
              isCompleted ? 'opacity-75' : 'group-hover:opacity-75'
            }`}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#2A2A2A]">
            <span className="text-gray-400 text-4xl">{book.title[0]}</span>
          </div>
        )}
        {progress > 0 && !isCompleted && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-[#1A1A1A]/90">
            <ProgressBar progress={progress} size="sm" showText={false} />
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-100 group-hover:text-neon transition-colors line-clamp-1">
          {book.title}
        </h3>
        <p className="mt-1 text-sm text-gray-400 line-clamp-1">{book.author}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {book.category.icon && (
              <div className="w-6 h-6 rounded-lg bg-neon/10 p-1">
                <img 
                  src={book.category.icon} 
                  alt=""
                  className="w-full h-full text-neon"
                />
              </div>
            )}
            <p className="text-sm text-neon">{book.category.name}</p>
          </div>
          {book.audio_duration && (
            <span className="inline-flex items-center rounded-full bg-neon/10 px-2.5 py-0.5 text-xs font-medium text-neon">
              {formatDuration(book.audio_duration)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};