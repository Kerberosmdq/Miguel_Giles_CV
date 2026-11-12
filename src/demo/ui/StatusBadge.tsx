'use client';

import {
    CheckCircle2,
    XCircle,
    Clock,
    Loader,
    Circle,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/demo/lib/utils';

/* Union of every status enum used across the app:
   - work_orders:           pending | assigned | in_progress | completed | cancelled
   - preventive_executions: planned | pending_review | approved | rejected | void_pending | not_applicable
   - inventory:             active | depleted ... (use neutral)
   - generic fallback:      'neutral' | 'success' | 'info' | 'warning' | 'danger' */
export type StatusValue =
    | 'pending'
    | 'assigned'
    | 'planned'
    | 'in_progress'
    | 'pending_review'
    | 'void_pending'
    | 'not_applicable'
    | 'not_performed'
    | 'completed'
    | 'approved'
    | 'cancelled'
    | 'rejected'
    // Generic tone overrides for cases not enumerated above
    | 'neutral'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger';

type Tone = 'neutral' | 'info' | 'warning' | 'success' | 'danger';

interface StatusBadgeProps {
    /** Status enum value. Determines the tone (color palette) deterministically. */
    status: StatusValue;
    /** Localized label to display. The badge does NOT do i18n lookups; callers
     *  pass the translated string so the badge stays presentation-only. */
    label: string;
    /** sm = h-5 + 11px text. md = h-6 + 12px text. Default md. */
    size?: 'sm' | 'md';
    /** Show only the icon (no label). Useful in dense tables. */
    iconOnly?: boolean;
    /** Hide the leading status icon (label-only chip). */
    noIcon?: boolean;
    className?: string;
}

/* ─────────────────────────────────────────────────────────────────────────
   StatusBadge
   Single source of truth for rendering a status value across the app.
   Replaces the scattered `getStatusBadge()` helpers, shadcn Badge variants
   with hardcoded colors, and `cn(status === 'foo' && 'bg-green-500/10 ...')`
   one-offs.
   ───────────────────────────────────────────────────────────────────────── */
export function StatusBadge({
    status,
    label,
    size = 'md',
    iconOnly = false,
    noIcon = false,
    className,
}: StatusBadgeProps) {
    const tone = statusToTone(status);
    const Icon = statusIcons[status] ?? toneDefaultIcons[tone];
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

/* ─── Status → Tone mapping (deterministic across the app) ──────────── */
function statusToTone(status: StatusValue): Tone {
    switch (status) {
        case 'pending':
        case 'assigned':
        case 'planned':
        case 'cancelled':
        case 'not_applicable':
        case 'neutral':
            return 'neutral';
        case 'in_progress':
        case 'info':
            return 'info';
        case 'pending_review':
        case 'void_pending':
        case 'warning':
            return 'warning';
        case 'completed':
        case 'approved':
        case 'success':
            return 'success';
        case 'rejected':
        case 'not_performed':
        case 'danger':
            return 'danger';
    }
}

/* ─── Icon per specific status (overrides tone default if defined) ──── */
const statusIcons: Partial<Record<StatusValue, LucideIcon>> = {
    in_progress: Loader,
    pending: Circle,
    assigned: Circle,
    planned: Clock,
    pending_review: Clock,
    completed: CheckCircle2,
    approved: CheckCircle2,
    cancelled: XCircle,
    not_applicable: XCircle,
    not_performed: XCircle,
    rejected: XCircle,
};

const toneDefaultIcons: Record<Tone, LucideIcon> = {
    neutral: Circle,
    info: Loader,
    warning: Clock,
    success: CheckCircle2,
    danger: XCircle,
};

const palettes: Record<Tone, { bg: string; fg: string; iconColor: string }> = {
    neutral: {
        bg: 'var(--surface-sunken)',
        fg: 'var(--ink-muted)',
        iconColor: 'var(--ink-faint)',
    },
    info: {
        bg: 'var(--info-soft)',
        fg: 'var(--info-soft-ink)',
        iconColor: 'var(--info-soft-ink)',
    },
    warning: {
        bg: 'var(--warning-soft)',
        fg: 'oklch(0.45 0.15 75)',
        iconColor: 'oklch(0.55 0.16 75)',
    },
    success: {
        bg: 'var(--brand-soft)',
        fg: 'var(--brand-soft-ink)',
        iconColor: 'var(--brand)',
    },
    danger: {
        bg: 'var(--danger-soft)',
        fg: 'var(--danger)',
        iconColor: 'var(--danger)',
    },
};
