# Garde Design System

A comprehensive design system for the Garde streaming platform, built with Tailwind CSS and modern React patterns.

## 🎨 Color Palette

### Primary Colors
- **Background Base**: `#080810` — Main page background
- **Surface**: `#0D0D18` — Secondary background for inputs, dropdowns
- **Card**: `#13131F` — Card and elevated surfaces
- **Border**: `#1E1E30` — Primary border color

### Accent Colors
- **Indigo**: `#6366F1` — Primary accent for buttons, active states, CTAs
- **Indigo Dark**: `#4F46E5` — Hover state for indigo buttons
- **Gold**: `#F5C518` — Only for ratings (⭐) and award badges
- **Green**: `#22C55E` — Only for "RISING" badge on trending content
- **Red**: `#EF4444` — Error states and 18+ ratings

### Text Colors
- **Primary**: `#FFFFFF` — Main text
- **Secondary**: `#8888A8` — Meta text, descriptions
- **Tertiary**: `#6B6B7F` — Disabled states

## 🔤 Typography

### Display
- **36px / 900 / -1px tracking** — Hero titles on login page
- Used for: Main titles, special promotions

### Heading
- **20px / 700** — Section titles like "Now Showing"
- **16px / 700** — Subsection titles

### Body
- **13px / 500** — Card titles, UI text
- **12px / 400** — Meta information, descriptions
- **11px / 400** — Helper text, captions (with color: #8888A8)

### Editorial
- **18px / 300 / italic / Georgia serif** — Login page quote only
- Never use in regular UI

## 🏷️ Badge System

### Variants
| Badge | Color | Use Case | CSS |
|-------|-------|----------|-----|
| **NEW** | Indigo | Content added < 7 days | `bg-accent-indigo/20 text-accent-indigo` |
| **RISING** | Green | Fast-growing content (>1K views) | `bg-accent-green/20 text-accent-green` |
| **PREMIERE** | Gold | New releases | `bg-accent-gold/20 text-accent-gold` |
| **AWARD** | Gold | Rating >8.5 | `bg-accent-gold/20 text-accent-gold` |
| **18+** | Red | Content rating | `bg-accent-red/20 text-accent-red` |
| **FEATURED** | Indigo solid | Hero banners | `bg-accent-indigo text-white` |
| **AWARD WINNER** | Gold solid | Top content | `bg-accent-gold text-background` |
| **U/A 13+** | Neutral | Content rating | `bg-border-primary text-text-secondary` |

**Rules:**
- Use semitransparent backgrounds with colored text normally
- Use solid backgrounds only for featured/hero content
- Size: `text-[9px]` with `font-700` and `uppercase`
- Spacing: `px-1.5 py-0.5` for compact badges

## 🔘 Button System

### Variants

#### Primary (Call-to-Action)
```
Background: #6366F1 (accent-indigo)
Hover: #4F46E5 (accent-indigo-dark)
Text: white
Shadow: shadow-accent-indigo
Use for: "Watch Now", primary actions
```

#### Secondary
```
Background: rgba(255, 255, 255, 0.08)
Border: 1px rgba(255, 255, 255, 0.15)
Text: white
Backdrop: blur-md
Use for: "+ Watchlist", secondary actions
```

#### Ghost
```
Background: transparent
Border: 1px #1E1E30
Text: #8888A8 → white on hover
Use for: "More Info", tertiary actions
```

#### Gold (Premium)
```
Background: #F5C518
Text: #080810
Use for: High-value actions only
```

### Sizes
- **Small**: `px-3 py-1.5 text-[11px]`
- **Medium**: `px-4 py-2 text-[12px]` (default)
- **Large**: `px-6 py-3 text-[13px]`
- **Icon**: `h-10 w-10` (for button icons)

## 📦 Component Specs

### Content Cards
- **Aspect Ratio**: 2:3 (portrait, like movie posters)
- **Width**: 180px (with flex-shrink-0)
- **Border**: 1px #1E1E30
- **Hover**: Scale -8px, border → indigo, shadow with indigo glow
- **Overlay Actions**: Play (indigo) + Watchlist (white/10) buttons
- **Info Below**: Title (13px/500), Filmmaker · Year, Rating (gold) · Screenings

### Hero Banner
- **Height**: 92vh
- **Layout**: Content bottom-left
- **Title**: Large display typography
- **Meta**: 11px / 900 with separators (·)
- **Buttons**: Watch Now (primary) + Watchlist (secondary) + More Info (ghost)
- **Gradients**: Left-to-right + top-to-bottom for text readability

### Input Fields
- **Background**: #0D0D18
- **Border**: 1px #1E1E30
- **Focus**: 2px ring accent-indigo
- **Placeholder**: text-text-tertiary
- **Padding**: `px-3.5 py-2.5`
- **Radius**: 8px

### OTP Fields
- **Width/Height**: 44px × 52px each
- **Font**: 20px / 700 / monospace / centered
- **Active Border**: 1px accent-indigo
- **Inactive Border**: 1px #1E1E30
- **Spacing**: `gap-2`

### Navbar
- **State**: Transparent initially, solid #080810 on scroll
- **Logo**: "GARDE" with indigo dot accent (6px)
- **Text**: 12px / 500
- **Active Link**: #FFFFFF
- **Inactive Link**: #8888A8
- **Right Section**: Bell + Profile avatar (28px circle)

## 🎯 Design Rules

### All Components
1. **Indigo (#6366F1) is sacred** — Only for:
   - Primary buttons
   - Active/focus states
   - Important badges
   - Interactive accents
   - Never use for secondary elements

2. **Gold (#F5C518) is ratings-only** — Use for:
   - Star ratings (⭐)
   - Award badges
   - Premium/premiere indicators
   - Never for buttons

3. **Green (#22C55E) is trending** — Use only for:
   - "RISING" badge when >1K screenings
   - Growing stats/metrics
   - Success indicators

4. **Poetry in Motion** — All hover/focus states should:
   - De-scale on mouseout (return to original)
   - Scale up on hover (1.05x recommended)
   - Scale down on click (0.95x active)
   - Transition: duration-200

5. **Card Ratios** — Always use portrait (2:3) for:
   - Movie posters
   - Content thumbnails
   - Never landscape (16:9) for cards

6. **Terminology** — Required/standard terms:
   - "Screenings" not "Views"
   - "Filmmaker" not "Creator/Director"
   - "Watchlist" not "My List"
   - "Submit" not "Upload"
   - "Garde Originals" not "Garde Films"

7. **Layout Safe Areas** — On mobile:
   - Use `safe-x` padding for horizontal edges
   - Use `safe-y` padding for vertical edges
   - Honors notches and safe areas

## 🔌 Tailwind Configuration

All colors, shadows, and text styles are pre-configured in `tailwind.config.js`:

```js
// Usage examples
className="bg-accent-indigo text-white"           // Button
className="text-meta"                              // Meta text (11px)
className="shadow-accent-indigo"                   // Glow
className="aspect-poster"                          // 2:3 ratio
className="rounded-xl border border-border-primary" // Card
```

## 📐 Spacing System

- **Gap/Padding**: 4px increments (2, 4, 6, 8, 12, 16, 20, 24, 32)
- **Card spacing**: `mt-3 px-1` (inside cards)
- **Section padding**: `px-4 md:px-8 lg:px-12`
- **Component gaps**: `gap-2` (buttons), `gap-3` (hero buttons)

## 🔦 Accessibility

- **Focus rings**: Always `focus:ring-2 focus:ring-accent-indigo`
- **Hover states**: Visible scale changes or color shifts
- **Contrast**: All text meets WCAG AA minimum
- **Labels**: All inputs have associated labels
- **Keyboard**: All interactive elements are keyboard-accessible

## 📚 Component Import

```tsx
// Import from ui module
import { Badge, Button, Input, OTPInput, Card } from '@/components/ui';

// Usage
<Badge variant="rising">RISING</Badge>
<Button variant="primary" size="lg">Watch Now</Button>
<Input label="Email" error={false} />
```

## 🎬 Real-World Examples

### NEW Badge Logic
```tsx
const isNew = new Date(content.created_at).getTime() 
  > Date.now() - 7 * 24 * 60 * 60 * 1000;
// Shows for content < 7 days old
```

### RISING Badge Logic
```tsx
const isRising = content.view_count > 1000;
// Shows for content with >1K screenings
```

### AWARD Badge Logic
```tsx
const isAward = content.rating && parseFloat(content.rating) > 8.5;
// Shows for highly-rated content
```

## 🚀 Performance Notes

- Tailwind purges unused styles in production
- All colors use CSS custom properties for easy theming
- Shadows are optimized with GPU acceleration
- Animations use `will-change` and `transform` for smoothness

---

**Last Updated**: March 22, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production-ready
