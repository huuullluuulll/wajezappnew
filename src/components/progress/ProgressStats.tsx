import React from 'react';
import { BookOpenIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface ProgressStatsProps {
  totalBooks: number;
  completedBooks: number;
  totalMinutes: number;
}

export const ProgressStats: React.FC<ProgressStatsProps> = ({
  totalBooks,
  completedBooks,
  totalMinutes
}) => {
  const stats = [
    {
      name: 'عدد الكتب',
      value: totalBooks,
      icon: BookOpenIcon,
    },
    {
      name: 'الكتب المكتملة',
      value: completedBooks,
      icon: CheckCircleIcon,
    },
    {
      name: 'وقت الاستماع',
      value: totalMinutes,
      icon: ClockIcon,
      format: (value: number) => {
        if (value < 60) return `${value} دقيقة`;
        const hours = Math.floor(value / 60);
        const minutes = value % 60;
        return minutes > 0 ? `${hours} ساعة و ${minutes} دقيقة` : `${hours} ساعة`;
      }
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="relative bg-[#2A2A2A] pt-5 px-6 pb-6 rounded-xl overflow-hidden hover:shadow-neon transition-all duration-300 border border-[#3A3A3A] group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon/50 to-transparent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          <div className="flex items-center">
            <div className="bg-neon/10 rounded-xl p-3 group-hover:bg-neon/20 transition-colors">
              <stat.icon className="h-6 w-6 text-neon" aria-hidden="true" />
            </div>
            <div className="mr-4 truncate">
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-100 group-hover:text-neon transition-colors">
                  {stat.format ? stat.format(stat.value) : stat.value}
                </p>
              </div>
              <p className="mt-1 text-sm text-gray-400 truncate">{stat.name}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};