import { z } from 'astro/zod';
import rawApps from '../data/apps.json';
import { productLocales, type ProductLocale } from '../data/site';

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
  screenshots: z.array(z.object({
    src: z.union([localAsset, z.object({ en: localAsset, zh: localAsset.optional(), de: localAsset.optional() })]),
    en: z.string(),
    zh: z.string(),
    de: z.string().optional(),
    width: z.number().int().positive().default(780),
    height: z.number().int().positive().default(1688),
  })),
  screenshotStyle: z.enum(['screen', 'poster']).default('screen'),
  appStoreUrl: z.url().startsWith('https://apps.apple.com/').optional(),
  platform: z.string().min(1),
  requirement: z.string().min(1),
  accent: z.string().regex(/^#[a-fA-F0-9]{6}$/),
  locales: z.object({ en: translation, zh: translation, de: translation.optional() }),
}).refine((app) => app.status !== 'available' || Boolean(app.appStoreUrl), {
  message: 'Available apps require a verified App Store URL.',
  path: ['appStoreUrl'],
});

export const apps = z.array(appSchema).parse(rawApps);
if (new Set(apps.map((app) => app.slug)).size !== apps.length) {
  throw new Error('App slugs must be unique permanent identifiers.');
}
export type App = (typeof apps)[number];

export function appLocales(app: App): ProductLocale[] {
  return productLocales.filter((locale) => app.locales[locale]);
}

export function screenshotSource(shot: App['screenshots'][number], locale: ProductLocale): string {
  return typeof shot.src === 'string' ? shot.src : shot.src[locale] ?? shot.src.en;
}
