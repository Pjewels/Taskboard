import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  darkMode: false, // manual dark mode with class toggling, not media
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
