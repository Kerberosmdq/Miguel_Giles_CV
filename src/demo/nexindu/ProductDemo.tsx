'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { LayoutDashboard, ClipboardList, BarChart3, ScanEye, ShieldCheck, Pause, Play, MousePointerClick } from 'lucide-react';
import { cn } from '@/demo/lib/utils';
import { useDemoDirector } from '@/demo/engine/useDemoDirector';
import { DEMO_SCENES, type DemoSceneId } from './scenes';
import { DemoComplianceBar, DemoFab, DemoSidebar } from './DemoShell';
import { PanelScene } from './scenes/PanelScene';
import { WorkOrdersScene } from './scenes/WorkOrdersScene';
import { AnalyticsScene } from './scenes/AnalyticsScene';
import { NexiScene } from './scenes/NexiScene';
import { AuditScene } from './scenes/AuditScene';

/*
 * Demo interactiva del hero de la landing.
 *
 * La app se dibuja a un tamaño "virtual" fijo y se escala con CSS al ancho
 * disponible, igual que un video: así cada escena se ve idéntica en cualquier
 * pantalla y el texto nunca se reacomoda. En celular se usa un lienzo virtual
 * angosto con navegación por pestañas en lugar del menú lateral.
 */

const DESKTOP = { w: 1520, h: 950 } as const;
const MOBILE = { w: 400, h: 680 } as const;
const COMPACT_BELOW = 640;

const MOBILE_TABS: { scene: DemoSceneId; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { scene: 'panel', icon: LayoutDashboard, label: 'dashboard' },
    { scene: 'workOrders', icon: ClipboardList, label: 'workOrders' },
    { scene: 'analytics', icon: BarChart3, label: 'analytics' },
    { scene: 'nexi', icon: ScanEye, label: 'nexiVision' },
    { scene: 'audit', icon: ShieldCheck, label: 'auditLogs' },
];

function Scene({ id, compact, playing, onInteract }: { id: DemoSceneId; compact: boolean; playing: boolean; onInteract: () => void }) {
    switch (id) {
        case 'panel':
            return <PanelScene compact={compact} onInteract={onInteract} />;
        case 'workOrders':
            return <WorkOrdersScene compact={compact} onInteract={onInteract} />;
        case 'analytics':
            return <AnalyticsScene compact={compact} playing={playing} onInteract={onInteract} />;
        case 'nexi':
            return <NexiScene compact={compact} playing={playing} onInteract={onInteract} />;
        case 'audit':
            return <AuditScene compact={compact} playing={playing} onInteract={onInteract} />;
    }
}

export default function ProductDemo() {
    const t = useTranslations('Landing.demo');
    const tSide = useTranslations('Sidebar');
    const d = useDemoDirector(DEMO_SCENES);

    const stageRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const el = stageRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const compact = width > 0 && width < COMPACT_BELOW;
    const v = compact ? MOBILE : DESKTOP;
    const scale = width ? width / v.w : 0;
    const sceneIndex = (id: DemoSceneId) => DEMO_SCENES.findIndex((s) => s.id === id);
    const select = (id: DemoSceneId) => d.goTo(sceneIndex(id));
    const showProgress = d.mode !== 'user';

    return (
        <div ref={d.rootRef} className="w-full">
            <div className="demo-panel relative overflow-hidden rounded-b-[2rem] px-[3.5%] pt-10 md:rounded-b-[2.5rem] md:pt-14">
                <div
                    ref={stageRef}
                    className="relative w-full"
                    style={{ height: scale ? v.h * scale : undefined, aspectRatio: scale ? undefined : `${DESKTOP.w} / ${DESKTOP.h}` }}
                    onPointerMove={d.onPointerMove}
                    onPointerLeave={d.onPointerLeave}
                >
                    {scale > 0 && (
                        <div
                            role="region"
                            aria-roledescription={t('roleDescription')}
                            aria-label={t('ariaLabel')}
                            className="absolute left-0 top-0 flex origin-top-left overflow-hidden rounded-t-xl text-left shadow-2xl"
                            style={{
                                width: v.w,
                                height: v.h,
                                transform: `scale(${scale})`,
                                background: 'var(--surface-sunken)',
                                color: 'var(--ink)',
                            }}
                        >
                            {!compact && (
                                <DemoSidebar
                                    active={d.scene.id}
                                    onSelect={select}
                                    progressMs={d.scene.duration}
                                    progressKey={d.runKey}
                                    progressRunning={d.running}
                                    showProgress={showProgress}
                                />
                            )}

                            <div className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden">
                                <DemoComplianceBar compact={compact} />

                                {compact && (
                                    <nav className="grid shrink-0 grid-cols-5 border-b border-border-subtle bg-surface">
                                        {MOBILE_TABS.map(({ scene, icon: Icon, label }) => {
                                            const active = d.scene.id === scene;
                                            return (
                                                <button
                                                    key={scene}
                                                    type="button"
                                                    onClick={() => select(scene)}
                                                    aria-current={active ? 'true' : undefined}
                                                    className={cn(
                                                        'relative flex flex-col items-center gap-1 px-1 py-2.5 text-[0.625rem] font-medium',
                                                        active ? 'bg-brand-soft text-brand-soft-ink' : 'text-ink-muted',
                                                    )}
                                                >
                                                    <Icon className={cn('h-[18px] w-[18px]', active && 'text-brand')} />
                                                    <span className="w-full truncate text-center">{tSide(label)}</span>
                                                    {active && showProgress && (
                                                        <span
                                                            key={d.runKey}
                                                            className="demo-progress absolute inset-x-2 bottom-0 h-[2px] origin-left rounded-full"
                                                            style={{
                                                                background: 'var(--brand)',
                                                                animationDuration: `${d.scene.duration}ms`,
                                                                animationPlayState: d.running ? 'running' : 'paused',
                                                            }}
                                                            aria-hidden
                                                        />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </nav>
                                )}

                                {/* Decorado: sin hover ni clics salvo en lo que una escena marca pointer-events-auto. */}
                                <div className="pointer-events-none relative min-h-0 flex-1 overflow-hidden" aria-hidden>
                                    <AnimatePresence mode="wait" initial={false}>
                                        <motion.div
                                            key={d.scene.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.18 }}
                                            className="h-full"
                                        >
                                            <Scene
                                                id={d.scene.id}
                                                compact={compact}
                                                // El guion interno de la escena corre también si el visitante llegó
                                                // con un clic en el menú; sólo lo frenan la pausa o salir de pantalla.
                                                playing={d.mode !== 'paused' && d.visible}
                                                onInteract={d.touch}
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                    {!compact && <DemoFab />}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 px-1">
                <p className="inline-flex items-center gap-2 text-sm" style={{ color: 'rgba(226,236,255,0.7)' }}>
                    <MousePointerClick className="h-4 w-4 shrink-0" style={{ color: '#2dd4f0' }} aria-hidden />
                    {compact ? t('hintMobile') : t('hint')}
                </p>
                <button
                    type="button"
                    onClick={d.togglePause}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2dd4f0]"
                    style={{ borderColor: 'rgba(255,255,255,0.25)' }}
                >
                    {d.mode === 'paused' ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
                    {d.mode === 'paused' ? t('play') : t('pause')}
                </button>
            </div>
        </div>
    );
}
