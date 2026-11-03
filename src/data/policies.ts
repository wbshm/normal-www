import type { ContentLocale } from './site';

// Apps with published privacy policies but no product or support pages yet.
export const policyApps = [
  { slug: 'tilesense', names: { en: 'TileSense', zh: '牌感', ja: '牌感' } },
] as const satisfies readonly { slug: string; names: Partial<Record<ContentLocale, string>> }[];

export type PolicyApp = (typeof policyApps)[number];
export function policyLocales(app: PolicyApp): ContentLocale[] {
  return Object.keys(app.names) as ContentLocale[];
}
