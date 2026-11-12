'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Director de la demo del hero.
 *
 * Lleva una lista de escenas y decide cuál se ve. Tres modos:
 *  - auto:   avanza solo, cada escena dura `duration` ms.
 *  - user:   el visitante hizo clic; el automático se suspende hasta que deja
 *            de interactuar (IDLE_MS dentro del marco, LEAVE_MS al salir) y
 *            entonces retoma DESDE LA ESCENA EN QUE QUEDÓ, no desde el inicio.
 *  - paused: botón de pausa (WCAG 2.2.2). Sólo sale con el botón de play.
 *
 * El tiempo restante de la escena se conserva al pausar, así la barrita de
 * progreso (animación CSS con play-state) y el temporizador no se desfasan.
 * Fuera de pantalla o con la pestaña oculta no corre nada.
 */

export type DemoMode = 'auto' | 'user' | 'paused';

export interface DemoScene<Id extends string = string> {
    id: Id;
    duration: number;
}

const IDLE_MS = 10_000;
const LEAVE_MS = 3_000;

export function useDemoDirector<Id extends string>(scenes: readonly DemoScene<Id>[]) {
    const [index, setIndex] = useState(0);
    const [mode, setMode] = useState<DemoMode>('auto');
    const [inView, setInView] = useState(false);
    const [pageVisible, setPageVisible] = useState(true);
    /** Cambia cada vez que la barra de progreso debe reiniciarse. */
    const [runKey, setRunKey] = useState(0);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const remainingRef = useRef(scenes[0].duration);
    const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const indexRef = useRef(0);
    useEffect(() => {
        indexRef.current = index;
    }, [index]);

    const running = mode === 'auto' && inView && pageVisible;

    // Movimiento reducido: arranca en pausa; el visitante puede darle play.
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setMode('paused');
        }
    }, []);

    // Sólo corre mientras se ve.
    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
            threshold: 0.25,
        });
        io.observe(el);
        const onVis = () => setPageVisible(document.visibilityState === 'visible');
        document.addEventListener('visibilitychange', onVis);
        return () => {
            io.disconnect();
            document.removeEventListener('visibilitychange', onVis);
        };
    }, []);

    // Avance automático, conservando el tiempo restante si se interrumpe.
    useEffect(() => {
        if (!running) return;
        const start = performance.now();
        let fired = false;
        const id = setTimeout(() => {
            fired = true;
            const next = (indexRef.current + 1) % scenes.length;
            remainingRef.current = scenes[next].duration;
            setIndex(next);
            setRunKey((k) => k + 1);
        }, remainingRef.current);
        return () => {
            clearTimeout(id);
            if (!fired) {
                remainingRef.current = Math.max(0, remainingRef.current - (performance.now() - start));
            }
        };
    }, [running, index, runKey, scenes]);

    const clearIdle = () => {
        if (idleRef.current) clearTimeout(idleRef.current);
        idleRef.current = null;
    };

    const armIdle = useCallback(
        (ms: number) => {
            clearIdle();
            idleRef.current = setTimeout(() => {
                // Retoma en la escena actual con su duración completa.
                remainingRef.current = scenes[indexRef.current].duration;
                setRunKey((k) => k + 1);
                setMode('auto');
            }, ms);
        },
        [scenes],
    );

    useEffect(() => clearIdle, []);

    /** Clic del visitante en un elemento navegable de la demo. */
    const goTo = useCallback(
        (i: number) => {
            if (i !== indexRef.current) {
                remainingRef.current = scenes[i].duration;
                setIndex(i);
                setRunKey((k) => k + 1);
            }
            setMode((m) => (m === 'paused' ? 'paused' : 'user'));
            if (mode !== 'paused') armIdle(IDLE_MS);
        },
        [scenes, mode, armIdle],
    );

    /** Cualquier interacción dentro de la escena (p. ej. el desglose del ranking). */
    const touch = useCallback(() => {
        if (mode === 'paused') return;
        setMode('user');
        armIdle(IDLE_MS);
    }, [mode, armIdle]);

    const onPointerMove = useCallback(() => {
        if (mode === 'user') armIdle(IDLE_MS);
    }, [mode, armIdle]);

    const onPointerLeave = useCallback(() => {
        if (mode === 'user') armIdle(LEAVE_MS);
    }, [mode, armIdle]);

    const togglePause = useCallback(() => {
        clearIdle();
        setMode((m) => (m === 'paused' ? 'auto' : 'paused'));
    }, []);

    return {
        rootRef,
        index,
        scene: scenes[index],
        mode,
        running,
        /** En pantalla y con la pestaña visible (independiente del modo). */
        visible: inView && pageVisible,
        runKey,
        goTo,
        touch,
        togglePause,
        onPointerMove,
        onPointerLeave,
    };
}
