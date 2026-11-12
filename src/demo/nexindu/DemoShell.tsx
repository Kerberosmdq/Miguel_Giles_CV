'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    LayoutDashboard,
    Factory,
    ClipboardList,
    Package,
    Settings,
    ChevronLeft,
    ChevronUp,
    Lock,
    BookOpen,
    CalendarCheck,
    FileText,
    ShieldCheck,
    BarChart3,
    ScanEye,
    Search,
    Building2,
    Wifi,
    Plus,
} from 'lucide-react';
import { cn } from '@/demo/lib/utils';
import { DEMO_USER } from './demo-data';
import type { DemoSceneId } from './scenes';

/*
 * Réplicas visuales de components/dashboard/Sidebar.tsx y ComplianceBar.tsx.
 * Mismas clases y tokens; sin lógica de permisos, sin navegación real.
 * Sólo los ítems que tienen escena en la demo son botones: el resto es
 * decoración (sin hover, sin cursor de mano) para que nadie haga clic
 * esperando algo que no pasa.
 */

type NavGroup = 'operations' | 'resources' | 'intelligence' | 'compliance';

const NAV: { name: string; icon: React.ComponentType<{ className?: string }>; group: NavGroup; scene?: DemoSceneId }[] = [
    { name: 'dashboard', icon: LayoutDashboard, group: 'operations', scene: 'panel' },
    { name: 'workOrders', icon: ClipboardList, group: 'operations', scene: 'workOrders' },
    { name: 'handover', icon: FileText, group: 'operations' },
    { name: 'preventive', icon: CalendarCheck, group: 'operations' },
    { name: 'assets', icon: Factory, group: 'resources' },
    { name: 'inventory', icon: Package, group: 'resources' },
    { name: 'vault', icon: Lock, group: 'resources' },
    { name: 'analytics', icon: BarChart3, group: 'intelligence', scene: 'analytics' },
    { name: 'knowledge', icon: BookOpen, group: 'intelligence' },
    { name: 'nexiVision', icon: ScanEye, group: 'intelligence', scene: 'nexi' },
    { name: 'auditLogs', icon: ShieldCheck, group: 'compliance', scene: 'audit' },
    { name: 'settings', icon: Settings, group: 'compliance' },
];

const GROUPS: NavGroup[] = ['operations', 'resources', 'intelligence', 'compliance'];

interface DemoSidebarProps {
    active: DemoSceneId;
    onSelect: (scene: DemoSceneId) => void;
    /** Duración de la escena actual (ms) para la barrita de progreso. */
    progressMs: number;
    progressKey: number;
    progressRunning: boolean;
    showProgress: boolean;
}

export function DemoSidebar({ active, onSelect, progressMs, progressKey, progressRunning, showProgress }: DemoSidebarProps) {
    const t = useTranslations('Sidebar');
    const tRoles = useTranslations('Roles');

    return (
        <aside className="relative flex h-full w-[256px] shrink-0 flex-col border-r border-border-subtle bg-surface">
            <div className="absolute -right-3 top-[18px] z-10" aria-hidden>
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border-subtle bg-surface text-ink-muted shadow-sm">
                    <ChevronLeft className="h-3.5 w-3.5" />
                </span>
            </div>

            <div className="flex h-14 items-center border-b border-border-subtle px-4" aria-hidden>
                <div className="flex items-center gap-2.5">
                    <div className="relative h-7 w-7 shrink-0">
                        <Image src="/demo/nexindu/logo.png" alt="" fill sizes="28px" className="object-contain" />
                    </div>
                    <span className="text-[0.9375rem] font-semibold leading-none tracking-tight text-ink">NexIndu</span>
                </div>
            </div>

            <div className="px-3 pt-3" aria-hidden>
                <div className="flex h-9 w-full items-center gap-2 rounded-md border border-border-subtle bg-surface-sunken px-3 text-ink-muted">
                    <Search className="h-[15px] w-[15px] shrink-0" />
                    <span className="flex-1 text-left text-[0.8125rem] font-medium">{t('search')}</span>
                    <kbd className="inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded border border-border-subtle bg-surface px-1.5 font-mono text-[0.6875rem] text-ink-muted">
                        Ctrl K
                    </kbd>
                </div>
            </div>

            <nav className="flex-1 overflow-hidden px-3 py-3">
                {GROUPS.map((group, idx) => (
                    <div key={group} className={cn(idx > 0 && 'mt-5')}>
                        <div className="mb-1.5 px-3 text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-faint" aria-hidden>
                            {t(`groups.${group}`)}
                        </div>
                        <div className="space-y-0.5">
                            {NAV.filter((n) => n.group === group).map((item) => {
                                const Icon = item.icon;
                                const isActive = item.scene === active;
                                const body = (
                                    <>
                                        <Icon
                                            className={cn(
                                                'h-[18px] w-[18px] shrink-0 transition-colors',
                                                isActive ? 'text-brand' : 'text-ink-muted',
                                                item.scene && !isActive && 'group-hover:text-ink-soft',
                                            )}
                                        />
                                        <span className="min-w-0 text-[0.8125rem] leading-tight">{t(item.name)}</span>
                                        {isActive && showProgress && (
                                            <span
                                                key={progressKey}
                                                className="demo-progress absolute inset-x-3 bottom-0 h-[2px] origin-left rounded-full"
                                                style={{
                                                    background: 'var(--brand)',
                                                    animationDuration: `${progressMs}ms`,
                                                    animationPlayState: progressRunning ? 'running' : 'paused',
                                                }}
                                                aria-hidden
                                            />
                                        )}
                                    </>
                                );
                                const base = cn(
                                    'group relative flex w-full items-center justify-start gap-3 rounded-md px-3 py-2 font-medium transition-colors duration-150',
                                    'text-ink-soft',
                                    isActive && 'bg-brand-soft text-brand-soft-ink',
                                );
                                if (!item.scene) {
                                    return (
                                        <div key={item.name} className={base} aria-hidden>
                                            {body}
                                        </div>
                                    );
                                }
                                const scene = item.scene;
                                return (
                                    <button
                                        key={item.name}
                                        type="button"
                                        onClick={() => onSelect(scene)}
                                        aria-current={isActive ? 'true' : undefined}
                                        className={cn(
                                            base,
                                            'cursor-pointer text-left',
                                            !isActive && 'hover:bg-surface-sunken hover:text-ink',
                                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]',
                                        )}
                                    >
                                        {body}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="mt-auto border-t border-border-subtle bg-surface-sunken p-3" aria-hidden>
                <div className="flex h-auto w-full items-center gap-3 px-2 py-2">
                    <span
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-[0.8125rem] font-semibold shadow-sm"
                        style={{ backgroundColor: 'var(--brand-soft)', color: 'var(--brand-soft-ink)' }}
                    >
                        {DEMO_USER.initials}
                    </span>
                    <div className="flex flex-1 flex-col items-start overflow-hidden">
                        <span className="w-full truncate text-left text-[0.8125rem] font-medium text-ink">{DEMO_USER.name}</span>
                        <span className="w-full truncate text-left text-[0.6875rem] capitalize text-ink-muted">{tRoles('admin')}</span>
                    </div>
                    <ChevronUp className="ml-auto h-4 w-4 text-ink-muted" />
                </div>
            </div>
        </aside>
    );
}

/** Réplica de ComplianceBar: certificaciones a la izquierda, sync + reloj a la derecha. */
export function DemoComplianceBar({ compact = false }: { compact?: boolean }) {
    const t = useTranslations('ComplianceBar');
    const tDemo = useTranslations('Landing.demo');
    const [now, setNow] = useState('');

    useEffect(() => {
        const fmt = new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hourCycle: 'h23',
        });
        const tick = () => setNow(fmt.format(new Date()));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div
            className="flex h-7 shrink-0 items-center justify-between gap-4 border-b bg-surface-sunken px-3"
            style={{ borderColor: 'var(--border-subtle)' }}
            aria-hidden
        >
            <div className="flex min-w-0 items-center gap-3 overflow-hidden">
                <span className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] font-medium tracking-tight text-ink-soft">
                    <ShieldCheck className="h-3 w-3 shrink-0" style={{ color: 'var(--brand)' }} />
                    21 CFR Part 11
                </span>
                <span className="h-3 w-px shrink-0 bg-border-strong" />
                <span className="font-mono text-[0.6875rem] font-medium tracking-tight text-ink-soft">ALCOA+</span>
                {!compact && (
                    <>
                        <span className="h-3 w-px shrink-0 bg-border-strong" />
                        <span className="inline-flex items-center gap-1.5 truncate text-[0.6875rem] text-ink-muted">
                            <Building2 className="h-3 w-3 shrink-0 text-ink-faint" />
                            {tDemo('orgName')}
                        </span>
                    </>
                )}
            </div>
            <div className="flex shrink-0 items-center gap-3">
                <span className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] text-ink-muted">
                    <Wifi className="h-3 w-3" style={{ color: 'var(--brand)' }} />
                    {!compact && t('synced')}
                </span>
                <span className="h-3 w-px shrink-0 bg-border-strong" />
                <span className="font-mono text-[0.6875rem] tabular-nums text-ink-soft">{now || ' '}</span>
            </div>
        </div>
    );
}

/** Botón flotante "+" de acciones rápidas (decorativo). */
export function DemoFab() {
    return (
        <span
            className="absolute bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
            style={{ background: 'var(--brand)' }}
            aria-hidden
        >
            <Plus className="h-6 w-6" />
        </span>
    );
}
