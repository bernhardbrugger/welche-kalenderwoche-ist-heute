/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          light: '#f5f5f5',
        },
        text: {
          light: '#333333',
        },
        primary: {
          DEFAULT: '#3b82f6', // Default blue, will be overridden by useMonthlyBackground
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          DEFAULT: '#ec4899', // Pink
          light: '#f9a8d4',
        },
        success: '#10b981', // Emerald
        warning: '#f59e0b', // Amber
        error: '#ef4444',   // Red
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
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'SF Pro Display',
          'SF Pro',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
      fontSize: {
        huge: '64px',
      },
      boxShadow: {
        'apple': '0 4px 14px rgba(0, 0, 0, 0.08)',
        'apple-md': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'apple': '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};