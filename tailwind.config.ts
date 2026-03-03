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
        apple: {
          blue: "#007AFF",
          gray: "#8E8E93",
          bg: "#F2F2F7",
          text: "#1C1C1E",
          error: "#FF3B30",
          success: "#34C759",
        }
      },
      borderRadius: {
        'apple': '12px',
        'apple-lg': '16px',
      },
      boxShadow: {
        'apple-lift': '0 4px 24px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
};
export default config;