'use client';

import { AnimatePresence, motion } from 'framer-motion';

export interface CursorState {
    x: number;
    y: number;
    visible: boolean;
    /** Se incrementa en cada clic simulado para disparar el pulso. */
    clicks: number;
}

export const CURSOR_HIDDEN: CursorState = { x: 0, y: 0, visible: false, clicks: 0 };

/** Cursor simulado del recorrido automático: muestra que el gráfico se puede tocar. */
export function DemoCursor({ state }: { state: CursorState }) {
    return (
        <AnimatePresence>
            {state.visible && (
                <motion.div
                    className="pointer-events-none absolute left-0 top-0 z-40"
                    initial={{ opacity: 0, x: state.x + 40, y: state.y + 40 }}
                    animate={{ opacity: 1, x: state.x, y: state.y }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'tween', duration: 0.65, ease: [0.45, 0, 0.2, 1] }}
                    aria-hidden
                >
                    <AnimatePresence>
                        {state.clicks > 0 && (
                            <motion.span
                                key={state.clicks}
                                className="absolute -left-4 -top-4 h-8 w-8 rounded-full"
                                style={{ border: '2px solid var(--brand)' }}
                                initial={{ scale: 0.3, opacity: 0.9 }}
                                animate={{ scale: 1.4, opacity: 0 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            />
                        )}
                    </AnimatePresence>
                    <motion.svg
                        key={state.clicks}
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        initial={{ scale: 0.85 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.18 }}
                        style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.35))', transformOrigin: '3px 2px' }}
                    >
                        <path d="M3 2l7.5 19 2.6-7.6L21 10.8z" fill="#fff" stroke="#111827" strokeWidth="1.5" strokeLinejoin="round" />
                    </motion.svg>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
