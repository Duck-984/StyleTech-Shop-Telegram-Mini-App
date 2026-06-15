/**
 * Design System Theme Export
 * Central hub for all design tokens and semantic values
 *
 * Usage:
 * import { theme } from '@/design-system/theme'
 * 
 * const bgColor = theme.colors.background.primary
 * const spacing = theme.spacing.lg
 */

import { ColorTokens, SemanticColors } from './tokens/colors';
import { SpacingTokens, SemanticSpacing, LayoutSpacing } from './tokens/spacing';
import { RadiusTokens, SemanticRadius } from './tokens/radius';
import { ShadowTokens, SemanticShadows } from './tokens/shadows';
import { TypographyTokens, SemanticTypography } from './tokens/typography';

export const theme = {
  colors: {
    ...ColorTokens,
    semantic: SemanticColors,
  },
  spacing: {
    ...SpacingTokens,
    semantic: SemanticSpacing,
    layout: LayoutSpacing,
  },
  radius: {
    ...RadiusTokens,
    semantic: SemanticRadius,
  },
  shadows: {
    ...ShadowTokens,
    semantic: SemanticShadows,
  },
  typography: {
    ...TypographyTokens,
    semantic: SemanticTypography,
  },
};

/**
 * Preset for Tailwind CSS configuration
 * Can be used with tailwind.config.js to extend Tailwind theme
 */
export const tailwindPreset = {
  theme: {
    extend: {
      colors: {
        bg: ColorTokens.background,
        surface: ColorTokens.surface,
        text: ColorTokens.text,
        accent: ColorTokens.accent,
        status: ColorTokens.status,
      },
      spacing: SpacingTokens,
      borderRadius: RadiusTokens,
      boxShadow: ShadowTokens,
      fontFamily: TypographyTokens.fontFamily,
      fontSize: TypographyTokens.fontSize,
      fontWeight: TypographyTokens.fontWeight,
      letterSpacing: TypographyTokens.letterSpacing,
    },
  },
};

export default theme;
