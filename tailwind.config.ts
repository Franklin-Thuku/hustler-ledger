import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#062d1a', // Your dark background
          light: '#0a3d24',
        },
        lime: {
          DEFAULT: '#c1ff72', // Your bright accent
        }
      },
    },
  },
  plugins: [],
};
export default config;