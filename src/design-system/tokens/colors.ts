/**
 * Color Tokens — Light Premium Minimal System
 * Based on MASTER PROMPT: Custom Wear / Premium Minimal aesthetic
 *
 * Philosophy:
 * - Calm, clean, trustworthy
 * - Apple-like clarity
 * - Fashion/apparel focused
 * - Production-ready (not concept)
 */

export const ColorTokens = {
  // ========== BACKGROUND SYSTEM ==========
  background: {
    primary: '#FAF8F5',     // Main app background (light cream)
    secondary: '#F6F2EE',   // Secondary backgrounds
    tertiary: '#F0EBE5',    // Hover/active states
  },

  // ========== SURFACE SYSTEM (Cards, Containers) ==========
  surface: {
    1: '#FFFFFF',           // Pure white — main cards
    2: '#FDFBF9',           // Off-white — nested surfaces
    3: '#F9F6F2',           // Light cream — layering
    hover: '#FFFCF9',       // Hover state
  },

  // ========== TEXT HIERARCHY ==========
  text: {
    primary: '#0E0E0E',     // Deep black — headlines, primary text
    secondary: '#8F8F8F',   // Medium gray — secondary text
    muted: '#BEBEBE',       // Light gray — placeholders, hints
    inverse: '#FFFFFF',     // White text on dark backgrounds
  },

  // ========== ACCENT SYSTEM (Minimal, Restrained) ==========
  accent: {
    primary: '#0E0E0E',     // Deep black — CTA buttons, key elements
    secondary: '#6B6B6B',   // Soft gray — secondary actions
    tertiary: '#A8A8A8',    // Light gray — tertiary actions
  },

  // ========== STATUS / SEMANTIC COLORS ==========
  status: {
    success: '#4A9D6F',     // Muted green — delivered, active
    warning: '#D4A574',     // Muted warm brown — processing
    danger: '#C4756B',      // Muted rose — cancelled, error
    info: '#7A95B0',        // Muted blue — neutral info
  },

  // ========== BORDERS & DIVIDERS ==========
  border: {
    light: '#E8E3DB',       // Very light border
    DEFAULT: '#D4CCC2',     // Standard border
    dark: '#B8AFA0',        // Darker border for emphasis
  },

  // ========== OVERLAY & BACKDROP ==========
  overlay: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.2)',
    dark: 'rgba(0, 0, 0, 0.5)',
  },
};

// ========== SEMANTIC COLOR ALIASES ==========
export const SemanticColors = {
  // Primary actions (CTA buttons, key interactions)
  primary: ColorTokens.accent.primary,

  // Secondary actions (outline buttons, alternatives)
  secondary: ColorTokens.accent.secondary,

  // Neutral backgrounds
  neutral: ColorTokens.background.primary,

  // Disabled state
  disabled: ColorTokens.text.muted,

  // Success feedback
  success: ColorTokens.status.success,

  // Warning state
  warning: ColorTokens.status.warning,

  // Error state
  error: ColorTokens.status.danger,

  // Info state
  info: ColorTokens.status.info,
};

/**
 * Usage examples:
 *
 * React component:
 * <button className="bg-[#0E0E0E] text-white" />
 *
 * Or use Tailwind classes:
 * <button className="bg-accent text-text-primary" />
 *
 * TypeScript:
 * const bgColor = ColorTokens.background.primary;
 */
