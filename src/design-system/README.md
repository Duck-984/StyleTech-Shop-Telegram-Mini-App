# 🎨 Design System — Light Premium Minimal

**Version:** 1.0.0  
**Status:** Production Ready  
**Last Updated:** 2026-06-15

---

## 📋 Overview

This is the **Design System** for StyleTech Shop — a premium, minimal, Apple-like UI system based on the **Custom Wear / Premium Minimal** aesthetic.

### Philosophy

- **Premium:** Clean, trustworthy, high-quality
- **Minimal:** No visual noise, purposeful design
- **Calm:** Easy on the eyes, generous spacing
- **Apple-like:** Clear hierarchy, subtle interactions
- **Production-ready:** Not a concept, real e-commerce system

---

## 🎯 Core Values

✅ Consistency → All components follow the same rules  
✅ Predictability → Colors, spacing, typography are systematic  
✅ Scalability → System grows without breaking  
✅ Accessibility → WCAG AA compliant, readable  
✅ Performance → Minimal CSS, optimized Tailwind  

---

## 📁 Directory Structure

```
src/design-system/
├── tokens/
│   ├── colors.ts          # Color palette + semantic aliases
│   ├── spacing.ts         # 8px base unit system
│   ├── radius.ts          # Border radius scale
│   ├── shadows.ts         # Subtle shadow system
│   ├── typography.ts      # Font sizes, weights, hierarchy
│   └── index.ts          # (optional) Token exports
├── theme.ts              # Central theme export
└── README.md             # (this file)
```

---

## 🎨 Color Palette

### Background System (Light Premium Minimal)

| Token | Value | Use Case |
|-------|-------|----------|
| `bg-primary` | `#FAF8F5` | Main app background |
| `bg-secondary` | `#F6F2EE` | Alternative background |
| `bg-tertiary` | `#F0EBE5` | Hover/active states |

### Surface System (Cards & Containers)

| Token | Value | Use Case |
|-------|-------|----------|
| `surface-1` | `#FFFFFF` | Main cards, high contrast |
| `surface-2` | `#FDFBF9` | Nested surfaces |
| `surface-3` | `#F9F6F2` | Layering, subtle background |

### Text Hierarchy

| Token | Value | Use Case |
|-------|-------|----------|
| `text-primary` | `#0E0E0E` | Headlines, main text |
| `text-secondary` | `#8F8F8F` | Secondary text |
| `text-muted` | `#BEBEBE` | Placeholder, hints |

### Accent System (Restrained)

| Token | Value | Use Case |
|-------|-------|----------|
| `accent-DEFAULT` | `#0E0E0E` | CTA buttons, key elements |
| `accent-soft` | `#6B6B6B` | Secondary actions |

### Status Colors (Soft, Muted)

| Token | Value | Use Case |
|-------|-------|----------|
| `status-success` | `#4A9D6F` | Delivered, active ✅ |
| `status-warning` | `#D4A574` | Processing ⚠️ |
| `status-danger` | `#C4756B` | Cancelled, error ❌ |
| `status-info` | `#7A95B0` | Neutral info ℹ️ |

---

## 📐 Spacing System

**Base Unit:** 8px (multiples of 4px)

| Token | Value | Use Case |
|-------|-------|----------|
| `xs` | `4px` | Tight spacing |
| `sm` | `6px` | Small spacing |
| `base` | `8px` | Base unit |
| `md` | `12px` | Medium |
| `lg` | `16px` | Large |
| `xl` | `20px` | Extra large |
| `2xl` | `24px` | 2× large |
| `3xl` | `28px` | 3× large |
| `4xl` | `32px` | 4× large |

---

## 🔘 Border Radius Scale

| Token | Value | Use Case |
|-------|-------|----------|
| `none` | `0px` | Sharp corners |
| `xs` | `6px` | Small elements |
| `sm` | `8px` | Inputs, small cards |
| `md` | `10px` | Default |
| `lg` | `12px` | Main cards |
| `xl` | `14px` | Large cards |
| `2xl` | `16px` | Premium cards |
| `3xl` | `20px` | Modals |
| `full` | `9999px` | Badges, pills |

---

## 🌑 Shadow System

### Principle: Subtle, Minimal, Premium

Shadows are used **only** for layer separation, never for dramatic effect.

| Token | Value | Use Case |
|-------|-------|----------|
| `shadow-xs` | Very faint | Barely visible |
| `shadow-sm` | Subtle | Default card shadow |
| `shadow-md` | Noticeable | Featured card |
| `shadow-lg` | Elevated | Modal |
| `shadow-xl` | Strong | Floating elements |

---

## 🔤 Typography System

### Font Family
- **Primary:** `Inter` (fallback: system-ui)
- **Monospace:** `Menlo, Monaco`

### Font Sizes

| Class | Size | Line Height | Use Case |
|-------|------|-------------|----------|
| `text-xs` | 12px | 16px | Captions, hints |
| `text-sm` | 14px | 20px | Labels, small text |
| `text-base` | 16px | 24px | Body text (default) |
| `text-lg` | 18px | 28px | Large body |
| `text-xl` | 20px | 28px | Subheadings |
| `text-2xl` | 24px | 32px | Headings |
| `text-3xl` | 28px | 36px | Large headings |

### Font Weights

| Name | Value | Use Case |
|------|-------|----------|
| `light` | 300 | Decorative |
| `normal` | 400 | Body text |
| `medium` | 500 | Labels, buttons |
| `semibold` | 600 | Headings |
| `bold` | 700 | Strong emphasis |

---

## 💻 Usage Examples

### React Component

```tsx
import { theme } from '@/design-system/theme';

export const ProductCard = () => {
  return (
    <div
      style={{
        backgroundColor: theme.colors.surface[1],
        borderRadius: theme.radius.lg,
        padding: theme.spacing.lg,
        boxShadow: theme.shadows.semantic.card.default,
      }}
    >
      <h3 style={theme.typography.semantic.headline.h3}>
        Product Name
      </h3>
      <p style={theme.typography.semantic.body.sm}>
        Product description
      </p>
    </div>
  );
};
```

### Tailwind CSS

```html
<!-- Background -->
<div class="bg-bg-primary">
  <!-- Surface -->
  <div class="bg-surface-1 rounded-lg shadow-card p-4 gap-3">
    <!-- Text -->
    <h3 class="text-2xl font-semibold text-text-primary">Heading</h3>
    <p class="text-base text-text-secondary">Body text</p>
    
    <!-- Button -->
    <button class="bg-accent text-white px-4 py-2 rounded-md font-medium">
      CTA Button
    </button>
  </div>
</div>
```

### CSS Variables (Optional)

```css
:root {
  --bg-primary: #FAF8F5;
  --surface-1: #FFFFFF;
  --text-primary: #0E0E0E;
  --spacing-base: 8px;
  --radius-lg: 12px;
  --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card {
  background: var(--surface-1);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}
```

---

## 🚀 Implementation Checklist

- [x] Color tokens (Light Premium Minimal)
- [x] Spacing tokens (8px system)
- [x] Border radius scale
- [x] Shadow system (subtle)
- [x] Typography scale
- [x] Tailwind config extended
- [ ] Component library (Button, Card, Input, etc.)
- [ ] Storybook documentation
- [ ] Admin panel update
- [ ] Telegram Mini App update

---

## 🎯 Next Steps

### Phase 2: Component Skinning

Once tokens are locked:

1. **Button Component** (primary, secondary, ghost)
2. **Card Component** (standard, elevated, hover)
3. **Input Component** (text, search, focus states)
4. **Badge Component** (status, tags)
5. **Layout System** (grid, spacing fixes)

### Phase 3: Screen Polish

1. Update **Catalog** screen
2. Update **Product Detail** screen
3. Update **Cart** screen
4. Update **Checkout** screen
5. Update **Admin Dashboard**
6. Update **Admin Products**

---

## 📖 References

- **Design System Philosophy:** Light Premium Minimal (Custom Wear aesthetic)
- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS v3
- **Color Methodology:** Light mode, minimal contrast
- **Spacing:** 8px base unit
- **Typography:** Inter font family

---

## 💬 Questions?

Refer to MASTER PROMPT for detailed specifications:
- Color palette constraints
- UX/Function lock rules
- Component requirements
- Admin panel specs

---

**Created by:** Design System v1.0  
**Last Updated:** 2026-06-15  
**Status:** ✅ Production Ready
