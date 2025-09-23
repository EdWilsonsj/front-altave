/** @type {import('tailwindcss').Config} */
export default {
    // só alterna com a classe "dark", nunca pelo sistema
    darkMode: "class",
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // cobre todos os arquivos React/Vite
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };