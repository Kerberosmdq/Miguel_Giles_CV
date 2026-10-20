'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import {
    Clock,
    ClipboardCheck,
    Package,
    AlertTriangle,
    AlertCircle,
    Box,
    History,
    PlusCircle,
    Search,
    Settings2,
    Sparkles,
    ChevronRight,
} from 'lucide-react';
import { cn } from '@/demo/lib/utils';
import { AnimatedNumber } from '@/demo/ui/AnimatedNumber';
import { buttonVariants } from '@/demo/ui/button';
import { DEMO_USER, PANEL_KPIS, WALL_CLOSED_DAYS, WALL_OPEN_DAYS, type KpiKey, type WallEntry } from '../demo-data';
import type { SceneProps } from '.';

/*
 * Réplica del Panel de Control (app/[locale]/(dashboard)/dashboard/page.tsx):
 * saludo + KPICard + TheWall. Mismas clases, tokens y textos de la app.
 */

const KPI_ICONS: Record<KpiKey, React.ComponentType<{ className?: string }>> = {
    pendingRequests: Clock,
    pendingReviews: ClipboardCheck,
    lowStock: Package,
    highPriority: AlertTriangle,
};

const PALETTES = {
    warning: { bg: 'var(--warning-soft)', fg: 'oklch(0.45 0.15 75)' },
    brand: { bg: 'var(--brand-soft)', fg: 'var(--brand-soft-ink)' },
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

function greetingKey(): 'greetingMorning' | 'greetingAfternoon' | 'greetingEvening' {
    const h = new Date().getHours();
    if (h < 12) return 'greetingMorning';
    if (h < 20) return 'greetingAfternoon';
    return 'greetingEvening';
}

export function PanelScene({ compact = false }: SceneProps) {
    const t = useTranslations('Dashboard');
    const tw = useTranslations('Dashboard.bitacora');
    const td = useTranslations('Landing.demo.wall');
    const locale = useLocale();

    const closedLabels = useMemo(() => {
        const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' });
        return WALL_CLOSED_DAYS.map((d) => {
            const date = new Date();
            date.setDate(date.getDate() - d.offset);
            return { label: fmt.format(date), count: d.count };
        });
    }, [locale]);

    const all = WALL_OPEN_DAYS.flatMap((d) => d.entries);
    const closedTotal = WALL_CLOSED_DAYS.reduce((s, d) => s + d.count, 0);
    const counts = {
        all: all.length + closedTotal,
        urgent: all.filter((e) => e.priority === 'urgent').length,
        warning: all.filter((e) => e.priority === 'warning').length,
    };
    const infoCount = counts.all - counts.urgent - counts.warning;

    const days = compact ? WALL_OPEN_DAYS.slice(0, 1) : WALL_OPEN_DAYS;
    let row = 0;

    return (
        <div className={cn('mx-auto max-w-7xl space-y-5', compact ? 'p-4' : 'p-6')}>
            <motion.header
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex items-center justify-between gap-4 border-b border-border-subtle pb-4"
            >
                <div className="min-w-0 space-y-0.5">
                    <h3 className="text-[1rem] font-medium leading-tight tracking-tight text-ink-soft">
                        {t(greetingKey(), { name: DEMO_USER.firstName })}
                    </h3>
                    <p className="text-[0.75rem] text-ink-muted">{t('summary')}</p>
                </div>
                {!compact && <Box className="h-10 w-10 shrink-0 text-ink-faint" aria-hidden />}
            </motion.header>

            <section className={cn('grid gap-3', compact ? 'grid-cols-2' : 'grid-cols-6')}>
                {PANEL_KPIS.map((k, i) => {
                    const Icon = KPI_ICONS[k.key];
                    const p = PALETTES[k.tone];
                    return (
                        <motion.div
                            key={k.key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: EASE }}
                            className="flex min-h-[104px] flex-col justify-between rounded-lg border bg-surface p-4"
                            style={{ borderColor: 'var(--border-subtle)' }}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <span className="text-[0.6875rem] font-semibold uppercase leading-tight tracking-wider text-ink-muted">
                                    {t(`kpis.${k.key}`)}
                                </span>
                                <span
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                                    style={{ backgroundColor: p.bg, color: p.fg }}
                                >
                                    <Icon className="h-[14px] w-[14px]" />
                                </span>
                            </div>
                            <div className="mt-2 flex flex-col">
                                <span className="text-[1.625rem] font-semibold leading-none tabular-nums text-ink">
                                    <AnimatedNumber value={k.value} duration={900} />
                                </span>
                                <span className="mt-1.5 text-[0.6875rem] leading-tight text-ink-muted">
                                    {t(`kpis.${k.key}Meta`)}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </section>

            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.3, ease: EASE }}
                className="overflow-hidden rounded-xl border bg-surface"
                style={{ borderColor: 'var(--border-subtle)' }}
            >
                <header className="flex items-center justify-between gap-3 border-b border-border-subtle bg-surface-sunken px-4 py-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <History className="h-4 w-4 shrink-0 text-ink-muted" />
                        <h4 className="truncate text-[0.9375rem] font-semibold tracking-tight text-ink">{tw('title')}</h4>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        {!compact && (
                            <div className="relative w-56">
                                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint" />
                                <div className="flex h-8 items-center rounded-md border border-input bg-surface pl-8 text-[0.8125rem] text-ink-faint">
                                    {tw('search')}
                                </div>
                            </div>
                        )}
                        <span className={cn(buttonVariants({ size: 'sm' }), 'h-8 shrink-0 gap-1.5 px-3')}>
                            <PlusCircle className="h-3.5 w-3.5" />
                            {!compact && <span className="text-[0.8125rem] font-medium">{tw('newEntry')}</span>}
                        </span>
                    </div>
                </header>

                <div className="flex flex-wrap items-center gap-1.5 border-b border-border-subtle px-4 py-2">
                    <Chip active label={`${tw('filterAll')} · ${counts.all}`} />
                    <Chip label={`${tw('filterUrgent')} · ${counts.urgent}`} />
                    <Chip label={`${tw('filterWarning')} · ${counts.warning}`} />
                    <Chip label={`${tw('filterInfo')} · ${infoCount}`} />
                </div>

                <div>
                    {days.map((day) => (
                        <div key={day.offset}>
                            <DayDivider
                                label={day.offset === 0 ? tw('groupToday') : tw('groupYesterday')}
                                count={day.entries.length}
                                open
                            />
                            <ul className="divide-y divide-border-subtle">
                                {day.entries.map((e) => {
                                    const delay = 0.45 + row++ * 0.06;
                                    return (
                                        <motion.li
                                            key={e.key}
                                            initial={{ opacity: 0, x: -6 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.35, delay, ease: EASE }}
                                        >
                                            <EntryRow entry={e} text={td(e.key, e.values ?? {})} tag={e.kind === 'system' ? td(`${e.key}Tag`) : null} nexi={tw('nexi')} ai={tw('aiBadge')} urgent={tw('filterUrgent')} warning={tw('filterWarning')} compact={compact} />
                                        </motion.li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                    {!compact &&
                        closedLabels.map((d) => <DayDivider key={d.label} label={d.label} count={d.count} open={false} />)}
                </div>
            </motion.section>
        </div>
    );
}

function Chip({ label, active = false }: { label: string; active?: boolean }) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-1 text-[0.75rem] font-medium',
                !active && 'border-border-subtle text-ink-soft',
            )}
            style={active ? { backgroundColor: 'var(--ink-soft)', borderColor: 'var(--ink-soft)', color: 'var(--neutral-0)' } : undefined}
        >
            {label}
        </span>
    );
}

function DayDivider({ label, count, open }: { label: string; count: number; open: boolean }) {
    return (
        <div className="flex w-full items-center gap-2 border-b border-border-subtle bg-surface-sunken px-4 py-1.5 text-left">
            <ChevronRight className={cn('h-3 w-3 text-ink-muted', open && 'rotate-90')} />
            <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-muted">{label}</span>
            <span className="font-mono text-[0.6875rem] tabular-nums text-ink-faint">· {count}</span>
            <div className="ml-1 h-px flex-1 bg-border-subtle" />
        </div>
    );
}

interface EntryRowProps {
    entry: WallEntry;
    text: string;
    tag: string | null;
    nexi: string;
    ai: string;
    urgent: string;
    warning: string;
    compact: boolean;
}

function EntryRow({ entry: e, text, tag, nexi, ai, urgent, warning, compact }: EntryRowProps) {
    if (e.kind === 'nexi') {
        return (
            <div className="flex items-center gap-2.5 px-4 py-2">
                <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded"
                    style={{ backgroundColor: 'var(--info-soft)', color: 'var(--info-soft-ink)' }}
                >
                    <Sparkles className="h-3 w-3" />
                </span>
                <div className="flex shrink-0 items-center gap-1.5">
                    <span className="text-[0.8125rem] font-semibold text-ink">{nexi}</span>
                    <span
                        className="rounded px-1 py-0.5 text-[0.625rem] font-bold leading-none tracking-wide"
                        style={{ backgroundColor: 'var(--info-soft)', color: 'var(--info-soft-ink)' }}
                    >
                        {ai}
                    </span>
                </div>
                <span className="min-w-0 flex-1 truncate font-mono text-[0.8125rem] text-ink-soft">{text}</span>
                <span className="shrink-0 font-mono text-[0.6875rem] tabular-nums text-ink-faint">{e.time}</span>
            </div>
        );
    }

    if (e.kind === 'system') {
        return (
            <div className="flex items-center gap-2.5 px-4 py-2">
                <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded"
                    style={{ backgroundColor: 'var(--surface-sunken)', color: 'var(--ink-muted)' }}
                >
                    <Settings2 className="h-3 w-3" />
                </span>
                {tag && (
                    <span className="shrink-0 text-[0.6875rem] font-semibold uppercase tracking-wide text-ink-muted">{tag}</span>
                )}
                <span className="min-w-0 flex-1 truncate text-[0.8125rem] text-ink-soft">{text}</span>
                <span className="shrink-0 font-mono text-[0.6875rem] tabular-nums text-ink-faint">{e.time}</span>
            </div>
        );
    }

    const isUrgent = e.priority === 'urgent';
    const isWarning = e.priority === 'warning';
    const initials = (e.author ?? '')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div
            className={cn('flex gap-3 px-4 py-3', (isUrgent || isWarning) && 'border-l-2')}
            style={
                isUrgent
                    ? { borderLeftColor: 'var(--danger)', backgroundColor: 'var(--danger-soft)' }
                    : isWarning
                      ? { borderLeftColor: 'oklch(0.65 0.16 75)', backgroundColor: 'var(--warning-soft)' }
                      : undefined
            }
        >
            <span
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.6875rem] font-semibold"
                style={{ backgroundColor: 'var(--brand-soft)', color: 'var(--brand-soft-ink)' }}
            >
                {initials}
            </span>
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-1.5">
                        <span className="truncate text-[0.8125rem] font-semibold text-ink">{e.author}</span>
                        {isUrgent && (
                            <span
                                className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[0.6875rem] font-semibold"
                                style={{ backgroundColor: 'var(--danger)', color: 'var(--neutral-0)' }}
                            >
                                <AlertCircle className="h-2.5 w-2.5" />
                                {urgent}
                            </span>
                        )}
                        {isWarning && (
                            <span
                                className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[0.6875rem] font-semibold"
                                style={{ backgroundColor: 'oklch(0.65 0.16 75)', color: 'var(--neutral-0)' }}
                            >
                                <AlertTriangle className="h-2.5 w-2.5" />
                                {warning}
                            </span>
                        )}
                    </div>
                    <span className="shrink-0 font-mono text-[0.6875rem] tabular-nums text-ink-faint">{e.time}</span>
                </div>
                <p className={cn('mt-0.5 text-[0.8125rem] leading-snug text-ink-soft', compact && 'line-clamp-2')}>{text}</p>
                {e.asset && !compact && (
                    <div className="mt-1.5 inline-flex items-center gap-1 rounded border border-border-subtle bg-surface-sunken px-1.5 py-0.5 text-[0.6875rem] font-medium text-ink-muted">
                        <Box className="h-2.5 w-2.5" />
                        {e.asset}
                    </div>
                )}
            </div>
        </div>
    );
}
