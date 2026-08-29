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
        cream: {
          50: '#FDFBF7',
          100: '#F5F0E6', // Exact brand background
          200: '#EBDDC9',
          300: '#DEC6A6',
          400: '#D0AF83',
          500: '#B8925F',
        },
        brand: {
          red: '#B33A2E',      // Deep red
          redDark: '#8F281E',
          redLight: '#CE4B3E',
          navy: '#1B2A4A',     // Deep Navy
          navyLight: '#2C3E6B',
          navyDark: '#101B31',
          gold: '#E08A3E',     // Gold / Orange
          goldLight: '#F3A660',
          goldDark: '#C26F25',
          amber: '#D97706',
          ivory: '#F5F0E6',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #E08A3E 0%, #B33A2E 100%)',
        'brand-gradient-hover': 'linear-gradient(90deg, #EA9549 0%, #C44336 100%)',
        'card-gradient-gold': 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
        'card-gradient-red': 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
        'card-gradient-navy': 'linear-gradient(135deg, #F0F4F8 0%, #E2E8F0 100%)',
      }
    },
  },
  plugins: [],
};
export default config;
