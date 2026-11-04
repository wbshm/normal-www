import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import config from '../astro.config.mjs';

const root = new URL('../dist/', import.meta.url);
const base = config.base?.replace(/\/$/, '');
const origin = config.site;
const siteConfig = await readFile(new URL('../src/data/site.ts', import.meta.url), 'utf8');
const siteName = siteConfig.match(/name:\s*['"]([^'"]+)['"]/)?.[1];
const publicEmail = siteConfig.match(/email:\s*['"]([^'"]+)['"]/)?.[1];
assert(typeof base === 'string' && origin, 'Verification requires explicit site and base configuration.');
assert(publicEmail, 'Verification requires the public support email.');
assert(siteName, 'Verification requires the public site name.');
const files = await readdir(root, { recursive: true });
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const sitemap = await readFile(new URL('sitemap.xml', root), 'utf8');
const policyRoutes = [
  { prefix: '', locale: 'en' },
  { prefix: 'zh/', locale: 'zh-CN' },
  { prefix: 'ja/', locale: 'ja' },
].map(({ prefix, locale }) => ({
  locale,
  file: `${prefix}apps/tilesense/privacy/index.html`,
  path: `${base}/${prefix}apps/tilesense/privacy/`,
}));
let checkedLinks = 0;
const decode = (value) => value.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map((match) => [match[1], decode(match[2])]));

for (const file of htmlFiles) {
  const html = await readFile(new URL(file, root), 'utf8');
  const logicalPath = file === 'index.html' ? '/' : file.endsWith('/index.html') ? `/${file.slice(0, -10)}` : `/${file}`;
  const url = new URL(`${base}${logicalPath}`, origin);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${file}: expected exactly one h1.`);
  assert(!/<script(?:\s|>)/i.test(html), `${file}: these static pages must work without JavaScript.`);
  assert(!/href=""|src=""|Lorem ipsum|TODO|example\.com|\[(?:你的名字|你的邮箱|Your (?:name|email)|あなたの名前|あなたのメールアドレス)\]/.test(html), `${file}: empty or placeholder content.`);
  const expectedLocale = file.startsWith('zh/') ? 'zh-CN' : file.startsWith('ja/') ? 'ja' : 'en';
  assert(html.includes(`<html lang="${expectedLocale}"`), `${file}: document language must be ${expectedLocale}.`);
  assert(/name="description"\s+content="[^"]+"/.test(html), `${file}: description is required.`);
  if (file !== '404.html') {
    assert(html.includes(`rel="canonical" href="${url.href}"`), `${file}: canonical URL mismatch.`);
    assert(sitemap.includes(`<loc>${url.href}</loc>`), `${file}: missing from sitemap.`);
    for (const lang of ['en', 'zh-CN', 'x-default']) {
      assert(html.includes(`hreflang="${lang}"`), `${file}: missing ${lang} alternate.`);
    }
  }
  for (const match of html.matchAll(/<(?:a|link|img)\b[^>]*?\b(?:href|src)="([^"]+)"/g)) {
    const href = decode(match[1]);
    const target = new URL(href, url);
    if (target.origin !== new URL(origin).origin) continue;
    assert(target.pathname.startsWith(`${base}/`), `${file}: link escapes deployment base: ${href}`);
    const relative = decodeURIComponent(target.pathname.slice(base.length + 1));
    const targetFile = target.pathname.endsWith('/') ? `${relative}index.html` : relative;
    await stat(new URL(targetFile, root)).catch(() => assert.fail(`${file}: missing link or asset ${href}`));
    if (target.hash && targetFile.endsWith('.html')) {
      const targetHtml = await readFile(new URL(targetFile, root), 'utf8');
      const id = decodeURIComponent(target.hash.slice(1));
      assert(targetHtml.includes(`id="${id}"`), `${file}: missing anchor ${href}`);
    }
    checkedLinks++;
  }
}

const apps = JSON.parse(await readFile(new URL('../src/data/apps.json', import.meta.url), 'utf8'));
assert.equal(htmlFiles.length, 3 + apps.length * 6 + policyRoutes.length, 'Expected two homepages, six pages per app, three TileSense policies, and a 404 page.');
for (const app of apps) {
  for (const prefix of ['', 'zh/']) {
    for (const kind of ['privacy', 'support']) {
      const content = await readFile(new URL(join(prefix, 'apps', app.slug, kind, 'index.html'), root), 'utf8');
      assert(content.includes(publicEmail), `${app.slug}/${kind}: public contact missing.`);
      if (kind === 'privacy') assert(content.includes('<time datetime='), `${app.slug}: policy effective date missing.`);
    }
  }
}

const policyDates = new Set();
for (const route of policyRoutes) {
  const html = await readFile(new URL(route.file, root), 'utf8');
  const alternates = [...html.matchAll(/<link\b[^>]*>/g)].map((match) => attributes(match[0])).filter((link) => link.rel === 'alternate');
  const expectedAlternates = [...policyRoutes, { locale: 'x-default', path: policyRoutes[0].path }];
  assert.equal(alternates.length, expectedAlternates.length, `${route.file}: expected exactly four language alternates.`);
  for (const alternate of expectedAlternates) {
    assert(alternates.some((link) => link.hreflang === alternate.locale && link.href === new URL(alternate.path, origin).href), `${route.file}: incorrect ${alternate.locale} alternate.`);
  }
  const anchors = [...html.matchAll(/<a\b[^>]*>/g)].map((match) => attributes(match[0]));
  for (const alternate of policyRoutes.filter((target) => target.locale !== route.locale)) {
    assert(anchors.some((link) => link.hreflang === alternate.locale && new URL(link.href, origin).pathname === alternate.path), `${route.file}: missing ${alternate.locale} language switch.`);
  }
  assert.equal((html.match(/<h2(?:\s|>)/g) ?? []).length, 8, `${route.file}: expected eight policy sections.`);
  const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1];
  assert(article?.includes(publicEmail), `${route.file}: policy body must include the public contact email.`);
  const date = html.match(/<time\s+datetime="([^"]+)"/)?.[1];
  assert(date, `${route.file}: policy effective date missing.`);
  policyDates.add(date);
}
assert.deepEqual([...policyDates], ['2026-11-03'], 'TileSense policies must share the agreed effective date.');
for (const prefix of ['', 'zh/']) {
  const home = await readFile(new URL(`${prefix}index.html`, root), 'utf8');
  assert(home.includes(`href="${base}/${prefix}apps/tilesense/privacy/"`), `${prefix || 'en/'} homepage: TileSense policy entry missing.`);
}

if (process.env.SITE_ORIGIN) {
  const publicOrigin = new URL(process.env.SITE_ORIGIN);
  const checkPaths = [...htmlFiles.filter((file) => file !== '404.html').map((file) => file === 'index.html' ? '/' : `/${file.slice(0, -10)}`), '/sitemap.xml', '/robots.txt'];
  for (const path of checkPaths) {
    const url = new URL(`${base}${path}`, publicOrigin);
    const response = await fetch(url);
    assert(response.ok, `${url.href}: HTTP ${response.status}`);
    const content = await response.text();
    if (!path.endsWith('.xml') && !path.endsWith('.txt')) {
      assert(content.includes(siteName), `${url.href}: unexpected deployment content.`);
      assert(!/<script(?:\s|>)/i.test(content), `${url.href}: unexpected script in published page.`);
    }
    console.log(`HTTP ${response.status} ${url.href}`);
  }
}
console.log(`Verified ${htmlFiles.length} HTML pages, ${checkedLinks} local links/assets, canonical URLs, language alternates, policy contacts, dates, and sitemap. No client JavaScript required.`);
