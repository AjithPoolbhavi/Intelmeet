// Premium Color System
export const colors = {
  // Primary Palette - Modern Blue-Purple gradient
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },

  // Secondary - Cyan-Teal for accents
  secondary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },

  // Neutral - Professional grays
  neutral: {
    0: '#ffffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },

  // Status Colors
  success: {
    50: '#f0fdf4',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  },

  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },

  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },

  info: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    secondary: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    accent: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
    dark: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    light: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
  },

  // Semantic colors
  bg: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
    hover: '#f0f0ff',
    dark: '#111827',
    darker: '#030712',
  },

  text: {
    primary: '#111827',
    secondary: '#4b5563',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
  },

  // Dark mode
  dark: {
    bg: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
      hover: '#1e1b4b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      tertiary: '#94a3b8',
    },
    border: '#475569',
  },

  // Glassmorphism
  glass: {
    bg: 'rgba(255, 255, 255, 0.8)',
    border: 'rgba(255, 255, 255, 0.2)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },

  glass_dark: {
    bg: 'rgba(15, 23, 42, 0.8)',
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

export default colors;
