import type { APIRoute } from 'astro';
import { apps } from '../lib/apps';
import { site, locales, kinds } from '../data/site';
import { pageUrl } from '../lib/urls';

export const GET: APIRoute = () => {
  const paths = locales.flatMap((locale) => [pageUrl(locale), ...apps.flatMap((app) => kinds.map((kind) => pageUrl(locale, app.slug, kind)))]);
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${new URL(path, site.url).href}</loc></url>`).join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
