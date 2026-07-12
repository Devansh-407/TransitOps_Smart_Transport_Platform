export const COLORS = {
  // Primary Colors - Navy Blue
  primary: {
    dark: '#001d3d',    // Very dark navy
    main: '#00315c',    // Main navy blue
    light: '#003d82',   // Lighter navy
    lighter: '#0052a3', // Even lighter navy
  },

  // Secondary Colors - Electric Blue
  secondary: {
    dark: '#0052cc',
    main: '#0066ff',
    light: '#3385ff',
    lighter: '#5da3ff',
  },

  // Accent Colors - Orange
  accent: {
    dark: '#d97706',
    main: '#f59e0b',
    light: '#fbbf24',
    lighter: '#fcd34d',
  },

  // Neutral Colors
  neutral: {
    white: '#ffffff',
    gray: {
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
    },
  },

  // Status Colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
  },
};

export const TAILWIND_COLORS = {
  'primary-dark': COLORS.primary.dark,
  'primary-main': COLORS.primary.main,
  'primary-light': COLORS.primary.light,
  'secondary-main': COLORS.secondary.main,
  'accent-main': COLORS.accent.main,
};
