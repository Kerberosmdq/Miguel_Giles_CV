export type MainProject = {
  id: 'nexkio' | 'nexquipu';
  name: string;
};

export type OtherProject = {
  id: 'nexpulse' | 'nexplay';
  name: string;
  url: string;
  repo: string;
};

// NexKio y NexQuipu no tienen URL pública: no inventar ninguna.
export const mainProjects: MainProject[] = [
  { id: 'nexkio', name: 'NexKio' },
  { id: 'nexquipu', name: 'NexQuipu' },
];

export const otherProjects: OtherProject[] = [
  {
    id: 'nexpulse',
    name: 'NexPulse',
    url: 'https://pokerpulse.vercel.app',
    repo: 'https://github.com/Kerberosmdq/PokerPulse',
  },
  {
    id: 'nexplay',
    name: 'NexPlay',
    url: 'https://nex-play-one.vercel.app',
    repo: 'https://github.com/Kerberosmdq/NexPlay',
  },
];
