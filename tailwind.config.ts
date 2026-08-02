import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        byjus: {
          navy: '#0B132B',
          card: '#0F172A',
          cardBorder: '#1E293B',
          gold: '#F59E0B',
          goldLight: '#FCD34D',
          cyan: '#06B6D4',
          cyanLight: '#22D3EE',
          purple: '#7C3AED',
        },
        junior: {
          bg: '#180B2B',
          accent: '#FF6B8B',
          card: '#25123E',
          secondary: '#7C3AED',
          gold: '#FFD700',
        },
        middle: {
          bg: '#0F172A',
          accent: '#06B6D4',
          card: '#1E293B',
          secondary: '#3B82F6',
          gold: '#F59E0B',
        },
        senior: {
          bg: '#080C14',
          accent: '#10B981',
          card: '#111827',
          secondary: '#6366F1',
          gold: '#EAB308',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        playful: ['Fredoka', 'Quicksand', 'sans-serif'],
      },
      animation: {
        'flame-pulse': 'flame 1.5s ease-in-out infinite alternate',
        'synapse-glow': 'synapse 2s ease-in-out infinite alternate',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        flame: {
          '0%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.6))' },
          '100%': { transform: 'scale(1.12)', filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.9))' },
        },
        synapse: {
          '0%': { opacity: '0.6', filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.5))' },
          '100%': { opacity: '1', filter: 'drop-shadow(0 0 22px rgba(56, 189, 248, 0.9))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};

export default config;
