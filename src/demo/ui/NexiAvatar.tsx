'use client';

import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';

export type AvatarState = 'idle' | 'thinking' | 'responded';

interface NexiAvatarProps {
    state: AvatarState;
    size?: number;
}

const variants: Variants = {
    idle: {
        y: [0, -6, 0],
        scale: 1,
        opacity: 1,
        transition: {
            y: { duration: 3, ease: 'easeInOut' as const, repeat: Infinity },
        },
    },
    thinking: {
        y: 0,
        scale: [1, 1.05, 1],
        opacity: [1, 0.7, 1],
        transition: {
            scale: { duration: 0.8, repeat: Infinity },
            opacity: { duration: 0.8, repeat: Infinity },
        },
    },
    responded: {
        y: 0,
        scale: 1,
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' as const },
    },
};

export function NexiAvatar({ state, size = 80 }: NexiAvatarProps) {
    return (
        <motion.div
            animate={state}
            variants={variants}
            className="flex-shrink-0"
        >
            <Image
                src="/demo/nexindu/nexi-avatar.png"
                alt="Nexi Vision"
                width={size}
                height={size}
                className="rounded-full"
                priority
            />
        </motion.div>
    );
}
