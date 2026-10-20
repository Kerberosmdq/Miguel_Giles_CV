'use client';

import { AlertOctagon, AlertTriangle, Minus, Circle, type LucideIcon } from 'lucide-react';
import { cn } from '@/demo/lib/utils';

export type PriorityValue = 'low' | 'medium' | 'high' | 'critical';

type Tone = 'info' | 'neutral' | 'warning' | 'danger';

interface PriorityBadgeProps {
    /** Priority enum value. Determines tone deterministically. */
    priority: PriorityValue;
    /** Localized label (e.g. "Crítica", "Critical", "Kritisch"). The caller
     *  handles i18n; the badge stays presentation-only. */
    label: string;
    /** sm = h-5 + 11px text. md = h-6 + 12px text. Default md. */
    size?: 'sm' | 'md';
    /** Show only the icon (no label). For dense tables / cells. */
    iconOnly?: boolean;
    /** Hide the leading icon. */
    noIcon?: boolean;
    className?: string;
}

/* ─────────────────────────────────────────────────────────────────────────
   PriorityBadge
   Replaces the scattered `getPriorityBadge()` helpers and per-component
   `cn(priority === 'critical' && 'bg-red-100 text-red-700 ...')` blocks.
   ───────────────────────────────────────────────────────────────────────── */
export function PriorityBadge({
    priority,
    label,
    size = 'md',
    iconOnly = false,
    noIcon = false,
    className,
}: PriorityBadgeProps) {
    const tone = priorityToTone(priority);
    const Icon = priorityIcons[priority];
    const palette = palettes[tone];

    const dims =
        size === 'sm'
            ? { h: 'h-5', px: 'px-1.5', text: 'text-[0.6875rem]', icon: 'h-3 w-3' }
            : { h: 'h-6', px: 'px-2', text: 'text-[0.75rem]', icon: 'h-3.5 w-3.5' };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-md font-medium whitespace-nowrap',
                dims.h,
                iconOnly ? 'w-6 justify-center px-0' : dims.px,
                dims.text,
                className,
            )}
            style={{ backgroundColor: palette.bg, color: palette.fg }}
            title={iconOnly ? label : undefined}
        >
            {!noIcon && (
                <Icon
                    className={cn(dims.icon, 'shrink-0')}
                    style={{ color: palette.iconColor }}
                    aria-hidden
                />
            )}
            {!iconOnly && <span className="truncate">{label}</span>}
        </span>
    );
}

/* ─── Priority → Tone mapping ───────────────────────────────────────── */
function priorityToTone(priority: PriorityValue): Tone {
    switch (priority) {
        case 'critical': return 'danger';
        case 'high':     return 'warning';
        case 'medium':   return 'neutral';
        case 'low':      return 'info';
    }
}

const priorityIcons: Record<PriorityValue, LucideIcon> = {
    critical: AlertOctagon,
    high:     AlertTriangle,
    medium:   Circle,
    low:      Minus,
};

const palettes: Record<Tone, { bg: string; fg: string; iconColor: string }> = {
    info: {
        bg: 'var(--info-soft)',
        fg: 'var(--info-soft-ink)',
        iconColor: 'var(--info-soft-ink)',
    },
    neutral: {
        bg: 'var(--surface-sunken)',
        fg: 'var(--ink-muted)',
        iconColor: 'var(--ink-faint)',
    },
    warning: {
        bg: 'var(--warning-soft)',
        fg: 'oklch(0.45 0.15 75)',
        iconColor: 'oklch(0.55 0.16 75)',
    },
    danger: {
        bg: 'var(--danger-soft)',
        fg: 'var(--danger)',
        iconColor: 'var(--danger)',
    },
};
