/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta de marca tomada del logo (azul profundo + verde azulado / teal)
        brand: {
          50: '#eef5fc',
          100: '#d7e8f8',
          200: '#b3d2f0',
          300: '#84b4e4',
          400: '#5290d3',
          500: '#2f70bd',
          600: '#1e5aa8', // azul principal del logo
          700: '#1a4a8a',
          800: '#193f72',
          900: '#173760',
          950: '#0f223d',
        },
        teal: {
          // verde azulado del aro y la columna vertebral del logo
          50: '#effbf9',
          100: '#cbf3ec',
          200: '#98e6da',
          300: '#5dd2c4',
          400: '#2fb8a9',
          500: '#159b8e', // teal principal del logo
          600: '#0d7d73',
          700: '#0f635c',
          800: '#114f4b',
          900: '#12423f',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15, 34, 61, 0.04), 0 4px 16px -4px rgba(15, 34, 61, 0.08)',
        'card-hover': '0 2px 4px 0 rgba(15, 34, 61, 0.06), 0 12px 28px -6px rgba(15, 34, 61, 0.14)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
      },
    },
  },
  plugins: [],
};
