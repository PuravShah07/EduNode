/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          cyan: '#00D1FF',
          coral: '#FF6B6B',
        },
        ink: {
          dark: '#1E1E1E',
          gray: '#6E6E6E',
        },
        paper: {
          offwhite: '#FDFDFD',
          light: '#F7F7F7',
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        heading: ['Poppins', 'Montserrat', 'sans-serif'], 
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        'soft-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}