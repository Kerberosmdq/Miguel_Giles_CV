'use client';

import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useFormatter, useTranslations } from 'next-intl';
import {
    ArrowDown,
    ChevronDown,
    Download,
    Edit2,
    Eye,
    FileCheck,
    Filter,
    Info,
    Loader2,
    LogIn,
    Plus,
    Search,
    CalendarDays,
    Shield,
    ShieldCheck,
} from 'lucide-react';
import { cn } from '@/demo/lib/utils';
import { buttonVariants } from '@/demo/ui/button';
import { Badge } from '@/demo/ui/badge';
import { Avatar, AvatarFallback } from '@/demo/ui/avatar';
import { Card, CardContent, CardHeader } from '@/demo/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/demo/ui/table';
import { ASSETS, STORY_OT, TECHS } from '../demo-data';
import { DemoCursor, CURSOR_HIDDEN, type CursorState } from '@/demo/engine/DemoCursor';
import { pointIn, useSceneScript } from '@/demo/engine/useSceneScript';
import type { SceneProps } from '.';

/*
 * Réplica de Registros de Auditoría (AuditLogsClient + ChainIntegrityButton).
 * Sólo acciones que la app realmente registra: firma y edición de la OT de la
 * historia, revelación de contraseña de la bóveda, exportación, sesión, etc.
 * Guion: las filas entran, el cursor hace clic en "Verificar integridad" y la
 * cadena de hash aparece íntegra. El botón también lo puede tocar el visitante.
 */

type Action = 'WORK_ORDER_SIGNED' | 'UPDATE' | 'CREATE' | 'REVEAL' | 'EXPORT' | 'LOGIN';
type Entity = 'work_orders' | 'vault' | 'audit_logs' | 'profiles' | 'preventive_executions' | 'inventory';

interface DemoLog {
    id: string;
    /** Minutos antes de "ahora" en hora de planta: hoy a las HH:MM o días previos. */
    daysAgo: number;
    time: string;
    actor: string;
    action: Action;
    entity: Entity;
    /** Cómo se arma el ítem afectado. */
    target: { kind: 'wo'; id: string; titleKey: string } | { kind: 'text'; key: string; values?: Record<string, string> } | { kind: 'raw'; value: string };
    hash: string;
}

const LOGS: DemoLog[] = [
    { id: 'l1', daysAgo: 0, time: '10:32', actor: TECHS.roman, action: 'WORK_ORDER_SIGNED', entity: 'work_orders', target: { kind: 'wo', id: STORY_OT, titleKey: 't147' }, hash: 'b7d408aa' },
    { id: 'l2', daysAgo: 0, time: '10:31', actor: TECHS.roman, action: 'UPDATE', entity: 'work_orders', target: { kind: 'wo', id: STORY_OT, titleKey: 't147' }, hash: '3f9ac21e' },
    { id: 'l3', daysAgo: 0, time: '09:58', actor: TECHS.roman, action: 'REVEAL', entity: 'vault', target: { kind: 'raw', value: `${ASSETS.l1} — HMI Selladora` }, hash: '91cef5d0' },
    { id: 'l4', daysAgo: 0, time: '09:46', actor: TECHS.sofia, action: 'CREATE', entity: 'work_orders', target: { kind: 'wo', id: STORY_OT, titleKey: 't147' }, hash: '6a027b93' },
    { id: 'l5', daysAgo: 0, time: '08:40', actor: TECHS.sofia, action: 'UPDATE', entity: 'work_orders', target: { kind: 'wo', id: '26-0146', titleKey: 't146' }, hash: 'e4f12c6d' },
    { id: 'l6', daysAgo: 0, time: '07:58', actor: TECHS.olivia, action: 'EXPORT', entity: 'audit_logs', target: { kind: 'text', key: 'entities.audit_logs' }, hash: '0c5d93be' },
    { id: 'l7', daysAgo: 0, time: '07:01', actor: TECHS.olivia, action: 'LOGIN', entity: 'profiles', target: { kind: 'raw', value: TECHS.olivia }, hash: 'a81e44f2' },
    { id: 'l8', daysAgo: 1, time: '22:10', actor: TECHS.joaquin, action: 'CREATE', entity: 'work_orders', target: { kind: 'wo', id: '26-0145', titleKey: 't145' }, hash: '5b27d0c9' },
    { id: 'l9', daysAgo: 1, time: '18:37', actor: TECHS.valentina, action: 'CREATE', entity: 'preventive_executions', target: { kind: 'text', key: 'demo.audit.pmWeekly', values: { asset: ASSETS.r1 } }, hash: 'd3906a1f' },
    { id: 'l10', daysAgo: 1, time: '14:05', actor: TECHS.tomas, action: 'UPDATE', entity: 'inventory', target: { kind: 'text', key: 'demo.audit.gaskets' }, hash: '7e15b8c4' },
];

/** Total de registros que "verifica" la cadena. */
const CHAIN_ROWS = 1284;

const ACTION_CONFIG: Record<Action, { style: React.CSSProperties; icon: React.ElementType }> = {
    CREATE: { style: { backgroundColor: 'var(--success-soft)', color: 'var(--success-soft-ink)', borderColor: 'var(--success-soft)' }, icon: Plus },
    UPDATE: { style: { backgroundColor: 'var(--info-soft)', color: 'var(--info-soft-ink)', borderColor: 'var(--info-soft)' }, icon: Edit2 },
    LOGIN: { style: { backgroundColor: 'var(--brand-soft)', color: 'var(--brand-soft-ink)', borderColor: 'var(--brand-soft)' }, icon: LogIn },
    WORK_ORDER_SIGNED: { style: { backgroundColor: 'var(--brand-soft)', color: 'var(--brand-soft-ink)', borderColor: 'var(--brand-soft)' }, icon: FileCheck },
    REVEAL: { style: { backgroundColor: 'var(--warning-soft)', color: 'var(--warning-soft-ink)', borderColor: 'var(--warning-soft)' }, icon: Eye },
    EXPORT: { style: { backgroundColor: 'var(--brand-soft)', color: 'var(--brand-soft-ink)', borderColor: 'var(--brand-soft)' }, icon: Download },
};

const EASE = [0.22, 1, 0.36, 1] as const;

const initials = (name: string) =>
    name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

/** Correo ficticio en un dominio reservado (.example nunca existe). */
const emailOf = (name: string) =>
    `${name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(' ', '.')}@plantademo.example`;

type VerifyState = 'idle' | 'loading' | 'intact';

export function AuditScene({ compact = false, playing = false, onInteract }: SceneProps) {
    const t = useTranslations('AuditLogs');
    const tc = useTranslations('AuditLogs.chain');
    const tx = useTranslations('AuditLogs.export');
    const tl = useTranslations('Landing');
    const tWo = useTranslations('Landing.demo.wo');
    const format = useFormatter();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const verifyRef = useRef<HTMLButtonElement | null>(null);
    const [verify, setVerify] = useState<VerifyState>('idle');
    const [cursor, setCursor] = useState<CursorState>(CURSOR_HIDDEN);
    const [manual, setManual] = useState(false);

    const tzAbbrev = useMemo(() => {
        try {
            return new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(new Date()).find((p) => p.type === 'timeZoneName')?.value ?? '';
        } catch {
            return '';
        }
    }, []);

    const runVerify = () => {
        setVerify('loading');
        setTimeout(() => setVerify('intact'), 1100);
    };

    useSceneScript(
        [
            {
                at: 1500,
                run: () => {
                    const root = rootRef.current;
                    const btn = verifyRef.current;
                    if (!root || !btn || compact) return;
                    const p = pointIn(root, btn);
                    setCursor((c) => ({ ...c, x: p.x, y: p.y, visible: true }));
                },
            },
            {
                at: 2300,
                run: () => {
                    setCursor((c) => ({ ...c, clicks: c.clicks + 1 }));
                    runVerify();
                },
            },
            { at: 4200, run: () => setCursor((c) => ({ ...c, visible: false })) },
        ],
        playing && !manual,
    );

    const onVerifyClick = () => {
        setManual(true);
        setCursor((c) => ({ ...c, visible: false }));
        onInteract?.();
        runVerify();
    };

    const when = (log: DemoLog, short = false) => {
        const d = new Date();
        d.setDate(d.getDate() - log.daysAgo);
        const [h, m] = log.time.split(':').map(Number);
        d.setHours(h, m, 0, 0);
        return format.dateTime(d, short ? { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' } : { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const targetOf = (log: DemoLog) => {
        if (log.target.kind === 'wo') return `${log.target.id} · ${tWo(log.target.titleKey)}`;
        if (log.target.kind === 'raw') return log.target.value;
        return log.target.key.startsWith('demo.') ? tl(log.target.key, log.target.values ?? {}) : t(log.target.key);
    };

    const verifyButton = (
        <div className="flex items-center gap-1.5">
            {verify === 'intact' ? (
                <motion.button
                    ref={verifyRef}
                    type="button"
                    tabIndex={-1}
                    onClick={onVerifyClick}
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="pointer-events-auto flex cursor-pointer select-none items-center gap-2 rounded-md border px-3 py-1.5 text-left text-sm font-medium"
                    style={{ borderColor: 'var(--success)', color: 'var(--success)', background: 'var(--success-soft)' }}
                >
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    <div className="flex flex-col leading-none">
                        <span>{tc('intact')}</span>
                        <span className="text-[10px] font-normal opacity-80">{tc('intactDesc', { n: CHAIN_ROWS })}</span>
                    </div>
                </motion.button>
            ) : (
                <button
                    ref={verifyRef}
                    type="button"
                    tabIndex={-1}
                    onClick={onVerifyClick}
                    disabled={verify === 'loading'}
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'pointer-events-auto gap-2')}
                >
                    {verify === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                    {!compact && <span>{verify === 'loading' ? tc('verifying') : tc('verify')}</span>}
                </button>
            )}
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
    );

    const header = (
        <motion.header
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className={cn('mb-1 flex gap-2 border-b pb-3', compact ? 'flex-col' : 'flex-row items-end justify-between gap-4')}
            style={{ borderColor: 'var(--border-subtle)' }}
        >
            <div className="min-w-0 space-y-0.5">
                <h3 className="truncate text-[1.125rem] font-semibold leading-tight tracking-tight text-ink">{t('title')}</h3>
                <p className="text-[0.8125rem] leading-snug text-ink-muted">{t('subtitle')}</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
                {verifyButton}
                <span className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-2')}>
                    <Download className="h-4 w-4" />
                    {!compact && <span>{tx('button')}</span>}
                </span>
            </div>
        </motion.header>
    );

    const tabs = (
        <div className="inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground">
            {[t('auditLogsTab'), t('alertSignaturesTab'), ...(compact ? [] : [t('securityEventsTab')])].map((label, i) => (
                <span
                    key={label}
                    className={cn(
                        'inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center whitespace-nowrap rounded-md border border-transparent px-2 py-1 text-sm font-medium text-foreground',
                        i === 0 && 'bg-background shadow-sm',
                    )}
                >
                    {label}
                </span>
            ))}
        </div>
    );

    const isNew = (log: DemoLog) => log.target.kind === 'wo' && log.target.id === STORY_OT && log.action === 'WORK_ORDER_SIGNED';

    return (
        <div ref={rootRef} className="relative h-full overflow-hidden">
            <div className={cn('space-y-5 pb-20', compact ? 'px-4 pt-3' : 'px-8 pt-4')}>
                {header}
                <div className="space-y-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.08 }}>
                        {tabs}
                    </motion.div>

                    {!compact && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.14 }}
                            className="flex flex-wrap items-center gap-2"
                        >
                            <div className="relative max-w-[260px] min-w-[180px] flex-1">
                                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" style={{ color: 'var(--ink-faint)' }} />
                                <div className="flex h-8 items-center rounded-md border border-input bg-transparent pl-8 text-sm text-muted-foreground shadow-xs">
                                    {t('searchPlaceholder')}
                                </div>
                            </div>
                            <FakeSelect icon={<Filter className="h-3 w-3 shrink-0 text-muted-foreground" />} label={t('all')} />
                            <FakeSelect label={t('all')} />
                            <FakeSelect label={t('all')} />
                            <div className="flex items-center gap-1.5">
                                <span className="flex h-8 w-[130px] items-center justify-end rounded-md border border-input bg-card px-2 text-muted-foreground">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                </span>
                                <span className="select-none text-xs text-muted-foreground">→</span>
                                <span className="flex h-8 w-[130px] items-center justify-end rounded-md border border-input bg-card px-2 text-muted-foreground">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                </span>
                            </div>
                            <span className="ml-auto whitespace-nowrap text-xs tabular-nums" style={{ color: 'var(--ink-faint)' }}>
                                {CHAIN_ROWS}
                            </span>
                        </motion.div>
                    )}

                    {compact ? (
                        <div className="space-y-4">
                            {LOGS.slice(0, 4).map((log, i) => {
                                const cfg = ACTION_CONFIG[log.action];
                                const Icon = cfg.icon;
                                return (
                                    <motion.div key={log.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 + i * 0.08, ease: EASE }}>
                                        <Card className="gap-0 overflow-hidden py-0">
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="gap-1 py-0.5 pr-2" style={cfg.style}>
                                                        <Icon className="h-3 w-3" />
                                                        {t(`actions.${log.action}`)}
                                                    </Badge>
                                                    <span className="font-mono text-xs text-muted-foreground">{when(log, true)}</span>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-2">
                                                <div className="mb-3 flex items-start gap-3">
                                                    <Avatar className="h-8 w-8 border">
                                                        <AvatarFallback className="bg-muted/50 text-[10px]">{initials(log.actor)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex min-w-0 flex-col">
                                                        <span className="truncate text-sm font-medium leading-none">{log.actor}</span>
                                                        <span className="truncate text-[10px] text-muted-foreground">{emailOf(log.actor)}</span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 rounded-md bg-muted/30 p-2 text-sm">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-muted-foreground">{t('table.entity')}</span>
                                                        <span className="font-medium capitalize">{t(`entities.${log.entity}`)}</span>
                                                    </div>
                                                    <div className="flex min-w-0 flex-col">
                                                        <span className="text-[10px] text-muted-foreground">{t('table.target')}</span>
                                                        <span className="truncate font-medium">{targetOf(log)}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2, ease: EASE }}>
                            <Card className="w-full max-w-full shadow-sm">
                                <CardContent className="p-6">
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader className="bg-muted/40">
                                                <TableRow className="hover:bg-transparent">
                                                    <TableHead className="w-[180px] text-center">
                                                        <span className="inline-flex items-center gap-1" style={{ color: 'var(--brand)' }}>
                                                            {tzAbbrev ? `${t('table.time')} (${tzAbbrev})` : t('table.time')}
                                                            <ArrowDown className="h-3.5 w-3.5" />
                                                        </span>
                                                    </TableHead>
                                                    <TableHead className="w-[200px] text-center">{t('table.actor')}</TableHead>
                                                    <TableHead className="w-[140px] text-center">{t('table.action')}</TableHead>
                                                    <TableHead className="w-[140px] text-center">{t('table.entity')}</TableHead>
                                                    <TableHead className="min-w-[200px] text-center">{t('table.target')}</TableHead>
                                                    <TableHead className="w-[100px] text-right">{t('table.details')}</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {LOGS.map((log, i) => {
                                                    const cfg = ACTION_CONFIG[log.action];
                                                    const Icon = cfg.icon;
                                                    return (
                                                        <motion.tr
                                                            key={log.id}
                                                            data-slot="table-row"
                                                            className="border-b"
                                                            initial={{ opacity: 0, x: -8 }}
                                                            animate={
                                                                isNew(log)
                                                                    ? { opacity: 1, x: 0, backgroundColor: ['rgba(0,177,64,0)', 'rgba(0,177,64,0.14)', 'rgba(0,177,64,0)'] }
                                                                    : { opacity: 1, x: 0 }
                                                            }
                                                            transition={{
                                                                opacity: { duration: 0.3, delay: 0.3 + i * 0.05 },
                                                                x: { duration: 0.3, delay: 0.3 + i * 0.05, ease: EASE },
                                                                backgroundColor: { duration: 1.6, delay: 0.9, times: [0, 0.3, 1] },
                                                            }}
                                                        >
                                                            <TableCell className="text-center font-mono text-xs text-muted-foreground">{when(log)}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center justify-center gap-3 text-center">
                                                                    <Avatar className="h-8 w-8 border bg-background ring-1 ring-background">
                                                                        <AvatarFallback className="bg-muted/50 text-[10px] font-medium">{initials(log.actor)}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="flex flex-col text-left">
                                                                        <span className="text-sm font-medium leading-none">{log.actor}</span>
                                                                        <span className="mt-0.5 max-w-[140px] truncate text-[10px] text-muted-foreground">{emailOf(log.actor)}</span>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                <Badge variant="outline" className="gap-1.5 py-0.5 pl-1.5 pr-2.5 font-medium" style={cfg.style}>
                                                                    <Icon className="h-3 w-3" />
                                                                    {t(`actions.${log.action}`)}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-center capitalize">{t(`entities.${log.entity}`)}</TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col items-center text-center">
                                                                    <span className="max-w-[250px] truncate text-sm font-medium">{targetOf(log)}</span>
                                                                    <span className="font-mono text-[10px] text-muted-foreground">ID: {log.hash}...</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <span className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'h-8 w-8 text-muted-foreground')}>
                                                                    <Eye className="h-4 w-4" />
                                                                </span>
                                                            </TableCell>
                                                        </motion.tr>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
            <DemoCursor state={cursor} />
        </div>
    );
}

function FakeSelect({ label, icon }: { label: string; icon?: React.ReactNode }) {
    return (
        <span className="flex h-8 w-auto min-w-[130px] max-w-[160px] items-center justify-between gap-1.5 whitespace-nowrap rounded-md border border-input bg-card px-3 py-2 text-xs shadow-xs">
            {icon}
            <span className="line-clamp-1 flex-1">{label}</span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground opacity-50" />
        </span>
    );
}
