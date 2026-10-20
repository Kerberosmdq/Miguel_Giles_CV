/**
 * Datos ficticios de la demo del hero: una planta farmacéutica genérica.
 *
 * Nombres de personas y máquinas son datos (no texto de interfaz) y quedan
 * iguales en todos los idiomas. Todo lo que es texto de interfaz o contenido
 * redactado vive en messages/*.json bajo `Landing.demo`.
 *
 * La OT `STORY_OT` recorre todas las escenas: aparece en la bitácora, en la
 * lista de OT, en el desglose del ranking, Nexi la cita y auditoría la firma.
 */

export const DEMO_USER = { name: 'Olivia Catarino', initials: 'OC', firstName: 'Olivia' } as const;

export const TECHS = {
    roman: 'Román Ferreyra',
    sofia: 'Sofía Ibarra',
    martin: 'Martín Quiroga',
    valentina: 'Valentina Rossi',
    joaquin: 'Joaquín Paz',
    carla: 'Carla Benítez',
    tomas: 'Tomás Aguirre',
    olivia: DEMO_USER.name,
} as const;

export const ASSETS = {
    l1: 'Llenadora L-1',
    l2: 'Llenadora L-2',
    s1: 'Sopladora S-1',
    s2: 'Sopladora S-2',
    au1: 'Autoclave Au-1',
    au2: 'Autoclave Au-2',
    r1: 'Robot 1',
    r2: 'Robot 2',
} as const;

export const STORY_OT = '26-0147';

/* ─── Panel ─────────────────────────────────────────────────────────────── */

export type KpiKey = 'pendingRequests' | 'pendingReviews' | 'lowStock' | 'highPriority';

/** Mismas tarjetas y mismo orden que ve un admin en el panel real. */
export const PANEL_KPIS: { key: KpiKey; value: number; tone: 'warning' | 'brand' }[] = [
    { key: 'pendingRequests', value: 6, tone: 'warning' },
    { key: 'pendingReviews', value: 11, tone: 'brand' },
    { key: 'lowStock', value: 4, tone: 'warning' },
    { key: 'highPriority', value: 3, tone: 'warning' },
];

export type WallKind = 'nexi' | 'human' | 'system';
export type WallPriority = 'urgent' | 'warning' | 'info';

export interface WallEntry {
    /** Clave en Landing.demo.wall */
    key: string;
    kind: WallKind;
    priority: WallPriority;
    time: string;
    author?: string;
    asset?: string;
    /** Valores para interpolar en el texto traducido. */
    values?: Record<string, string | number>;
}

/** Días abiertos (hoy y ayer), en el orden en que la bitácora real los muestra. */
export const WALL_OPEN_DAYS: { offset: 0 | 1; entries: WallEntry[] }[] = [
    {
        offset: 0,
        entries: [
            {
                key: 'otCompleted',
                kind: 'nexi',
                priority: 'info',
                time: '10:32',
                values: { ot: STORY_OT, name: TECHS.roman, min: 48 },
            },
            {
                key: 'l1Stopped',
                kind: 'human',
                priority: 'urgent',
                time: '09:44',
                author: TECHS.sofia,
                asset: ASSETS.l1,
                values: { asset: ASSETS.l1, name: 'Román' },
            },
            {
                key: 'correctiveDone',
                kind: 'nexi',
                priority: 'info',
                time: '08:15',
                values: { asset: ASSETS.au2, name: TECHS.martin },
            },
            {
                key: 'gmpReminder',
                kind: 'human',
                priority: 'info',
                time: '07:02',
                author: TECHS.olivia,
            },
        ],
    },
    {
        offset: 1,
        entries: [
            {
                key: 's2Vibration',
                kind: 'human',
                priority: 'warning',
                time: '22:10',
                author: TECHS.joaquin,
                asset: ASSETS.s2,
                values: { asset: ASSETS.s2 },
            },
            {
                key: 'pmSigned',
                kind: 'nexi',
                priority: 'info',
                time: '18:37',
                values: { asset: ASSETS.r1, name: TECHS.valentina },
            },
            {
                key: 'lowStock',
                kind: 'system',
                priority: 'info',
                time: '14:05',
                values: { item: '40 mm' },
            },
        ],
    },
];

/** Días anteriores, plegados como en la bitácora real (sólo fecha y cantidad). */
export const WALL_CLOSED_DAYS: { offset: number; count: number }[] = [
    { offset: 3, count: 2 },
    { offset: 4, count: 3 },
    { offset: 6, count: 1 },
    { offset: 9, count: 2 },
    { offset: 11, count: 4 },
];

/* ─── Órdenes de trabajo ────────────────────────────────────────────────── */

export type WoType = 'corrective' | 'preventive' | 'predictive';
export type WoPriority = 'low' | 'medium' | 'high' | 'critical';
export type WoStatus = 'pending' | 'assigned' | 'in_progress' | 'completed';

export interface DemoWorkOrder {
    kind: 'wo';
    id: string;
    /** Clave del título en Landing.demo.wo */
    titleKey: string;
    asset: string;
    subAsset?: string;
    type: WoType;
    priority: WoPriority;
    status: WoStatus;
    handedOff?: boolean;
    assignee: string;
    daysAgo: number;
}

export interface DemoOperatorReport {
    kind: 'report';
    id: string;
    reportType: 'sala' | 'cleaning';
    asset: string;
    reviewed: boolean;
    creator: string;
    daysAgo: number;
}

export type DemoWoRow = DemoWorkOrder | DemoOperatorReport;

/** Lista "Todas las Órdenes": OT y partes de operario mezclados, más nuevos primero. */
export const WORK_ORDERS: DemoWoRow[] = [
    { kind: 'wo', id: STORY_OT, titleKey: 't147', asset: ASSETS.l1, subAsset: 'Selladora', type: 'corrective', priority: 'critical', status: 'completed', assignee: TECHS.roman, daysAgo: 0 },
    { kind: 'wo', id: '26-0146', titleKey: 't146', asset: ASSETS.au1, type: 'preventive', priority: 'medium', status: 'in_progress', assignee: TECHS.sofia, daysAgo: 0 },
    { kind: 'report', id: 'PO-26-0031', reportType: 'sala', asset: ASSETS.l2, reviewed: false, creator: TECHS.carla, daysAgo: 0 },
    { kind: 'wo', id: '26-0145', titleKey: 't145', asset: ASSETS.s2, subAsset: 'Molde', type: 'corrective', priority: 'high', status: 'assigned', handedOff: true, assignee: TECHS.joaquin, daysAgo: 1 },
    { kind: 'wo', id: '26-0144', titleKey: 't144', asset: ASSETS.au2, type: 'predictive', priority: 'medium', status: 'completed', assignee: TECHS.martin, daysAgo: 1 },
    { kind: 'wo', id: '26-0143', titleKey: 't143', asset: ASSETS.r1, subAsset: 'Pinza', type: 'corrective', priority: 'medium', status: 'completed', assignee: TECHS.valentina, daysAgo: 2 },
    { kind: 'report', id: 'PO-26-0030', reportType: 'cleaning', asset: ASSETS.s1, reviewed: true, creator: TECHS.carla, daysAgo: 2 },
    { kind: 'wo', id: '26-0142', titleKey: 't142', asset: ASSETS.r2, type: 'preventive', priority: 'low', status: 'completed', assignee: TECHS.tomas, daysAgo: 3 },
    { kind: 'wo', id: '26-0141', titleKey: 't141', asset: ASSETS.s1, type: 'corrective', priority: 'high', status: 'completed', assignee: TECHS.roman, daysAgo: 3 },
    { kind: 'wo', id: '26-0140', titleKey: 't140', asset: ASSETS.au1, subAsset: 'Puerta', type: 'corrective', priority: 'critical', status: 'completed', assignee: TECHS.martin, daysAgo: 4 },
    { kind: 'wo', id: '26-0139', titleKey: 't139', asset: ASSETS.l2, type: 'preventive', priority: 'medium', status: 'completed', assignee: TECHS.sofia, daysAgo: 5 },
    { kind: 'wo', id: '26-0138', titleKey: 't138', asset: ASSETS.r2, subAsset: 'Ventosas', type: 'corrective', priority: 'medium', status: 'completed', assignee: TECHS.valentina, daysAgo: 6 },
    { kind: 'wo', id: '26-0137', titleKey: 't137', asset: ASSETS.au2, type: 'preventive', priority: 'medium', status: 'completed', assignee: TECHS.joaquin, daysAgo: 7 },
    { kind: 'wo', id: '26-0136', titleKey: 't136', asset: ASSETS.s2, type: 'corrective', priority: 'high', status: 'completed', assignee: TECHS.roman, daysAgo: 8 },
    { kind: 'wo', id: '26-0135', titleKey: 't135', asset: ASSETS.l1, subAsset: 'Agujas', type: 'preventive', priority: 'medium', status: 'completed', assignee: TECHS.martin, daysAgo: 9 },
    { kind: 'wo', id: '26-0134', titleKey: 't134', asset: ASSETS.r1, type: 'corrective', priority: 'critical', status: 'completed', assignee: TECHS.tomas, daysAgo: 10 },
];

/** Totales que muestra la pantalla (la lista de arriba es sólo la primera página). */
export const WO_TOTALS = { rows: 178, open: 2, reports: 31 } as const;
