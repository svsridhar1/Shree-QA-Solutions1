import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        saas: {
          bg: '#F8FAFC',        // Slate 50 off-white canvas
          card: '#FFFFFF',      // Pure white card surfaces
          border: '#E2E8F0',    // Slate 200 crisp border
          borderLight: '#F1F5F9', // Slate 100 subtle divider
          muted: '#64748B',     // Slate 500 secondary text
          dark: '#0F172A',      // Slate 900 primary heading
          subtle: '#94A3B8',    // Slate 400 caption
        },
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#1E293B',
          900: '#0F172A',     // Midnight Deep Navy
          950: '#0A0F1D',
        },
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',     // Warm Champagne Gold Accent
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        brand: {
          red: '#B33A2E',      // Authentic SHREE Terracotta Red
          redDark: '#8F281E',
          redLight: '#CE4B3E',
          crimson: '#E11D48',
          navy: '#0F172A',     // Primary Executive Navy
          gold: '#D97706',     // Premium Gold Accent
        },
        status: {
          success: '#10B981',
          successBg: '#ECFDF5',
          successBorder: '#A7F3D0',
          warning: '#F59E0B',
          warningBg: '#FFFBEB',
          warningBorder: '#FDE68A',
          danger: '#EF4444',
          dangerBg: '#FEF2F2',
          dangerBorder: '#FECACA',
          info: '#6366F1',
          infoBg: '#EEF2FF',
          infoBorder: '#C7D2FE',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'saas-xs': '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'saas-sm': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.03)',
        'saas-md': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.03)',
        'saas-lg': '0 10px 15px -3px rgb(0 0 0 / 0.04), 0 4px 6px -4px rgb(0 0 0 / 0.02)',
        'saas-hover': '0 12px 20px -3px rgb(0 0 0 / 0.08), 0 4px 6px -2px rgb(0 0 0 / 0.03)',
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '18px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
};
export default config;
