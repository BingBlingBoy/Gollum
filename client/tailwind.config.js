/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        "aileron": ["aileron", 'sans-serif']
      },
      colors: {
        "primary": "#42c8b3",
        "secondary": "#8fb6de",
        "accent": "#6a81d3",
        "best-gray": "#f7f7f7"
      },
    },
  },
  plugins: [],
}

