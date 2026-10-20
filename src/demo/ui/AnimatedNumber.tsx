'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
    value: number;
    /** Animation duration in ms. Default 600. */
    duration?: number;
    /** Optional formatter (e.g., toLocaleString) — receives the current frame value. */
    format?: (n: number) => string;
    /** Skip animation entirely (e.g., for SSR-first paint of zero). */
    instant?: boolean;
}

/* ─────────────────────────────────────────────────────────────────────────
   AnimatedNumber
   Counts up from 0 to `value` on first mount, and re-animates from the
   previous value to the new value when `value` changes. Uses ease-out-quart
   so the number "settles" without bounce. Respects prefers-reduced-motion
   (skips the animation in that case, jumps straight to the final value).
   ───────────────────────────────────────────────────────────────────────── */
export function AnimatedNumber({
    value,
    duration = 600,
    format,
    instant = false,
}: AnimatedNumberProps) {
    const [display, setDisplay] = useState<number>(0);
    const fromRef = useRef<number>(0);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (instant) {
            setDisplay(value);
            fromRef.current = value;
            return;
        }

        const reducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reducedMotion) {
            setDisplay(value);
            fromRef.current = value;
            return;
        }

        const from = fromRef.current;
        const to = value;
        if (from === to) return;

        const start = performance.now();

        // ease-out-quart: 1 - (1 - t)^4
        const ease = (t: number) => 1 - Math.pow(1 - t, 4);

        const tick = (now: number) => {
            const elapsed = now - start;
            const t = Math.min(elapsed / duration, 1);
            const eased = ease(t);
            const current = from + (to - from) * eased;
            // Round so we never display fractional counts.
            setDisplay(Math.round(current));
            if (t < 1) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                fromRef.current = to;
            }
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [value, duration, instant]);

    return <>{format ? format(display) : display}</>;
}
