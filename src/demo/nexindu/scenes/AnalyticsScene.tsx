'use client';

import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Legend,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    ComposedChart,
    Line,
    ReferenceLine,
    LineChart,
    LabelList,
} from 'recharts';
import {
    ArrowLeft,
    CalendarIcon,
    CheckCircle2,
    ChevronDown,
    ClipboardList,
    Clock,
    Download,
    Info,
    Pencil,
    Sparkles,
    Timer,
    AlertTriangle,
} from 'lucide-react';
import { cn } from '@/demo/lib/utils';
import { buttonVariants } from '@/demo/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/demo/ui/card';
import { PriorityBadge } from '@/demo/ui/PriorityBadge';
import { StatusBadge } from '@/demo/ui/StatusBadge';
import { STORY_OT, ASSETS } from '../demo-data';
import { ASSET_BUCKETS, INDICATORS, PARETO, PM_ALERTS, PVC, formatDuration, formatMtbf, type AssetBucket, type SubBucket } from '../demo-analytics';
import { DemoCursor, CURSOR_HIDDEN, type CursorState } from '@/demo/engine/DemoCursor';
import { pointIn, useSceneScript } from '@/demo/engine/useSceneScript';
import type { SceneProps } from '.';

/*
 * Réplica del Centro de Inteligencia Operativa (AnalyticsDashboard):
 * Ranking de Activos con desglose de 3 niveles, Tiempo de Parada vs. Tiempo
 * Técnico, Preventivo vs. Correctivo, Alertas de Patrones PM e indicadores.
 *
 * Guion automático: el cursor abre Llenadora L-1 → Selladora (donde está la
 * OT de la historia) y después la vista baja al resto de los gráficos. El
 * ranking es lo único clickeable: el visitante puede recorrer los 3 niveles.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const TICK = { fontSize: 10, fill: '#94a3b8' };
const STORY_ASSET = ASSETS.l1;
const STORY_SUB = 'Selladora';
/** Cuánto baja la vista para mostrar la segunda fila e indicadores (px virtuales). */
const SCROLL_DESKTOP = 250;
const SCROLL_COMPACT = 240;

/** Sparkline semanal de MTTR (decorativa, tendencia a la baja). */
const MTTR_SPARK = [96, 88, 92, 81, 84, 76, 79, 72, 70, 66].map((v) => ({ v }));

function useRangeLabel() {
    const locale = useLocale();
    return useMemo(() => {
        const fmt = (d: Date) => {
            const parts = new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric' }).formatToParts(d);
            const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
            return `${get('month').replace('.', '')} ${get('day')}, ${get('year')}`;
        };
        const now = new Date();
        return `${fmt(new Date(now.getFullYear(), 0, 1))} - ${fmt(now)}`;
    }, [locale]);
}

export function AnalyticsScene({ compact = false, playing = false, onInteract }: SceneProps) {
    const t = useTranslations('Analytics');
    const tWo = useTranslations('WorkOrders');
    const tDemo = useTranslations('Landing.demo.wo');
    const range = useRangeLabel();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const rankingRef = useRef<HTMLDivElement | null>(null);

    const [asset, setAsset] = useState<AssetBucket | null>(null);
    const [sub, setSub] = useState<SubBucket | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [cursor, setCursor] = useState<CursorState>(CURSOR_HIDDEN);
    /** El visitante tocó el ranking: el guion se detiene y la escena queda en sus manos. */
    const [manual, setManual] = useState(false);

    const subLabel = (s: SubBucket) => s.name ?? t('ranking.generalBucket');

    const barTarget = (index: number) => {
        const root = rootRef.current;
        const bars = rankingRef.current?.querySelectorAll('.recharts-bar-rectangle');
        const bar = bars?.[index];
        if (!root || !bar) return null;
        return pointIn(root, bar, 0, 0);
    };

    const moveCursorTo = (index: number) => {
        const p = barTarget(index);
        if (p) setCursor((c) => ({ ...c, x: p.x, y: p.y, visible: !compact }));
    };

    const click = () => setCursor((c) => ({ ...c, clicks: c.clicks + 1 }));

    const storyAsset = ASSET_BUCKETS.find((b) => b.name === STORY_ASSET)!;
    const storySub = storyAsset.subs.find((s) => s.name === STORY_SUB)!;

    useSceneScript(
        [
            // 2 s con el ranking quieto para leer el título y los activos.
            { at: 2000, run: () => moveCursorTo(ASSET_BUCKETS.indexOf(storyAsset)) },
            {
                at: 2600,
                run: () => {
                    click();
                    setAsset(storyAsset);
                },
            },
            // ~2.5 s con los sub-activos de L-1 a la vista antes del segundo clic.
            { at: 4500, run: () => moveCursorTo(storyAsset.subs.indexOf(storySub)) },
            {
                at: 5100,
                run: () => {
                    click();
                    setSub(storySub);
                },
            },
            // La lista de OT de Selladora queda a la vista ~2 s antes de bajar.
            { at: 6800, run: () => setCursor((c) => ({ ...c, visible: false })) },
            { at: 7100, run: () => setScrolled(true) },
        ],
        playing && !manual,
    );

    const takeOver = () => {
        setManual(true);
        setCursor((c) => ({ ...c, visible: false }));
        onInteract?.();
    };

    const level0 = ASSET_BUCKETS.slice(0, 5).map((b) => ({ name: b.name, total: b.total }));
    const level1 = asset ? asset.subs.map((s) => ({ name: subLabel(s), total: s.wos.length })) : [];
    const chartData = asset ? level1 : level0;

    const ranking = (
        <Card className="h-full" style={{ borderTopWidth: 2, borderTopColor: 'var(--brand)' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex min-w-0 items-center gap-2">
                    {(asset || sub) && (
                        <button
                            type="button"
                            // La zona de escena es aria-hidden (decorado para lectores de pantalla):
                            // este atajo es sólo de mouse; el teclado navega por el menú lateral.
                            tabIndex={-1}
                            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'pointer-events-auto h-7 shrink-0 gap-1 px-2 text-[10px]')}
                            onClick={() => {
                                takeOver();
                                if (sub) setSub(null);
                                else setAsset(null);
                            }}
                        >
                            <ArrowLeft className="h-3 w-3" /> {t('backBtn')}
                        </button>
                    )}
                    <div className="min-w-0">
                        <CardTitle className="truncate text-sm font-semibold">
                            {sub && asset
                                ? t('ranking.wosOf', { assetName: asset.name, subAsset: subLabel(sub) })
                                : asset
                                  ? t('ranking.subassetsOf', { assetName: asset.name })
                                  : t('ranking.assetsTitle')}
                        </CardTitle>
                        {!asset && <p className="mt-0.5 text-[10px] text-muted-foreground">{t('ranking.subtitle')}</p>}
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <TopSelect />
                    <ClipboardList className="h-4 w-4 text-primary/60" />
                </div>
            </CardHeader>
            <CardContent className="h-[250px] pt-0">
                {sub ? (
                    <div className="h-full space-y-1.5 overflow-hidden pr-1">
                        {sub.wos.map((wo, i) => (
                            <motion.div
                                key={wo.id}
                                initial={{ opacity: 0, y: 6 }}
                                animate={
                                    wo.id === STORY_OT
                                        ? { opacity: 1, y: 0, backgroundColor: ['rgba(0,177,64,0)', 'rgba(0,177,64,0.16)', 'rgba(0,177,64,0.06)'] }
                                        : { opacity: 1, y: 0 }
                                }
                                transition={{ duration: 0.3, delay: i * 0.05, backgroundColor: { duration: 1.4, delay: 0.5 } }}
                                className="flex items-center justify-between gap-2 rounded-lg border bg-muted/30 p-2"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <span className="shrink-0 font-mono text-[10px] font-bold text-muted-foreground">{wo.id}</span>
                                    <span className="truncate text-xs font-medium">{tDemo(wo.titleKey)}</span>
                                </div>
                                <div className="flex shrink-0 items-center gap-1.5">
                                    <PriorityBadge
                                        priority={wo.priority}
                                        label={tWo(`form.priorities.${wo.priority}`).toUpperCase()}
                                        size="sm"
                                    />
                                    <StatusBadge
                                        status={wo.status}
                                        label={
                                            wo.status === 'completed'
                                                ? t('chart.closedStatus')
                                                : wo.status === 'in_progress'
                                                  ? t('chart.inProgressStatus')
                                                  : t('chart.openStatus')
                                        }
                                        size="sm"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex h-full flex-col">
                        <div ref={rankingRef} className="pointer-events-auto min-h-0 flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart key={asset?.name ?? 'root'} data={chartData} layout="vertical" margin={{ left: 4, right: 36, top: 4 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" tick={TICK} width={95} axisLine={false} tickLine={false} />
                                    <Bar
                                        dataKey="total"
                                        radius={[0, 4, 4, 0]}
                                        barSize={16}
                                        className="cursor-pointer"
                                        animationDuration={900}
                                        onClick={(_: unknown, index: number) => {
                                            takeOver();
                                            if (!asset) setAsset(ASSET_BUCKETS[index]);
                                            else setSub(asset.subs[index]);
                                        }}
                                    >
                                        {chartData.map((_, i) => (
                                            <Cell key={i} fill="var(--brand, #10b981)" fillOpacity={Math.max(0.35, 1 - i * 0.12)} />
                                        ))}
                                        <LabelList dataKey="total" position="right" style={{ fontSize: 10, fontWeight: 700, fill: 'var(--ink, #334155)' }} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="shrink-0 pt-1 text-center text-[10px] text-muted-foreground">
                            {asset ? t('chart.clickSubAsset') : t('chart.clickAsset')}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    const pareto = (
        <Card className="h-full" style={{ borderTopWidth: 2, borderTopColor: 'var(--brand)' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex min-w-0 items-center gap-1.5">
                    <CardTitle className="truncate text-sm font-semibold">{t('downtimeVsWork')}</CardTitle>
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <TopSelect />
                    <Clock className="h-4 w-4 text-primary/60" />
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={PARETO} margin={{ top: 10, right: 40, bottom: 20, left: 0 }}>
                            <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={0} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                domain={[0, 100]}
                                tickFormatter={(v) => `${v}%`}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 9, fill: '#94a3b8' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '9px' }} />
                            <Bar yAxisId="left" name={t('downtime')} dataKey="downtime" fill="var(--chart-2, #ef4444)" barSize={18} radius={[3, 3, 0, 0]} animationDuration={900} />
                            <Bar yAxisId="left" name={t('workTime')} dataKey="duration" fill="var(--chart-1, #3b82f6)" barSize={18} radius={[3, 3, 0, 0]} animationDuration={900} />
                            <Line yAxisId="right" type="monotone" dataKey="cumPct" name={t('chart.cumPct')} stroke="#f59e0b" strokeWidth={2} dot={false} animationDuration={1200} />
                            <ReferenceLine
                                yAxisId="right"
                                y={80}
                                stroke="#f59e0b"
                                strokeDasharray="4 3"
                                label={{ value: '80%', position: 'right', fontSize: 9, fill: '#f59e0b' }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );

    const pvcData = [
        { name: t('type.preventive'), value: PVC.preventive, fill: '#10b981' },
        { name: t('type.corrective'), value: PVC.corrective, fill: '#ef4444' },
    ];

    const pvc = (
        <Card className="h-full" style={{ borderTopWidth: 2, borderTopColor: 'var(--brand)' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold">{t('chart.preventiveVsCorrective')}</CardTitle>
                <TopSelect narrow />
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex flex-col items-center gap-1">
                    <div className="relative h-[200px] w-full max-w-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart key={scrolled ? 'shown' : 'hidden'}>
                                <Pie data={pvcData} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={3} animationDuration={1000}>
                                    {pvcData.map((entry, i) => (
                                        <Cell key={i} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" height={30} wrapperStyle={{ fontSize: '11px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center" style={{ bottom: 30 }}>
                            <span className="text-2xl font-bold leading-none" style={{ color: 'var(--ink)' }}>
                                {PVC.total}
                            </span>
                            <span className="mt-0.5 text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                                {Math.round((PVC.preventive / PVC.total) * 100)}% prev
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const alertTotal = PM_ALERTS.open + PM_ALERTS.acknowledged + PM_ALERTS.resolved;
    const alertRate = Math.round((PM_ALERTS.resolved / alertTotal) * 100);
    const alertData = [
        { name: t('alerts.open'), value: PM_ALERTS.open, color: '#ef4444' },
        { name: t('alerts.acknowledged'), value: PM_ALERTS.acknowledged, color: '#f59e0b' },
        { name: t('alerts.resolved'), value: PM_ALERTS.resolved, color: '#22c55e' },
    ];

    const alerts = (
        <Card className="h-full" style={{ borderTopWidth: 2, borderTopColor: 'var(--warning-soft-ink)' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-sm font-semibold">{t('alerts.title')}</CardTitle>
                    <CardDescription className="mt-0.5 text-xs">{t('alerts.subtitle')}</CardDescription>
                </div>
                <AlertTriangle className="h-4 w-4" style={{ color: 'var(--warning-soft-ink)' }} />
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex items-center gap-6">
                    <div className="relative h-[160px] w-[160px] shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart key={scrolled ? 'shown' : 'hidden'}>
                                <Pie data={alertData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3} animationDuration={1000}>
                                    {alertData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold leading-none" style={{ color: 'var(--ink)' }}>
                                {alertTotal}
                            </span>
                            <span className="mt-0.5 text-[10px]" style={{ color: 'var(--danger-soft-ink)' }}>
                                {alertRate}%
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-lg bg-muted/50 p-2 text-center">
                                <p className="text-xl font-bold" style={{ color: 'var(--danger-soft-ink)' }}>
                                    {PM_ALERTS.open}
                                </p>
                                <p className="text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                                    {t('alerts.open')}
                                </p>
                            </div>
                            <div className="rounded-lg bg-muted/50 p-2 text-center">
                                <p className="text-xl font-bold" style={{ color: 'var(--success-soft-ink)' }}>
                                    {PM_ALERTS.resolved}
                                </p>
                                <p className="text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                                    {t('alerts.resolved')}
                                </p>
                            </div>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2 text-center">
                            <p className="text-xl font-bold">{alertRate}%</p>
                            <p className="text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                                {t('alerts.resolutionRate')}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {alertData.map((d) => (
                                <div key={d.name} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                    <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                                    {d.name}: <span className="font-semibold text-foreground">{d.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const av = INDICATORS.availability;
    const avColor = av >= 95 ? 'var(--success-soft-ink)' : av >= 85 ? 'var(--warning-soft-ink)' : 'var(--danger-soft-ink)';
    const indicators = [
        {
            key: 'mttr',
            title: t('kpi.avgMttr'),
            icon: <Timer className="h-4 w-4 text-primary" />,
            value: formatDuration(INDICATORS.mttr),
            extra: (
                <div className="-mx-2 mt-2 h-[40px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={MTTR_SPARK}>
                            <Line type="monotone" dataKey="v" stroke="var(--brand)" strokeWidth={1.5} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ),
        },
        {
            key: 'mtbf',
            title: t('kpi.mtbf'),
            icon: <Timer className="h-4 w-4 text-primary" />,
            value: formatMtbf(INDICATORS.mtbfMin),
            extra: <p className="mt-1 text-sm text-muted-foreground">{t('kpiExtra.perFailure')}</p>,
        },
        {
            key: 'availability',
            title: t('kpi.availability'),
            icon: <CheckCircle2 className="h-4 w-4" style={{ color: avColor }} />,
            value: `${av}%`,
            valueStyle: { color: avColor },
            extra: <p className="mt-1 text-sm text-muted-foreground">MTBF / (MTBF + MTTR)</p>,
        },
        {
            key: 'downtime',
            title: t('kpi.totalDowntime'),
            icon: <Clock className="h-4 w-4" style={{ color: 'var(--danger-soft-ink)' }} />,
            value: formatDuration(INDICATORS.downtime),
            valueStyle: { color: 'var(--danger-soft-ink)' },
            extra: <p className="mt-1 text-sm text-muted-foreground">{t('kpiExtra.totalDowntimeSub', { n: INDICATORS.failures })}</p>,
        },
    ];

    const sectionTitle = (label: string) => (
        <div className="mb-3 flex items-center gap-3">
            <h4 className="shrink-0 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>
                {label}
            </h4>
            <div className="h-px flex-1 bg-border/60" />
        </div>
    );

    const appear = (i: number) => ({
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.12 + i * 0.08, ease: EASE },
    });

    return (
        <div ref={rootRef} className="relative h-full overflow-hidden">
            <motion.div
                animate={{ y: scrolled ? -(compact ? SCROLL_COMPACT : SCROLL_DESKTOP) : 0 }}
                transition={{ duration: 1.1, ease: [0.45, 0, 0.2, 1] }}
            >
                <div className={cn('mx-auto flex max-w-7xl flex-col space-y-5 pb-20', compact ? 'px-4 pt-3' : 'px-8 pt-4')}>
                    <motion.header
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="mb-1 flex flex-col gap-2 border-b pb-3"
                        style={{ borderColor: 'var(--border-subtle)' }}
                    >
                        <div className="min-w-0 space-y-0.5">
                            <h3 className="truncate text-[1.125rem] font-semibold leading-tight tracking-tight text-ink">{t('title')}</h3>
                            <p className="text-[0.8125rem] leading-snug text-ink-muted">{t('subtitle')}</p>
                        </div>
                    </motion.header>

                    <div className="space-y-8">
                        {!compact && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.08 }}
                                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl border border-border/50 bg-card px-3 py-2.5 shadow-sm"
                            >
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={cn(buttonVariants({ variant: 'outline' }), 'w-[300px] justify-start text-left font-normal')}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {range}
                                    </span>
                                    <div className="inline-flex h-9 items-center rounded-lg border border-border/60 bg-muted/50 p-0.5">
                                        {['7d', '30d', t('actions.ytd')].map((label, i) => (
                                            <span
                                                key={label}
                                                className={cn(
                                                    'flex h-7 items-center rounded-md px-3 text-xs',
                                                    i === 2 ? 'bg-background font-semibold text-foreground shadow-sm' : 'font-medium text-muted-foreground',
                                                )}
                                            >
                                                {label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span
                                        className={cn(
                                            buttonVariants({ variant: 'outline', size: 'sm' }),
                                            'h-9 gap-2 rounded-lg border-primary/20 bg-primary/5 px-4 text-primary shadow-sm',
                                        )}
                                    >
                                        <Sparkles className="h-4 w-4" />
                                        {t('aiSummary')}
                                    </span>
                                    <span className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'h-9 gap-2 px-3')}>
                                        <Download className="h-4 w-4" />
                                        <span>{t('actions.export')}</span>
                                        <ChevronDown className="h-3 w-3 opacity-60" />
                                    </span>
                                    <div className="mx-0.5 h-6 w-px bg-border/60" />
                                    <span className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'h-9 gap-2 px-3 text-sm')}>
                                        {t('actions.comparePeriod')}
                                    </span>
                                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'h-9 gap-2 px-3 text-muted-foreground')}>
                                        <Pencil className="h-4 w-4" />
                                        <span>{t('actions.edit')}</span>
                                    </span>
                                </div>
                            </motion.div>
                        )}

                        <section>
                            {sectionTitle(t('sections.analysis'))}
                            <div className={cn('grid gap-6', compact ? 'grid-cols-1' : 'grid-cols-2')}>
                                <motion.div {...appear(0)}>{ranking}</motion.div>
                                {!compact && <motion.div {...appear(1)}>{pareto}</motion.div>}
                                <motion.div {...appear(2)}>{pvc}</motion.div>
                                {!compact && <motion.div {...appear(3)}>{alerts}</motion.div>}
                            </div>
                        </section>

                        {!compact && (
                            <section>
                                {sectionTitle(t('sections.indicators'))}
                                <div className="grid grid-cols-4 gap-4">
                                    {indicators.map((k, i) => (
                                        <motion.div key={k.key} {...appear(4 + i)}>
                                            <Card className="h-full" style={{ borderTopWidth: 2, borderTopColor: 'var(--brand)' }}>
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                    <CardTitle className="text-sm font-medium text-muted-foreground">{k.title}</CardTitle>
                                                    {k.icon}
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold" style={k.valueStyle}>
                                                        {k.value}
                                                    </div>
                                                    {k.extra}
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </motion.div>

            <DemoCursor state={cursor} />
        </div>
    );
}

function TopSelect({ narrow = false }: { narrow?: boolean }) {
    return (
        <span
            className={cn(
                'flex h-6 items-center justify-between gap-2 whitespace-nowrap rounded-md border border-input bg-transparent px-3 text-[10px] font-bold uppercase shadow-xs',
                narrow ? 'w-[80px]' : 'w-[90px]',
            )}
        >
            Top 5
            <ChevronDown className="size-4 shrink-0 text-muted-foreground opacity-50" />
        </span>
    );
}
