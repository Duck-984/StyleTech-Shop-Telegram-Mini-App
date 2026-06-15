/**
 * Design System Exports
 * Central barrel export for all design tokens and utilities
 *
 * Usage:
 * import { theme, ColorTokens, SpacingTokens } from '@/design-system'
 */

// ========== TOKENS ==========
export { ColorTokens, SemanticColors } from './tokens/colors';
export { SpacingTokens, SemanticSpacing, LayoutSpacing } from './tokens/spacing';
export { RadiusTokens, SemanticRadius } from './tokens/radius';
export { ShadowTokens, SemanticShadows } from './tokens/shadows';
export { TypographyTokens, SemanticTypography } from './tokens/typography';

// ========== THEME ==========
export { theme, tailwindPreset } from './theme';
export { default as defaultTheme } from './theme';

// ========== TYPES (Optional - for TypeScript users) ==========
export type {
  // Colors
  ColorTokens as IColorTokens,
  SemanticColors as ISemanticColors,
  
  // Spacing
  SpacingTokens as ISpacingTokens,
  SemanticSpacing as ISemanticSpacing,
  LayoutSpacing as ILayoutSpacing,
  
  // Radius
  RadiusTokens as IRadiusTokens,
  SemanticRadius as ISemanticRadius,
  
  // Shadows
  ShadowTokens as IShadowTokens,
  SemanticShadows as ISemanticShadows,
  
  // Typography
  TypographyTokens as ITypographyTokens,
  SemanticTypography as ISemanticTypography,
};
