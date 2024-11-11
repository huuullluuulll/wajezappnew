import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Category } from '../types';

export const Categories: React.FC = () => {
  const { data: categories, isLoading } = useQuery(['categories'], async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
      
    if (error) throw error;
    return data as Category[];
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">التصنيفات</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories?.map((category) => (
          <Link
            key={category.id}
            to={`/categories/${category.slug}`}
            className="group relative bg-[#2A2A2A] rounded-xl p-6 hover:shadow-neon transition-all duration-300 border border-[#3A3A3A]"
          >
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {category.icon && (
                <div className="bg-neon/10 rounded-xl p-3 group-hover:bg-neon/20 transition-colors">
                  <img 
                    src={category.icon} 
                    alt=""
                    className="w-6 h-6 text-neon"
                  />
                </div>
              )}
              <div>
                <h2 className="text-lg font-medium text-gray-100 group-hover:text-neon transition-colors">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};