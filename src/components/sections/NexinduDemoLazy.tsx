'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const NexinduDemo = dynamic(() => import('@/demo/NexinduDemo'), { ssr: false });

/** Carga la demo solo cuando está cerca del viewport, para no afectar el LCP. */
export function NexinduDemoLazy({ minHeight = 420 }: { minHeight?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight }}>
      {near && <NexinduDemo />}
    </div>
  );
}
