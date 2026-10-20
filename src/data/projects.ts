import { NEXINDU_URL } from '@/lib/site';

export type MainProject = {
  id: 'nexindu' | 'nexkio' | 'nexquipu';
  name: string;
  /** null = sin URL pública confirmada */
  url: string | null;
  stack: string[];
};

export type OtherProject = {
  id: 'nexpulse' | 'nexplay';
  name: string;
  url: string | null;
  repo: string;
};

// TODO(dato D2): URL pública de NexKio y NexQuipu
export const mainProjects: MainProject[] = [
  {
    id: 'nexindu',
    name: 'NexIndu',
    url: NEXINDU_URL,
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Gemini API', 'Playwright', 'GitHub Actions'],
  },
  {
    id: 'nexkio',
    name: 'NexKio',
    url: null,
    stack: ['Next.js', 'TypeScript', 'Supabase', 'PWA', 'Playwright'],
  },
  {
    id: 'nexquipu',
    name: 'NexQuipu',
    url: null,
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Vitest', 'Playwright'],
  },
];

// TODO(dato): URLs públicas de NexPulse y NexPlay
export const otherProjects: OtherProject[] = [
  { id: 'nexpulse', name: 'NexPulse', url: null, repo: 'https://github.com/Kerberosmdq/PokerPulse' },
  { id: 'nexplay', name: 'NexPlay', url: null, repo: 'https://github.com/Kerberosmdq/NexPlay' },
];
