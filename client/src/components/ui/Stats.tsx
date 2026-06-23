import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  color?: 'brand' | 'emerald' | 'amber' | 'rose' | 'blue';
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  color = 'brand',
  onClick,
}: StatCardProps) {
  const colorClasses = {
    brand: 'text-brand-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
    blue: 'text-blue-400',
  };

  const bgColorClasses = {
    brand: 'bg-brand-500/10',
    emerald: 'bg-emerald-500/10',
    amber: 'bg-amber-500/10',
    rose: 'bg-rose-500/10',
    blue: 'bg-blue-500/10',
  };

  const isTrendingUp = trend && trend > 0;

  return (
    <div
      onClick={onClick}
      className={`bg-surface-700 border border-white/5 rounded-xl p-5 transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:border-white/10 hover:bg-surface-600' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`${bgColorClasses[color]} p-3 rounded-lg`}>
          <div className={`${colorClasses[color]} text-2xl`}>
            {icon}
          </div>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${isTrendingUp ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isTrendingUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-white/60 mb-1">{title}</p>
        <p className="text-2xl font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

interface ChartPlaceholderProps {
  title: string;
  height?: string;
}

export function ChartPlaceholder({ title, height = 'h-64' }: ChartPlaceholderProps) {
  return (
    <div className={`bg-surface-700 border border-white/5 rounded-xl p-6 ${height}`}>
      <h3 className="text-sm font-medium text-white mb-4">{title}</h3>
      <div className="h-full flex items-end justify-around gap-2 pb-8">
        {[40, 65, 50, 80, 55, 70].map((height, i) => (
          <div
            key={i}
            className={`flex-1 bg-gradient-to-t from-brand-500 to-brand-400 rounded-t-lg transition-all hover:opacity-80`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  color?: 'brand' | 'emerald' | 'amber' | 'rose';
}

export function ProgressBar({
  label,
  value,
  max = 100,
  color = 'brand',
}: ProgressBarProps) {
  const percentage = (value / max) * 100;

  const colorClasses = {
    brand: 'bg-gradient-to-r from-brand-600 to-brand-500',
    emerald: 'bg-gradient-to-r from-emerald-600 to-emerald-500',
    amber: 'bg-gradient-to-r from-amber-600 to-amber-500',
    rose: 'bg-gradient-to-r from-rose-600 to-rose-500',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-white">{label}</label>
        <span className="text-sm text-white/60">{percentage.toFixed(0)}%</span>
      </div>
      <div className="w-full h-2 bg-surface-600 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface ListItemProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
}

export function ListItem({
  icon,
  title,
  subtitle,
  action,
  onClick,
  selected = false,
}: ListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 cursor-pointer ${
        selected
          ? 'bg-brand-500/20 border border-brand-500/50'
          : 'hover:bg-white/5'
      }`}
    >
      {icon && <div className="text-white/60 flex-shrink-0">{icon}</div>}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{title}</p>
        {subtitle && (
          <p className="text-xs text-white/40 truncate">{subtitle}</p>
        )}
      </div>

      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 text-white/40">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-white/60 mb-6 max-w-sm">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export function PremiumBadge({ children, variant = 'default' }: BadgeProps) {
  const variantClasses = {
    default: 'bg-brand-500/20 text-brand-300 border border-brand-500/30',
    success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    error: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    info: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
