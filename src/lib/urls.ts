import type { ContentLocale, PageKind } from '../data/site';

export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

export function pagePath(locale: ContentLocale, slug?: string, kind: PageKind = 'overview'): string {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  if (!slug) return `${prefix}/`;
  return `${prefix}/apps/${slug}/${kind === 'overview' ? '' : `${kind}/`}`;
}

export function pageUrl(locale: ContentLocale, slug?: string, kind: PageKind = 'overview'): string {
  return withBase(pagePath(locale, slug, kind));
}
