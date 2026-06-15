/**
 * Spacing Tokens — 8px base unit system
 *
 * Philosophy:
 * - Base unit: 8px
 * - Predictable, scalable spacing
 * - Consistent breathing room
 */

export const SpacingTokens = {
  // ========== MICRO SPACING ==========
  xs: '4px',      // Tight spacing (4px)
  sm: '6px',      // Small spacing (6px)
  base: '8px',    // Base unit (8px)
  md: '12px',     // Medium (12px = base + 4)

  // ========== STANDARD SPACING ==========
  lg: '16px',     // Large (16px = base × 2)
  xl: '20px',     // Extra large (20px = base × 2.5)
  '2xl': '24px',  // 2× large (24px = base × 3)
  '3xl': '28px',  // 3× large (28px)
  '4xl': '32px',  // 4× large (32px = base × 4)

  // ========== LARGE SPACING ==========
  '5xl': '40px',  // (40px = base × 5)
  '6xl': '48px',  // (48px = base × 6)
  '7xl': '56px',  // (56px = base × 7)
  '8xl': '64px',  // (64px = base × 8)
};

// ========== SEMANTIC SPACING SCALES ==========
export const SemanticSpacing = {
  // ========== COMPONENT PADDING ==========
  component: {
    xs: '8px',      // Small components (buttons, badges)
    sm: '12px',     // Standard buttons, inputs
    md: '16px',     // Cards, containers
    lg: '20px',     // Large cards, panels
    xl: '24px',     // Extra large containers
  },

  // ========== SECTION SPACING (Gap between major blocks) ==========
  section: {
    sm: '16px',     // Small section gap
    md: '24px',     // Medium section gap
    lg: '32px',     // Large section gap
  },

  // ========== INLINE SPACING (Gaps between inline items) ==========
  inline: {
    xs: '4px',      // Tight items (tags, badges)
    sm: '8px',      // Standard items (buttons in row)
    md: '12px',     // Larger items
    lg: '16px',     // Extra large spacing
  },
};

// ========== LAYOUT PATTERNS ==========
export const LayoutSpacing = {
  // Telegram safe area (mobile specific)
  safeAreaTop: 'env(safe-area-inset-top)',
  safeAreaBottom: 'env(safe-area-inset-bottom)',
  safeAreaLeft: 'env(safe-area-inset-left)',
  safeAreaRight: 'env(safe-area-inset-right)',

  // Grid spacing
  gridGap: '16px',
  gridGapLarge: '24px',

  // Page padding
  pagePadding: '16px',
  pagePaddingLarge: '24px',
};

/**
 * Usage examples:
 *
 * React:
 * <div style={{ padding: SpacingTokens.lg }} />
 *
 * Tailwind:
 * <div className="p-4 gap-3" />
 *
 * CSS:
 * .card { padding: var(--spacing-md); gap: var(--spacing-lg); }
 */
