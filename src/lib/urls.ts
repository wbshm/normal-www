import type { Locale, PageKind } from '../data/site';

export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

export function pagePath(locale: Locale, slug?: string, kind: PageKind = 'overview'): string {
  const prefix = locale === 'zh' ? '/zh' : '';
  if (!slug) return `${prefix}/`;
  return `${prefix}/apps/${slug}/${kind === 'overview' ? '' : `${kind}/`}`;
}

export function pageUrl(locale: Locale, slug?: string, kind: PageKind = 'overview'): string {
  return withBase(pagePath(locale, slug, kind));
}
