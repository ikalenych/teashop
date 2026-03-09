/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        prosto: ["Prosto One", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          on: "var(--color-primary-on)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          on: "var(--color-secondary-on)",
        },
        background: {
          DEFAULT: "var(--color-background)",
          variant: "var(--color-background-variant)",
        },
        outline: "var(--color-outline)",
      },
    },
  },
  plugins: [],
};
