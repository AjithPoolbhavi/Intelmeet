import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'gradient' | 'elevated' | 'bordered';
  hover?: boolean;
}

export function Card({ children, variant = 'glass', hover = true, className = '', ...props }: CardProps) {
  const baseClasses = 'rounded-2xl transition-all duration-300 p-6';

  const variants = {
    default: 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700',
    glass: 'glass border border-white/20 dark:border-white/10 backdrop-blur-xl',
    gradient: 'bg-gradient-to-br from-purple-50 dark:from-purple-900/20 to-cyan-50 dark:to-cyan-900/20 border border-white/20 dark:border-white/10',
    elevated: 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-lg shadow-purple-500/10',
    bordered: 'bg-white dark:bg-slate-800 border-2 border-purple-300 dark:border-purple-700',
  };

  const hoverClasses = hover ? 'hover:border-white/40 dark:hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/20' : '';

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardHeader({ children, className = '', ...props }: CardHeaderProps) {
  return (
    <div className={`pb-4 border-b border-gray-200 dark:border-gray-700 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function CardTitle({ children, className = '', ...props }: CardTitleProps) {
  return (
    <h3 className={`text-2xl font-bold text-gray-900 dark:text-white ${className}`} {...props}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function CardDescription({ children, className = '', ...props }: CardDescriptionProps) {
  return (
    <p className={`text-sm text-white/60 mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardContent({ children, className = '', ...props }: CardContentProps) {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardFooter({ children, className = '', ...props }: CardFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-white/5 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
}
