'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ClipboardList, ExternalLink, FileText, Loader2, Search, Send } from 'lucide-react';
import { cn } from '@/demo/lib/utils';
import { buttonVariants } from '@/demo/ui/button';
import { Badge } from '@/demo/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/demo/ui/card';
import { NexiAvatar, type AvatarState } from '@/demo/ui/NexiAvatar';
import { useSceneScript } from '@/demo/engine/useSceneScript';
import type { SceneProps } from '.';

/*
 * Réplica de Nexi Vision (NexiVisionClient + NexiVisionChat + NexiVisionSources).
 * Guion: la pregunta se escribe sola → Nexi analiza → aparecen las fuentes →
 * la respuesta llega en streaming, igual que en la app (las fuentes llegan
 * antes que el texto). La respuesta cita la OT de la historia.
 */

type Phase = 'empty' | 'typing' | 'thinking' | 'streaming' | 'done';

const EASE = [0.22, 1, 0.36, 1] as const;
const TYPE_MS_PER_CHAR = 28;
const STREAM_CHARS_PER_TICK = 5;
const STREAM_TICK_MS = 30;

const SOURCES = [
    { key: 'src1', type: 'work_order' as const, similarity: 94 },
    { key: 'src2', type: 'knowledge' as const, similarity: 88 },
    { key: 'src3', type: 'work_order' as const, similarity: 71 },
];

/** Mismo renderer mínimo que NexiVisionChat: **negrita**, __subrayado__, `código`. */
function renderInlineFormatting(text: string): React.ReactNode[] {
    return text.split(/(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`)/g).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith('__') && part.endsWith('__')) return <u key={i}>{part.slice(2, -2)}</u>;
        if (part.startsWith('`') && part.endsWith('`'))
            return (
                <code key={i} className="rounded bg-foreground/10 px-1 py-0.5 text-[0.85em]">
                    {part.slice(1, -1)}
                </code>
            );
        return part;
    });
}

/** No corta a mitad de un marcador de formato mientras llega el streaming. */
function safePrefix(text: string, n: number) {
    const slice = text.slice(0, n);
    const open = (slice.match(/\*\*/g)?.length ?? 0) % 2 === 1 || (slice.match(/__/g)?.length ?? 0) % 2 === 1;
    return open ? slice.replace(/(\*\*|__)[^*_]*$/, '') : slice;
}

function Lines({ text }: { text: string }) {
    return (
        <>
            {text.split('\n').map((line, i) => (
                <p key={i} className={line.trim() === '' ? 'h-2' : ''}>
                    {renderInlineFormatting(line)}
                </p>
            ))}
        </>
    );
}

export function NexiScene({ compact = false, playing = false }: SceneProps) {
    const t = useTranslations('NexiVision');
    const td = useTranslations('Landing.demo.nexi');
    const question = td('question');
    const answer = td('answer');

    // Con movimiento reducido se muestra directamente la conversación terminada.
    const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const [phase, setPhase] = useState<Phase>(reduced ? 'done' : 'empty');
    const [typed, setTyped] = useState(0);
    const [streamed, setStreamed] = useState(0);
    const [showSources, setShowSources] = useState(reduced);
    const [mobileTab, setMobileTab] = useState<'chat' | 'sources'>('chat');
    const scrollRef = useRef<HTMLDivElement | null>(null);

    // Igual que NexiVisionChat: el área de mensajes acompaña al texto que llega.
    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [phase, streamed, mobileTab]);

    useSceneScript(
        [
            { at: 700, run: () => setPhase('typing') },
            { at: 700 + question.length * TYPE_MS_PER_CHAR + 300, run: () => setPhase('thinking') },
            { at: 700 + question.length * TYPE_MS_PER_CHAR + 1000, run: () => setShowSources(true) },
            { at: 700 + question.length * TYPE_MS_PER_CHAR + 1500, run: () => setPhase('streaming') },
        ],
        playing && !reduced,
    );

    // Escritura de la pregunta y streaming de la respuesta: avanzan sólo mientras la demo corre.
    useEffect(() => {
        if (!playing) return;
        if (phase === 'typing') {
            const id = setInterval(() => setTyped((n) => Math.min(question.length, n + 1)), TYPE_MS_PER_CHAR);
            return () => clearInterval(id);
        }
        if (phase === 'streaming') {
            const id = setInterval(() => setStreamed((n) => Math.min(answer.length, n + STREAM_CHARS_PER_TICK)), STREAM_TICK_MS);
            return () => clearInterval(id);
        }
    }, [phase, playing, question.length, answer.length]);

    // Fin del streaming; en celular, después se muestra la pestaña de fuentes.
    useEffect(() => {
        if (phase !== 'streaming' || streamed < answer.length) return;
        setPhase('done');
    }, [phase, streamed, answer.length]);

    useEffect(() => {
        if (!compact || phase !== 'done' || !playing || reduced) return;
        const id = setTimeout(() => setMobileTab('sources'), 1400);
        return () => clearTimeout(id);
    }, [compact, phase, playing, reduced]);

    const isLoading = phase === 'thinking' || phase === 'streaming';
    const asked = phase === 'thinking' || phase === 'streaming' || phase === 'done';
    const avatarState: AvatarState = isLoading ? 'thinking' : asked ? 'responded' : 'idle';
    const cardHeight = compact ? 'h-[430px]' : 'h-[790px]';

    const chat = (
        <Card className={cn(cardHeight, 'flex flex-col')}>
            <CardContent className="flex min-h-0 flex-1 flex-col p-4">
                <div className="mb-4 flex items-center gap-3 border-b pb-4">
                    <NexiAvatar state={avatarState} size={48} />
                    <div>
                        <p className="text-sm font-semibold">Nexi Vision</p>
                        <p className="text-xs text-muted-foreground">{isLoading ? t('thinking') : t('readyStatus')}</p>
                    </div>
                </div>

                <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-hidden pr-1">
                    {!asked && (
                        <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
                            <NexiAvatar state="idle" size={96} />
                            <p className="mt-4 text-sm">{t('emptyChat')}</p>
                        </div>
                    )}

                    {asked && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: EASE }}
                            className="flex justify-end"
                        >
                            <div className="max-w-[85%] rounded-xl bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground">
                                {question}
                            </div>
                        </motion.div>
                    )}

                    {phase === 'thinking' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="flex items-center gap-2 rounded-xl bg-muted px-4 py-3">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{t('thinking')}</span>
                            </div>
                        </motion.div>
                    )}

                    {(phase === 'streaming' || phase === 'done') && (
                        <div className="flex justify-start">
                            <div className="max-w-[85%] rounded-xl bg-muted px-4 py-3 text-sm leading-relaxed text-foreground">
                                <div className="prose prose-sm max-w-none dark:prose-invert [&_p]:mb-2">
                                    <Lines text={phase === 'done' ? answer : safePrefix(answer, streamed)} />
                                    {phase === 'streaming' && (
                                        <span className="ml-0.5 inline-block h-[14px] w-[2px] animate-pulse bg-foreground/70 align-middle" />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex gap-2 border-t pt-4">
                    <div
                        className={cn(
                            'flex h-9 min-w-0 flex-1 items-center rounded-md border px-3 text-base shadow-xs md:text-sm',
                            phase === 'typing' ? 'border-ring ring-[3px] ring-ring/50' : 'border-input',
                        )}
                    >
                        {phase === 'typing' ? (
                            <span className="truncate text-foreground">
                                {question.slice(0, typed)}
                                <span className="ml-px inline-block h-[14px] w-px animate-pulse bg-foreground align-middle" />
                            </span>
                        ) : (
                            <span className="truncate text-muted-foreground">{t('placeholder')}</span>
                        )}
                    </div>
                    <span className={cn(buttonVariants({ size: 'icon' }), isLoading && 'opacity-50')}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </span>
                </div>
            </CardContent>
        </Card>
    );

    const sources = (
        <Card className={cn(cardHeight, 'flex flex-col')}>
            <CardHeader className="flex-shrink-0 pb-3">
                <CardTitle className="text-sm">{t('sourcesTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-hidden p-4 pt-0">
                {!showSources ? (
                    <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
                        <Search className="mb-4 h-12 w-12 opacity-30" />
                        <p className="text-sm">{t('noSources')}</p>
                    </div>
                ) : (
                    <div className="space-y-3 p-1">
                        <AnimatePresence>
                            {SOURCES.map((s, i) => {
                                const isWo = s.type === 'work_order';
                                const tone = isWo ? 'var(--info-soft-ink)' : 'var(--success-soft-ink)';
                                return (
                                    <motion.div
                                        key={s.key}
                                        initial={{ opacity: 0, x: 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.35, delay: i * 0.18, ease: EASE }}
                                    >
                                        <Card className="py-0 shadow-sm" style={{ borderColor: 'var(--border-subtle)' }}>
                                            <CardContent className="space-y-2 p-4">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex min-w-0 items-center gap-2">
                                                        {isWo ? (
                                                            <ClipboardList className="h-4 w-4 flex-shrink-0" style={{ color: tone }} />
                                                        ) : (
                                                            <FileText className="h-4 w-4 flex-shrink-0" style={{ color: tone }} />
                                                        )}
                                                        <span className="truncate text-sm font-medium">{td(`${s.key}Title`)}</span>
                                                    </div>
                                                    <div className="flex flex-shrink-0 items-center gap-1">
                                                        <Badge
                                                            variant="outline"
                                                            className="text-[10px]"
                                                            style={
                                                                isWo
                                                                    ? { backgroundColor: 'var(--info-soft)', color: 'var(--info-soft-ink)', borderColor: 'var(--info-soft-ink)' }
                                                                    : { backgroundColor: 'var(--success-soft)', color: 'var(--success-soft-ink)', borderColor: 'var(--success-soft-ink)' }
                                                            }
                                                        >
                                                            {isWo ? t('sourceBadgeWO') : t('sourceBadgeKnowledge')}
                                                        </Badge>
                                                        <ExternalLink className="h-3 w-3 flex-shrink-0" style={{ color: tone }} />
                                                    </div>
                                                </div>
                                                <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">{td(`${s.key}Text`)}</p>
                                                <div className="text-[10px] text-muted-foreground/60">
                                                    {t('similarity')}: {s.similarity}%
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    const header = (
        <motion.header
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="mb-1 flex flex-col gap-2 border-b pb-3"
            style={{ borderColor: 'var(--border-subtle)' }}
        >
            <div className="min-w-0 space-y-0.5">
                <h3 className="truncate text-[1.125rem] font-semibold leading-tight tracking-tight text-ink">{t('title')}</h3>
                <p className="text-[0.8125rem] leading-snug text-ink-muted">{t('subtitle')}</p>
            </div>
        </motion.header>
    );

    if (compact) {
        return (
            <div className="space-y-5 px-4 pt-3">
                {header}
                <div className="w-full">
                    <div className="grid h-9 w-full grid-cols-2 items-center rounded-lg bg-muted p-[3px] text-muted-foreground">
                        {(['chat', 'sources'] as const).map((tab) => (
                            <span
                                key={tab}
                                className={cn(
                                    'flex h-[calc(100%-1px)] items-center justify-center rounded-md px-2 py-1 text-sm font-medium transition-colors',
                                    mobileTab === tab && 'bg-background text-foreground shadow-sm',
                                )}
                            >
                                {tab === 'chat' ? t('tabChat') : t('tabSources')}
                            </span>
                        ))}
                    </div>
                    <div className="mt-4">{mobileTab === 'chat' ? chat : sources}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5 px-8 pb-20 pt-4">
            {header}
            <div className="grid grid-cols-[3fr_2fr] gap-6">
                {chat}
                {sources}
            </div>
        </div>
    );
}
