import type { DemoScene } from '@/demo/engine/useDemoDirector';

export type DemoSceneId = 'panel' | 'workOrders' | 'analytics' | 'nexi' | 'audit';

/** Orden y duración (ms) del recorrido automático. */
export const DEMO_SCENES: readonly DemoScene<DemoSceneId>[] = [
    { id: 'panel', duration: 3000 },
    { id: 'workOrders', duration: 5000 },
    // Analytics lleva su propio guion (ranking → sub-activos → OT → resto de gráficos).
    { id: 'analytics', duration: 10000 },
    // Pregunta que se escribe sola → fuentes → respuesta en streaming.
    { id: 'nexi', duration: 9000 },
    // Filas del registro → clic en Verificar integridad → cadena íntegra.
    { id: 'audit', duration: 6000 },
];

export interface SceneProps {
    /** Layout reducido para celular. */
    compact?: boolean;
    /** true mientras el guion interno puede avanzar: demo no pausada y en pantalla. */
    playing?: boolean;
    /** Avisa al director que el visitante interactuó dentro de la escena. */
    onInteract?: () => void;
}
