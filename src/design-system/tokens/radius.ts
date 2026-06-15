/**
 * Border Radius Tokens — Clean, Minimal Scale
 *
 * Philosophy:
 * - Apple-like clarity
 * - Predictable, consistent roundedness
 * - Subtle curves for premium feel
 */

export const RadiusTokens = {
  // ========== MINIMUM RADIUS ==========
  none: '0px',              // No rounding (sharp corners)
  xs: '6px',                // Very subtle (buttons, small elements)
  sm: '8px',                // Small radius (inputs, small cards)

  // ========== STANDARD RADIUS ==========
  md: '10px',               // Medium (default for most elements)
  lg: '12px',               // Large (main cards)
  xl: '14px',               // Extra large (large cards)
  '2xl': '16px',            // 2× large (premium cards)

  // ========== LARGE RADIUS ==========
  '3xl': '20px',            // 3× large (modal corners)
  '4xl': '24px',            // 4× large (hero sections)
  full: '9999px',           // Fully rounded (badges, pills)
};

// ========== SEMANTIC RADIUS USAGE ==========
export const SemanticRadius = {
  // ========== BUTTONS ==========
  button: {
    small: '6px',           // Small button radius
    default: '8px',         // Standard button radius
    large: '10px',          // Large button radius
    pill: '9999px',         // Fully rounded (icon buttons, badges)
  },

  // ========== CARDS & CONTAINERS ==========
  card: {
    small: '10px',          // Small cards (product thumbnails)
    default: '12px',        // Standard cards
    large: '14px',          // Large cards
    premium: '16px',        // Premium cards (hero, featured)
  },

  // ========== INPUTS & FORM ELEMENTS ==========
  input: {
    default: '8px',         // Standard input radius
    focus: '8px',           // Focus state
  },

  // ========== MODALS & DIALOGS ==========
  modal: {
    default: '16px',        // Standard modal
    large: '20px',          // Large modal
  },

  // ========== IMAGES & MEDIA ==========
  image: {
    small: '8px',           // Small image corners
    default: '10px',        // Standard image
    large: '12px',          // Large image
    full: '9999px',         // Avatar circles
  },

  // ========== BADGES & CHIPS ==========
  badge: {
    default: '6px',         // Standard badge
    large: '8px',           // Large badge
    pill: '9999px',         // Fully rounded badge
  },
};

/**
 * Usage examples:
 *
 * React:
 * <button style={{ borderRadius: RadiusTokens.md }} />
 *
 * Tailwind:
 * <button className="rounded-lg" />
 *
 * CSS:
 * .card { border-radius: var(--radius-lg); }
 */
