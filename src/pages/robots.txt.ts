import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { withBase } from '../lib/urls';

export const GET: APIRoute = () => new Response(`User-agent: *\nAllow: /\nSitemap: ${new URL(withBase('/sitemap.xml'), site.url).href}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
