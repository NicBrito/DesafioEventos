/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          blue: '#007AFF',
          gray: '#8E8E93',
          bg: '#000000',
          card: '#1C1C1E',
          secondary: '#2C2C2E',
          text: '#FFFFFF',
          textSecondary: '#A1A1A6',
          error: '#FF453A',
          success: '#32D74B',
        },
      },
      borderRadius: {
        apple: '12px',
        'apple-lg': '16px',
      },
      boxShadow: {
        'apple-lift': '0 4px 24px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
