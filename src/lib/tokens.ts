/**
 * Recost design tokens — JS constants for use in inline styles.
 * Source of truth for colors is globals.css (:root CSS vars).
 * These constants mirror those vars for use where Tailwind classes can't reach.
 *
 * Accent: amber/gold — cost intelligence, money, precision.
 * Theme: dark-only, minimal, Stripe-school.
 */

export const accent = '#d4900a';

export const colors = {
  // Accent (amber/gold)
  accent,
  accentSubtle:  'rgba(212, 144, 10, 0.10)',
  accentBorder:  'rgba(212, 144, 10, 0.25)',
  accentHover:   'rgba(212, 144, 10, 0.16)',

  // Backgrounds
  bgPage:    '#0a0a0a',
  bgBase:    '#111111',
  bgSubtle:  '#0d0d0d',
  bgHeader:  '#0d0d0d',
  bgHover:   '#161616',

  // Borders
  borderSubtle:  '#1e1e1e',
  borderDefault: '#262626',
  borderHover:   '#2a2a2a',

  // Text — all pass WCAG AA on #0a0a0a
  textPrimary:   '#fafafa',   // ~18:1
  textSecondary: '#a3a3a3',   // ~8.6:1
  textMuted:     '#7a7a7a',   // ~5.1:1 (replaces #525252 / #737373)

  // Semantic — error
  error:       '#f87171',
  errorSubtle: 'rgba(248, 113, 113, 0.08)',
  errorBorder: 'rgba(248, 113, 113, 0.20)',

  // Semantic — warning
  warning:       '#fbbf24',
  warningSubtle: 'rgba(251, 191, 36, 0.06)',
  warningBorder: 'rgba(251, 191, 36, 0.20)',
} as const;

/** FADE animation preset — use for page-level entrance only, not per-item lists. */
export const FADE = (delay = 0) => ({
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] as const },
});
