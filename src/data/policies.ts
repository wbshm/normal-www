import type { ContentLocale } from './site';

// Policy translations, including extra languages for apps with product pages.
export const policyApps = [
  { slug: 'tilesense', names: { en: 'TileSense', zh: '牌感', ja: '牌感' } },
] as const satisfies readonly { slug: string; names: Partial<Record<ContentLocale, string>> }[];

export type PolicyApp = (typeof policyApps)[number];
export function policyLocales(app: PolicyApp): ContentLocale[] {
  return Object.keys(app.names) as ContentLocale[];
}
