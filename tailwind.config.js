// tailwind.config.js — mínimo para v4 (nada de "content" aqui)
export default {
  darkMode: ["class"], // usaremos a classe .dark no <html>
  theme: {
    extend: {
      colors: {
        'altave-primary': '#6699FF',
        'altave-background': '#F7F8FC',
        'altave-text': '#6A6D7C',
        'altave-dark-blue': '#3366CC',
        'altave-soft-blue': '#E6F0FF',
        'altave-green': '#4CAF50',
        'altave-red': '#F44336',
      },
    },
  },
  plugins: [],
};