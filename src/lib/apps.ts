import { z } from 'astro/zod';
import rawApps from '../data/apps.json';

const translation = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  highlights: z.array(z.string().min(1)).min(1),
  screenshotNote: z.string().optional(),
});
const localAsset = z.string().regex(/^\/images\/[^?#]+$/, 'Use a local /images/ asset path');
const appSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.enum(['game', 'tool']),
  status: z.enum(['coming-soon', 'available', 'archived']),
  icon: localAsset,
  screenshots: z.array(z.object({ src: localAsset, en: z.string(), zh: z.string() })),
  appStoreUrl: z.url().startsWith('https://apps.apple.com/'),
  platform: z.string().min(1),
  requirement: z.string().min(1),
  accent: z.string().regex(/^#[a-fA-F0-9]{6}$/),
  locales: z.object({ en: translation, zh: translation }),
});

export const apps = z.array(appSchema).parse(rawApps);
if (new Set(apps.map((app) => app.slug)).size !== apps.length) {
  throw new Error('App slugs must be unique permanent identifiers.');
}
export type App = (typeof apps)[number];
