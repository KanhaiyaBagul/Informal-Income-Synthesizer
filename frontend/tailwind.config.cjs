/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0A0B0D',
        surface: '#121316',
        card: '#16181D',
        'card-hover': '#1C1F26',
        'border-subtle': '#22252B',
        'border-focus': '#2D323B',
        lime: {
          DEFAULT: '#D2FC38',
          hover: '#E2FD66',
          muted: 'rgba(210, 252, 56, 0.15)',
        },
        'accent-dark': '#0A0B0D',
        positive: '#34D399',
        caution: '#FBBF24',
        negative: '#F87171',
        text: {
          primary: '#FFFFFF',
          secondary: '#9CA3AF',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Space Grotesk', 'monospace'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        pill: '9999px',
      },
      boxShadow: {
        'lime-glow': '0 0 25px rgba(210, 252, 56, 0.2)',
        'card-subtle': '0 4px 20px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
};
