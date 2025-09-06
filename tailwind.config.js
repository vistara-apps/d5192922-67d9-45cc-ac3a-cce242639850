/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsla(195, 100%, 50%, 1)',
        accent: 'hsla(280, 100%, 70%, 1)',
        bg: 'hsla(210, 36%, 96%, 1)',
        surface: 'hsla(210, 36%, 100%, 1)',
        textPrimary: 'hsla(210, 36%, 15%, 1)',
        textSecondary: 'hsla(210, 36%, 45%, 1)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(210, 36%, 15%, 0.1)',
        'modal': '0 16px 48px hsla(210, 36%, 15%, 0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 150ms cubic-bezier(0.22, 0.61, 0.36, 1)',
        'slide-up': 'slideUp 250ms cubic-bezier(0.22, 0.61, 0.36, 1)',
        'scale-in': 'scaleIn 400ms cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
