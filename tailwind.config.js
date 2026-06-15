/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Background system (light premium minimal)
        bg: {
          primary: '#FAF8F5',      // Light cream - main background
          secondary: '#F6F2EE',    // Slightly warmer cream
          tertiary: '#F0EBE5',     // Deeper cream for hover states
        },

        // Surface system (cards, containers)
        surface: {
          1: '#FFFFFF',            // Pure white for cards
          2: '#FDFBF9',            // Off-white for nested surfaces
          3: '#F9F6F2',            // Light cream for layering
        },

        // Text hierarchy (based on deep black)
        text: {
          primary: '#0E0E0E',      // Deep black - main text
          secondary: '#8F8F8F',    // Medium gray
          muted: '#BEBEBE',        // Light gray - placeholder/hint text
        },

        // Accent system (minimal, restrained)
        accent: {
          DEFAULT: '#0E0E0E',      // Deep black - primary CTA
          soft: '#6B6B6B',         // Soft gray for secondary actions
        },

        // Status colors (soft, muted)
        status: {
          success: '#4A9D6F',      // Muted green
          warning: '#D4A574',      // Muted warm brown
          danger: '#C4756B',       // Muted rose
          info: '#7A95B0',         // Muted blue
        },

        // Borders and dividers
        border: {
          light: '#E8E3DB',        // Very light border
          DEFAULT: '#D4CCC2',      // Standard border
          dark: '#B8AFA0',         // Darker border
        },
      },

      spacing: {
        4: '4px',
        6: '6px',
        8: '8px',
        12: '12px',
        16: '16px',
        20: '20px',
        24: '24px',
        28: '28px',
        32: '32px',
        40: '40px',
        48: '48px',
      },

      borderRadius: {
        xs: '6px',
        sm: '8px',
        md: '10px',
        lg: '12px',
        xl: '14px',
        '2xl': '16px',
        '3xl': '20px',
        full: '9999px',
      },

      boxShadow: {
        none: 'none',
        xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
        sm: '0 2px 4px rgba(0, 0, 0, 0.08)',
        md: '0 4px 8px rgba(0, 0, 0, 0.1)',
        lg: '0 8px 16px rgba(0, 0, 0, 0.12)',
        xl: '0 12px 24px rgba(0, 0, 0, 0.15)',
        '2xl': '0 20px 40px rgba(0, 0, 0, 0.2)',
        soft: '0 2px 8px rgba(0, 0, 0, 0.06)',
        card: '0 4px 12px rgba(0, 0, 0, 0.08)',
        input: '0 1px 3px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },

      fontSize: {
        xs: ['12px', { lineHeight: '16px', letterSpacing: '-0.01em' }],
        sm: ['14px', { lineHeight: '20px', letterSpacing: '-0.005em' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['28px', { lineHeight: '36px' }],
      },

      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },

      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.01em',
      },

      opacity: {
        0: '0',
        5: '0.05',
        10: '0.1',
        20: '0.2',
        30: '0.3',
        40: '0.4',
        50: '0.5',
        60: '0.6',
        70: '0.7',
        80: '0.8',
        90: '0.9',
        100: '1',
      },

      transitionDuration: {
        100: '100ms',
        150: '150ms',
        200: '200ms',
        300: '300ms',
        500: '500ms',
      },

      transitionTimingFunction: {
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      screens: {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },

  plugins: [],
};
