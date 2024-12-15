/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'app/*.{js,jsx,ts,tsx}',
    'components/*.{js,jsx,ts,tsx}',
    'constants/*.{js,jsx,ts,tsx}',
    'hooks/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      animation: {
        throb: 'throb 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        throb: {
          '0%, 100%': {
            opacity: '0',
          },
          '50%': {
            opacity: '0.75',
          },
        },
      },
    },
  },
  plugins: [],
};
