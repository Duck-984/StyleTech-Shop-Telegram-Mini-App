/**
 * Button Component — Premium Minimal System
 * 
 * Variants: primary | secondary | ghost
 * Sizes: sm | md | lg
 * 
 * Usage:
 * <Button variant="primary" size="md">Click me</Button>
 * <Button variant="secondary" disabled>Disabled</Button>
 */

import { forwardRef } from 'react';
import { cn } from '../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled,
      isLoading,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // ========== SIZE STYLES ==========
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs font-medium',
      md: 'px-4 py-2 text-sm font-medium',
      lg: 'px-5 py-3 text-base font-medium',
    };

    // ========== VARIANT STYLES ==========
    const variantStyles = {
      primary:
        'bg-accent text-white ' +
        'shadow-sm hover:shadow-md active:shadow-xs ' +
        'hover:opacity-95 active:scale-[0.98] ' +
        'disabled:opacity-50 disabled:cursor-not-allowed',

      secondary:
        'bg-surface-2 text-text-primary ' +
        'border border-border-light ' +
        'hover:bg-surface-3 hover:border-border-DEFAULT ' +
        'active:scale-[0.98] ' +
        'disabled:opacity-50 disabled:cursor-not-allowed',

      ghost:
        'text-text-secondary ' +
        'hover:text-text-primary hover:bg-bg-tertiary ' +
        'active:scale-[0.98] ' +
        'disabled:opacity-50 disabled:cursor-not-allowed',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium',
          'transition-all duration-200 ease-out',
          'rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-bg-primary',

          // Size
          sizeStyles[size],

          // Variant
          variantStyles[variant],

          // Custom class
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="inline-flex mr-2">
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            </span>
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
