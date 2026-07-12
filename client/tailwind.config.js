/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f8',
          100: '#d9e2f0',
          200: '#b3c5e0',
          300: '#8ca8d0',
          400: '#0066cc',
          500: '#0052a3',
          600: '#003d7a',
          700: '#002851',
          800: '#001a33',
          900: '#000d1a',
        },
        navy: {
          50: '#f0f4f8',
          500: '#001f3f',
          600: '#001a33',
          700: '#001526',
          800: '#000f1a',
          900: '#00070d',
        },
        accent: {
          blue: '#0066cc',
          orange: '#ff9900',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.06)',
        md: '0 4px 12px rgba(0, 0, 0, 0.08)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
