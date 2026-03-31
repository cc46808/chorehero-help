import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: '#f8f6ea', strong: '#fffdf5' },
        ink: '#21304f',
        brand: '#3153a4',
        cobalt: '#2563eb',
        sky: '#2a9df4',
        warm: { DEFAULT: '#ffd643', deep: '#ffb800' },
        mint: '#74d3ae',
      },
      fontFamily: {
        body: ['Manrope', '"Avenir Next"', '"Segoe UI"', '"Helvetica Neue"', 'sans-serif'],
        display: ['Sora', '"Avenir Next"', '"Segoe UI"', 'sans-serif'],
      },
      maxWidth: {
        site: '1180px',
      },
      boxShadow: {
        soft: '0 18px 40px rgba(37,72,140,0.10)',
        strong: '0 24px 60px rgba(37,72,140,0.16)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.ink'),
            maxWidth: 'none',
            a: {
              color: theme('colors.cobalt'),
              fontWeight: '500',
              '&:hover': { color: theme('colors.brand') },
            },
            'h1, h2, h3, h4': {
              fontFamily: "'Sora', 'Avenir Next', 'Segoe UI', sans-serif",
              color: theme('colors.ink'),
            },
            code: {
              color: theme('colors.brand'),
              backgroundColor: 'rgba(49, 83, 164, 0.08)',
              padding: '0.11em 0.4em',
              borderRadius: '0.35em',
              fontWeight: '500',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
