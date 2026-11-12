import { ASSETS, WORK_ORDERS, type DemoWorkOrder, type WoPriority, type WoStatus, type WoType } from './demo-data';

/**
 * Datos de la escena de Analytics: un único conjunto de OT del año del que
 * salen TODOS los gráficos. Igual que en la app (regla de Analytics del
 * CLAUDE.md), cada número del ranking es el largo de la lista que abre:
 * `ASSET_BUCKETS` es a la vez el conteo y el contenido del desglose.
 *
 * Las OT de la lista de la escena de OT (WORK_ORDERS) están incluidas con sus
 * mismos datos; el resto se completa con OT más viejas, deterministas.
 */

export interface AnalyticsWo {
    id: string;
    /** Clave en Landing.demo.wo */
    titleKey: string;
    asset: string;
    /** undefined → bucket "General" (OT cargada sobre la máquina, no sobre un sub-activo) */
    subAsset?: string;
    type: WoType;
    priority: WoPriority;
    status: WoStatus;
    downtime: number;
    duration: number;
}

/** Cantidad de OT por máquina y sub-activo en el año (incluye las explícitas). */
const PLAN: [asset: string, subAsset: string | undefined, total: number][] = [
    [ASSETS.l1, 'Selladora', 9],
    [ASSETS.l1, 'Agujas', 6],
    [ASSETS.l1, 'Dosificador', 4],
    [ASSETS.l1, 'Transportador', 3],
    [ASSETS.s2, 'Molde', 7],
    [ASSETS.s2, 'Alimentador', 5],
    [ASSETS.s2, 'Horno', 3],
    [ASSETS.s2, undefined, 2],
    [ASSETS.au1, 'Puerta', 5],
    [ASSETS.au1, 'Bomba de vacío', 4],
    [ASSETS.au1, undefined, 4],
    [ASSETS.r1, 'Pinza', 4],
    [ASSETS.r1, 'Controlador', 3],
    [ASSETS.r1, undefined, 2],
    [ASSETS.l2, 'Dosificador', 4],
    [ASSETS.l2, undefined, 3],
    [ASSETS.s1, 'Horno', 3],
    [ASSETS.s1, undefined, 3],
    [ASSETS.au2, undefined, 3],
    [ASSETS.au2, 'Sensor de temperatura', 2],
    [ASSETS.r2, 'Ventosas', 2],
    [ASSETS.r2, undefined, 2],
];

const CORRECTIVE_TITLES = ['g1', 'g2', 'g3', 'g5', 'g8', 'g9'];
const PREVENTIVE_TITLES = ['g6', 'g7', 'g10', 'g4'];
const CORRECTIVE_PRIORITIES: WoPriority[] = ['medium', 'high', 'critical', 'medium', 'low', 'high'];

/** Minutos deterministas a partir de un número (sin Math.random: igual en cada render). */
function minutes(n: number, type: WoType) {
    if (type === 'preventive') return { downtime: 0, duration: 45 + ((n * 29) % 5) * 15 };
    return { downtime: 25 + ((n * 37) % 9) * 25, duration: 30 + ((n * 53) % 7) * 20 };
}

function fromExplicit(wo: DemoWorkOrder): AnalyticsWo {
    const n = Number(wo.id.slice(3));
    const m = wo.id === '26-0147' ? { downtime: 95, duration: 48 } : minutes(n, wo.type);
    return {
        id: wo.id,
        titleKey: wo.titleKey,
        asset: wo.asset,
        subAsset: wo.subAsset,
        type: wo.type,
        priority: wo.priority,
        status: wo.status,
        ...m,
    };
}

function build(): AnalyticsWo[] {
    const explicit = WORK_ORDERS.filter((r): r is DemoWorkOrder => r.kind === 'wo').map(fromExplicit);
    const key = (asset: string, sub?: string) => `${asset}|${sub ?? ''}`;

    // Cuántas OT faltan en cada bucket después de ubicar las explícitas.
    const missing = new Map<string, number>();
    for (const [asset, sub, total] of PLAN) missing.set(key(asset, sub), total);
    for (const wo of explicit) {
        const k = key(wo.asset, wo.subAsset);
        missing.set(k, (missing.get(k) ?? 0) - 1);
    }

    // Relleno en ronda entre buckets para que los números de OT queden mezclados.
    const fillers: AnalyticsWo[] = [];
    let next = 133;
    let i = 0;
    let pending = true;
    while (pending) {
        pending = false;
        for (const [asset, sub] of PLAN) {
            const k = key(asset, sub);
            const left = missing.get(k) ?? 0;
            if (left <= 0) continue;
            pending = true;
            missing.set(k, left - 1);
            const type: WoType = i % 5 === 1 || i % 5 === 3 ? 'preventive' : i % 11 === 0 ? 'predictive' : 'corrective';
            const titles = type === 'preventive' ? PREVENTIVE_TITLES : CORRECTIVE_TITLES;
            fillers.push({
                id: `26-${String(next).padStart(4, '0')}`,
                titleKey: titles[i % titles.length],
                asset,
                subAsset: sub,
                type,
                priority: type === 'preventive' ? (i % 2 ? 'medium' : 'low') : CORRECTIVE_PRIORITIES[i % CORRECTIVE_PRIORITIES.length],
                status: 'completed',
                ...minutes(next, type),
            });
            next--;
            i++;
        }
    }
    return [...explicit, ...fillers];
}

export const ANALYTICS_WOS: AnalyticsWo[] = build();

/* ─── Ranking (3 niveles desde una sola estructura) ──────────────────────── */

export interface SubBucket {
    /** null → bucket "General" */
    name: string | null;
    wos: AnalyticsWo[];
}

export interface AssetBucket {
    name: string;
    subs: SubBucket[];
    /** OT únicas de la máquina = suma de las listas de sus sub-activos. */
    total: number;
}

export const ASSET_BUCKETS: AssetBucket[] = (() => {
    const byAsset = new Map<string, Map<string | null, AnalyticsWo[]>>();
    for (const wo of ANALYTICS_WOS) {
        const subs = byAsset.get(wo.asset) ?? new Map<string | null, AnalyticsWo[]>();
        const k = wo.subAsset ?? null;
        subs.set(k, [...(subs.get(k) ?? []), wo]);
        byAsset.set(wo.asset, subs);
    }
    return [...byAsset.entries()]
        .map(([name, subs]) => {
            const list = [...subs.entries()]
                .map(([sub, wos]) => ({ name: sub, wos: [...wos].sort((a, b) => b.id.localeCompare(a.id)) }))
                .sort((a, b) => b.wos.length - a.wos.length);
            return { name, subs: list, total: list.reduce((s, b) => s + b.wos.length, 0) };
        })
        .sort((a, b) => b.total - a.total);
})();

/* ─── Tiempo de parada vs. tiempo técnico (Pareto, top 5 por parada) ──────── */

export const PARETO = (() => {
    const rows = ASSET_BUCKETS.map((b) => {
        const wos = b.subs.flatMap((s) => s.wos);
        return {
            name: b.name,
            downtime: wos.reduce((s, w) => s + w.downtime, 0),
            duration: wos.reduce((s, w) => s + w.duration, 0),
        };
    })
        .sort((a, b) => b.downtime - a.downtime)
        .slice(0, 5);
    const total = rows.reduce((s, r) => s + r.downtime, 0);
    let acc = 0;
    return rows.map((r) => {
        acc += r.downtime;
        return { ...r, cumPct: Math.round((acc / total) * 100) };
    });
})();

/* ─── Preventivo vs. correctivo ──────────────────────────────────────────── */

export const PVC = (() => {
    const preventive = ANALYTICS_WOS.filter((w) => w.type === 'preventive').length;
    return { preventive, corrective: ANALYTICS_WOS.length - preventive, total: ANALYTICS_WOS.length };
})();

/* ─── Alertas de patrones PM ─────────────────────────────────────────────── */

export const PM_ALERTS = { open: 3, acknowledged: 2, resolved: 7 } as const;

/* ─── Indicadores del período ────────────────────────────────────────────── */

export const INDICATORS = (() => {
    const correctives = ANALYTICS_WOS.filter((w) => w.type !== 'preventive');
    const downtime = ANALYTICS_WOS.reduce((s, w) => s + w.downtime, 0);
    const mttr = Math.round(correctives.reduce((s, w) => s + w.duration, 0) / correctives.length);
    // Horas de operación del año hasta hoy (aprox.) repartidas entre las fallas.
    const startOfYear = new Date(new Date().getFullYear(), 0, 1).getTime();
    const hours = Math.max(1, (Date.now() - startOfYear) / 3_600_000);
    const mtbfMin = Math.round((hours * 60) / correctives.length);
    const availability = Math.round((mtbfMin / (mtbfMin + mttr)) * 1000) / 10;
    return { downtime, failures: correctives.length, mttr, mtbfMin, availability };
})();

/** Mismo formato que formatDuration de AnalyticsDashboard. */
export function formatDuration(minutes: number): string {
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
}

/** Mismo formato que fmtMtbf de AnalyticsDashboard. */
export function formatMtbf(m: number): string {
    if (m >= 1440) return `${(m / 1440).toFixed(1)} d`;
    if (m >= 60) return `${Math.round(m / 60)} h`;
    return `${Math.round(m)} min`;
}
