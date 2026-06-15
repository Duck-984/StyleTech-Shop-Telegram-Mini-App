/**
 * Typography Tokens — Premium Minimal Text System
 *
 * Philosophy:
 * - Clear visual hierarchy
 * - Apple-like readability
 * - Generous line spacing
 * - Minimal font weights
 */

export const TypographyTokens = {
  // ========== FONT FAMILIES ==========
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'Menlo, Monaco, monospace',
  },

  // ========== FONT WEIGHTS ==========
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // ========== FONT SIZES WITH LINE HEIGHT ==========
  fontSize: {
    // Smallest
    xs: {
      fontSize: '12px',
      lineHeight: '16px',
      letterSpacing: '-0.01em',
    },

    // Small
    sm: {
      fontSize: '14px',
      lineHeight: '20px',
      letterSpacing: '-0.005em',
    },

    // Base / Default
    base: {
      fontSize: '16px',
      lineHeight: '24px',
      letterSpacing: '0',
    },

    // Large
    lg: {
      fontSize: '18px',
      lineHeight: '28px',
      letterSpacing: '0',
    },

    // Extra Large
    xl: {
      fontSize: '20px',
      lineHeight: '28px',
      letterSpacing: '0',
    },

    // 2× Large
    '2xl': {
      fontSize: '24px',
      lineHeight: '32px',
      letterSpacing: '-0.005em',
    },

    // 3× Large
    '3xl': {
      fontSize: '28px',
      lineHeight: '36px',
      letterSpacing: '-0.01em',
    },

    // 4× Large (Display)
    '4xl': {
      fontSize: '36px',
      lineHeight: '44px',
      letterSpacing: '-0.02em',
    },
  },

  // ========== LETTER SPACING ==========
  letterSpacing: {
    tighter: '-0.02em',
    tight: '-0.01em',
    normal: '0',
    wide: '0.01em',
  },
};

// ========== SEMANTIC TYPOGRAPHY SCALES ==========
export const SemanticTypography = {
  // ========== HEADLINES ==========
  headline: {
    h1: {
      fontSize: '36px',
      lineHeight: '44px',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '28px',
      lineHeight: '36px',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '24px',
      lineHeight: '32px',
      fontWeight: 600,
      letterSpacing: '-0.005em',
    },
    h4: {
      fontSize: '20px',
      lineHeight: '28px',
      fontWeight: 600,
      letterSpacing: '0',
    },
  },

  // ========== BODY TEXT ==========
  body: {
    lg: {
      fontSize: '18px',
      lineHeight: '28px',
      fontWeight: 400,
    },
    base: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: 400,
    },
    sm: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 400,
    },
    xs: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: 400,
    },
  },

  // ========== LABELS & METADATA ==========
  label: {
    default: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 500,
      letterSpacing: '-0.005em',
    },
    small: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      textTransform: 'uppercase' as const,
    },
  },

  // ========== BUTTONS ==========
  button: {
    lg: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: 500,
    },
    md: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 500,
    },
    sm: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: 600,
    },
  },

  // ========== PRICES & KEY METRICS ==========
  metric: {
    price: {
      fontSize: '18px',
      lineHeight: '28px',
      fontWeight: 600,
      letterSpacing: '-0.005em',
    },
    value: {
      fontSize: '24px',
      lineHeight: '32px',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
  },

  // ========== CAPTIONS & HINTS ==========
  caption: {
    default: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: 400,
      letterSpacing: '-0.01em',
    },
    muted: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: 400,
      color: '#BEBEBE',
    },
  },
};

/**
 * Usage examples:
 *
 * React with styles:
 * <h1 style={SemanticTypography.headline.h1} />
 * <p style={SemanticTypography.body.base} />
 * <span style={SemanticTypography.caption.muted} />
 *
 * Tailwind (predefined in config):
 * <h1 className="text-4xl font-semibold" />
 * <p className="text-base font-normal" />
 * <span className="text-xs font-light" />
 */
