'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { ClipboardList, UserPlus, Plus, Search, Factory, ArrowRightLeft, SprayCan, Wrench, ChevronDown, ChevronsUpDown, Clock } from 'lucide-react';
import { cn } from '@/demo/lib/utils';
import { buttonVariants } from '@/demo/ui/button';
import { Badge } from '@/demo/ui/badge';
import { Avatar, AvatarFallback } from '@/demo/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/demo/ui/table';
import { StatusBadge } from '@/demo/ui/StatusBadge';
import { PriorityBadge } from '@/demo/ui/PriorityBadge';
import { STORY_OT, WORK_ORDERS, WO_TOTALS, type DemoOperatorReport, type DemoWorkOrder } from '../demo-data';
import type { SceneProps } from '.';

/*
 * Réplica de la lista de Órdenes de Trabajo (work-orders/page.tsx +
 * WorkOrdersClient + WorkOrderRow + OperatorReportRow), pestaña "Todas".
 * Usa los mismos componentes de UI de la app (tabla, StatusBadge,
 * PriorityBadge, Avatar) con datos ficticios.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const TYPE_TOKENS: Record<string, { bg: string; ink: string }> = {
    corrective: { bg: 'var(--danger-soft)', ink: 'var(--danger-soft-ink)' },
    preventive: { bg: 'var(--info-soft)', ink: 'var(--info-soft-ink)' },
    predictive: { bg: 'var(--warning-soft)', ink: 'var(--warning-soft-ink)' },
};

const MOBILE_TYPE_STYLE: Record<string, React.CSSProperties> = {
    corrective: { backgroundColor: 'var(--danger-soft)', color: 'var(--danger-soft-ink)', borderColor: 'var(--danger-soft)' },
    preventive: { backgroundColor: 'var(--brand-soft)', color: 'var(--brand)', borderColor: 'var(--brand-soft)' },
    predictive: { backgroundColor: 'var(--warning-soft)', color: 'var(--warning-soft-ink)', borderColor: 'var(--warning-soft)' },
};

/** Mismo criterio que la app: dos primeras letras del nombre completo. */
const initials = (name: string) => name.substring(0, 2).toUpperCase();

function useDateFormatter() {
    const locale = useLocale();
    return useMemo(() => {
        const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' });
        return (daysAgo: number) => {
            const d = new Date();
            d.setDate(d.getDate() - daysAgo);
            return fmt.format(d);
        };
    }, [locale]);
}

export function WorkOrdersScene({ compact = false }: SceneProps) {
    const t = useTranslations('WorkOrders');
    const tf = useTranslations('WorkOrders.filters');
    const tOr = useTranslations('OperatorReports');
    const tDemo = useTranslations('Landing.demo.wo');
    const date = useDateFormatter();

    const assetLabel = (r: { asset: string; subAsset?: string }) => (r.subAsset ? `${r.asset} › ${r.subAsset}` : r.asset);

    const header = (
        <motion.header
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className={cn('mb-1 flex gap-4 border-b pb-3', compact ? 'flex-col gap-2' : 'items-end justify-between')}
            style={{ borderColor: 'var(--border-subtle)' }}
        >
            <div className="min-w-0 space-y-0.5">
                <h3 className="truncate text-[1.125rem] font-semibold leading-tight tracking-tight text-ink">{t('title')}</h3>
                <p className="text-[0.8125rem] leading-snug text-ink-muted">{t('subtitle')}</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
                {!compact && (
                    <span className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}>
                        <ClipboardList className="h-4 w-4" />
                        <span>{t('workOrderRequests')}</span>
                    </span>
                )}
                <span className={cn(buttonVariants({ size: compact ? 'sm' : 'default' }), 'gap-2')}>
                    <UserPlus className="h-4 w-4" />
                    <span>{t('assignOrder')}</span>
                </span>
                <span className={cn(buttonVariants({ variant: 'outline', size: compact ? 'sm' : 'default' }), 'gap-2')}>
                    <Plus className="h-4 w-4" />
                    <span>{t('newOrderShort')}</span>
                </span>
            </div>
        </motion.header>
    );

    const tabs = (
        <div className="inline-flex flex-wrap items-center gap-0.5 rounded-lg p-1" style={{ backgroundColor: 'var(--surface-sunken)' }}>
            {(
                [
                    { key: 'all', label: tf('all'), count: 0 },
                    { key: 'open', label: tf('open'), count: WO_TOTALS.open },
                    { key: 'closed', label: tf('closed'), count: 0 },
                    { key: 'reports', label: t('operatorReports'), count: WO_TOTALS.reports },
                ] as const
            ).map((tab) => {
                const active = tab.key === 'all';
                return (
                    <span
                        key={tab.key}
                        className={cn('relative rounded-md px-3.5 py-1.5 text-sm font-medium', active ? 'text-ink' : 'text-ink-muted')}
                    >
                        {active && <span className="absolute inset-0 rounded-md shadow-sm" style={{ backgroundColor: 'var(--surface)' }} />}
                        <span className="relative z-10 flex items-center gap-2">
                            {tab.label}
                            {tab.count > 0 && (
                                <span
                                    className="inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none"
                                    style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                                >
                                    {tab.count}
                                </span>
                            )}
                        </span>
                    </span>
                );
            })}
        </div>
    );

    if (compact) {
        return (
            <div className="space-y-4 p-4">
                {header}
                <div className="space-y-2">
                    {WORK_ORDERS.filter((r): r is DemoWorkOrder => r.kind === 'wo')
                        .slice(0, 5)
                        .map((wo, i) => (
                            <motion.div
                                key={wo.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: 0.15 + i * 0.07, ease: EASE }}
                                className="space-y-3 rounded-xl border bg-card p-4 shadow-sm"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-mono text-xs font-bold" style={{ color: 'var(--ink-muted)' }}>{wo.id}</span>
                                        <span className="text-base font-bold leading-tight">{tDemo(wo.titleKey)}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <Badge variant="outline" className="h-4 py-0 text-[10px]" style={MOBILE_TYPE_STYLE[wo.type]}>
                                            {t(`form.types.${wo.type}`)}
                                        </Badge>
                                        <StatusBadge status={wo.status} label={t(`status.${wo.status}`)} />
                                        <PriorityBadge priority={wo.priority} label={t(`form.priorities.${wo.priority}`)} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-5 w-5">
                                            <AvatarFallback className="text-[9px]">{initials(wo.assignee)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium">{wo.assignee}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        <span>{date(wo.daysAgo)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5 px-6 pb-20 pt-4">
            {header}
            <div className="space-y-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.08 }}>
                    {tabs}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.14 }}
                    className="flex flex-wrap items-center gap-2"
                >
                    <div className="relative max-w-[260px] min-w-[180px] flex-1">
                        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" style={{ color: 'var(--ink-faint)' }} />
                        <div className="flex h-8 items-center rounded-md border border-input bg-transparent pl-8 text-sm text-muted-foreground shadow-xs">
                            {t('table.searchPlaceholder')}
                        </div>
                    </div>
                    <FakeSelect label={tf('allTypes')} />
                    <span
                        className="inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium"
                        style={{ color: 'var(--ink-muted)', borderColor: 'var(--border-subtle)' }}
                    >
                        <span className="max-w-[120px] truncate">{tf('allAssets')}</span>
                        <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-40" />
                    </span>
                    <FakeSelect label={tf('allOperators')} />
                    <FakeSelect label={tf('allTime')} />
                    <span className="ml-auto whitespace-nowrap text-xs tabular-nums" style={{ color: 'var(--ink-faint)' }}>
                        {WO_TOTALS.rows} OTs
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.2, ease: EASE }}
                    className="overflow-hidden rounded-xl border bg-card"
                >
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[110px]">{t('table.id')}</TableHead>
                                <TableHead>{t('table.title')}</TableHead>
                                <TableHead>{t('table.asset')}</TableHead>
                                <TableHead className="w-[130px]">{t('table.type')}</TableHead>
                                <TableHead className="w-[110px]">{t('table.priority')}</TableHead>
                                <TableHead className="w-[150px]">{t('table.status')}</TableHead>
                                <TableHead className="w-[160px]">{t('table.assignedTo')}</TableHead>
                                <TableHead className="w-[110px] text-right">{t('table.date')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {WORK_ORDERS.map((row, i) => {
                                const delay = 0.3 + i * 0.05;
                                const isStory = row.kind === 'wo' && row.id === STORY_OT;
                                return (
                                    <motion.tr
                                        key={row.id}
                                        data-slot="table-row"
                                        className="border-b transition-colors"
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={
                                            isStory
                                                ? { opacity: 1, x: 0, backgroundColor: ['rgba(0,177,64,0)', 'rgba(0,177,64,0.14)', 'rgba(0,177,64,0)'] }
                                                : { opacity: 1, x: 0 }
                                        }
                                        transition={
                                            isStory
                                                ? {
                                                      opacity: { duration: 0.3, delay, ease: EASE },
                                                      x: { duration: 0.3, delay, ease: EASE },
                                                      backgroundColor: { duration: 1.6, delay: 1.6, times: [0, 0.3, 1] },
                                                  }
                                                : { duration: 0.3, delay, ease: EASE }
                                        }
                                    >
                                        {row.kind === 'wo' ? (
                                            <WoCells wo={row} title={tDemo(row.titleKey)} asset={assetLabel(row)} date={date(row.daysAgo)} />
                                        ) : (
                                            <ReportCells report={row} asset={assetLabel(row)} date={date(row.daysAgo)} tOr={tOr} />
                                        )}
                                    </motion.tr>
                                );
                            })}
                        </TableBody>
                    </Table>
                </motion.div>
            </div>
        </div>
    );
}

function FakeSelect({ label }: { label: string }) {
    return (
        <span className="flex h-8 w-auto min-w-[110px] max-w-[160px] items-center justify-between gap-2 whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-xs font-medium shadow-xs">
            <span className="line-clamp-1">{label}</span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground opacity-50" />
        </span>
    );
}

function AssetChip({ label }: { label: string }) {
    return (
        <span className="inline-flex w-fit items-center gap-1 rounded-full border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            <Factory size={10} />
            {label}
        </span>
    );
}

function Assignee({ name }: { name: string }) {
    return (
        <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[10px]">{initials(name)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{name}</span>
        </div>
    );
}

function WoCells({ wo, title, asset, date }: { wo: DemoWorkOrder; title: string; asset: string; date: string }) {
    const t = useTranslations('WorkOrders');
    const tok = TYPE_TOKENS[wo.type];
    return (
        <>
            <TableCell className="font-mono text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                {wo.id}
            </TableCell>
            <TableCell>
                <span className="font-medium">{title}</span>
            </TableCell>
            <TableCell>
                <AssetChip label={asset} />
            </TableCell>
            <TableCell>
                <span
                    className="inline-flex h-5 items-center rounded-full border-0 px-2 text-[11px] font-medium"
                    style={{ backgroundColor: tok.bg, color: tok.ink }}
                >
                    {t(`form.types.${wo.type}`)}
                </span>
            </TableCell>
            <TableCell>
                <PriorityBadge priority={wo.priority} label={t(`form.priorities.${wo.priority}`)} />
            </TableCell>
            <TableCell>
                <div className="flex flex-col items-start gap-1">
                    <StatusBadge status={wo.status} label={t(`status.${wo.status}`)} />
                    {wo.handedOff && wo.status !== 'completed' && (
                        <span
                            className="inline-flex h-5 items-center gap-1 rounded-full px-2 text-[11px] font-medium"
                            style={{ backgroundColor: 'var(--warning-soft)', color: 'var(--warning-soft-ink)' }}
                        >
                            <ArrowRightLeft size={9} />
                            {t('detail.handedOffLabel')}
                        </span>
                    )}
                </div>
            </TableCell>
            <TableCell>
                <Assignee name={wo.assignee} />
            </TableCell>
            <TableCell className="text-right text-sm text-muted-foreground">{date}</TableCell>
        </>
    );
}

function ReportCells({
    report,
    asset,
    date,
    tOr,
}: {
    report: DemoOperatorReport;
    asset: string;
    date: string;
    tOr: (key: string) => string;
}) {
    const isSala = report.reportType === 'sala';
    const label = isSala ? tOr('operatorReportSala') : tOr('operatorReportCleaning');
    return (
        <>
            <TableCell className="font-mono text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                {report.id}
            </TableCell>
            <TableCell>
                <span className="font-medium">{label}</span>
            </TableCell>
            <TableCell>
                <AssetChip label={asset} />
            </TableCell>
            <TableCell>
                <span
                    className="inline-flex h-5 items-center gap-1 rounded-full border-0 px-2 text-[11px] font-medium"
                    style={
                        isSala
                            ? { backgroundColor: 'var(--warning-soft)', color: 'var(--warning-soft-ink)' }
                            : { backgroundColor: 'var(--brand-soft)', color: 'var(--brand-soft-ink)' }
                    }
                >
                    {isSala ? <Wrench size={10} /> : <SprayCan size={10} />}
                    {label}
                </span>
            </TableCell>
            <TableCell>
                <span className="text-sm" style={{ color: 'var(--ink-faint)' }}>
                    —
                </span>
            </TableCell>
            <TableCell>
                <StatusBadge
                    status={report.reviewed ? 'approved' : 'pending_review'}
                    label={report.reviewed ? tOr('statusReviewed') : tOr('statusPending')}
                />
            </TableCell>
            <TableCell>
                <Assignee name={report.creator} />
            </TableCell>
            <TableCell className="text-right text-sm text-muted-foreground">{date}</TableCell>
        </>
    );
}
