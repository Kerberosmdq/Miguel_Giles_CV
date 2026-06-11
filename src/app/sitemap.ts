import type { MetadataRoute } from 'next';

const BASE = 'https://miguelgiles.dev';
const lastModified = new Date('2026-06-01');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE}/es`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages: { es: `${BASE}/es`, en: `${BASE}/en` } },
    },
    {
      url: `${BASE}/en`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: { languages: { es: `${BASE}/es`, en: `${BASE}/en` } },
    },
    {
      url: `${BASE}/es/cv`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages: { es: `${BASE}/es/cv`, en: `${BASE}/en/cv` } },
    },
    {
      url: `${BASE}/en/cv`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages: { es: `${BASE}/es/cv`, en: `${BASE}/en/cv` } },
    },
  ];
}
