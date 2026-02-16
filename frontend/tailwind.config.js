/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        prosto: ["Prosto One", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#282828",
          on: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#C3B212",
          on: "#000000",
        },
        background: {
          DEFAULT: "#FEFEFE",
          variant: "#F4F4F4",
        },
        outline: "#A0A0A0",
      },
    },
  },
  plugins: [],
};
