import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const colors = ['#4d6ef5','#7c3aed','#059669','#d97706','#dc2626','#0891b2'];

const sizeMap = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-12 h-12 text-lg' };

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', className = '' }) => {
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 ${className}`}
      style={{ background: color }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
};
