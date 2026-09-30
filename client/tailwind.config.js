/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff8ff',
          100: '#dff1ff',
          200: '#b7e0ff',
          300: '#7cc9ff',
          400: '#34a8ff',
          500: '#0f87d9',
          600: '#0768b0',
          700: '#0a548b',
          800: '#0d4670',
          900: '#0f3c5d'
        }
      },
      boxShadow: {
        halo: '0 20px 80px rgba(14, 116, 144, 0.16)'
      }
    }
  },
  plugins: []
};
