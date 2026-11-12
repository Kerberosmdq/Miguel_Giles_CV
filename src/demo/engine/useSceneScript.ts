'use client';

import { useEffect, useRef } from 'react';

export interface ScriptStep {
    /** Milisegundos desde que la escena empezó a reproducirse. */
    at: number;
    run: () => void;
}

/**
 * Guion interno de una escena (p. ej. el cursor que abre el ranking).
 *
 * El tiempo sólo avanza mientras `active` es true: si la demo se pausa, sale
 * de pantalla o el visitante toma el control, el guion se congela y retoma
 * desde el mismo punto. Cada paso corre una sola vez por montaje de escena.
 */
export function useSceneScript(steps: ScriptStep[], active: boolean) {
    const stepsRef = useRef(steps);
    const elapsedRef = useRef(0);
    const firedRef = useRef(0);

    useEffect(() => {
        stepsRef.current = steps;
    });

    useEffect(() => {
        if (!active) return;
        let last = performance.now();
        let raf = 0;
        const tick = (now: number) => {
            elapsedRef.current += now - last;
            last = now;
            const list = stepsRef.current;
            while (firedRef.current < list.length && list[firedRef.current].at <= elapsedRef.current) {
                list[firedRef.current].run();
                firedRef.current++;
            }
            if (firedRef.current < list.length) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [active]);
}

/**
 * Centro de `el` en coordenadas del lienzo virtual de `root` (la demo está
 * escalada con transform, así que se deshace la escala).
 */
export function pointIn(root: HTMLElement, el: Element, dx = 0, dy = 0) {
    const r = root.getBoundingClientRect();
    const e = el.getBoundingClientRect();
    const scale = r.width / root.offsetWidth || 1;
    return {
        x: (e.left - r.left + e.width / 2) / scale + dx,
        y: (e.top - r.top + e.height / 2) / scale + dy,
    };
}
