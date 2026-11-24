import type { ContentLocale } from './site';

export interface PolicyApp {
  readonly slug: string;
  readonly names: Readonly<Partial<Record<ContentLocale, string>>>;
}

// Policy translations, including extra languages for apps with product pages.
export const policyApps: readonly PolicyApp[] = [
  { slug: 'tilesense', names: { en: 'TileSense', zh: '牌感', ja: '牌感' } },
];

export function policyLocales(app: PolicyApp): ContentLocale[] {
  return Object.keys(app.names) as ContentLocale[];
}
