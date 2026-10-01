import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('../dist/', import.meta.url);
const config = await readFile(new URL('../astro.config.mjs', import.meta.url), 'utf8');
const base = config.match(/base:\s*['"]([^'"]+)['"]/)?.[1]?.replace(/\/$/, '');
const origin = config.match(/site:\s*['"]([^'"]+)['"]/)?.[1];
const siteConfig = await readFile(new URL('../src/data/site.ts', import.meta.url), 'utf8');
const publicEmail = siteConfig.match(/email:\s*['"]([^'"]+)['"]/)?.[1];
assert(base && origin, 'Verification requires explicit site and base configuration.');
assert(publicEmail, 'Verification requires the public support email.');
const files = await readdir(root, { recursive: true });
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const sitemap = await readFile(new URL('sitemap.xml', root), 'utf8');
let checkedLinks = 0;
const decode = (value) => value.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');

for (const file of htmlFiles) {
  const html = await readFile(new URL(file, root), 'utf8');
  const logicalPath = file === 'index.html' ? '/' : file.endsWith('/index.html') ? `/${file.slice(0, -10)}` : `/${file}`;
  const url = new URL(`${base}${logicalPath}`, origin);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${file}: expected exactly one h1.`);
  assert(!/<script(?:\s|>)/i.test(html), `${file}: these static pages must work without JavaScript.`);
  assert(!/href=""|src=""|Lorem ipsum|TODO|example\.com/.test(html), `${file}: empty or placeholder content.`);
  assert(/<html\s+lang="(?:en|zh-CN)"/.test(html), `${file}: document language is required.`);
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
assert.equal(htmlFiles.length, 3 + apps.length * 6, 'Expected two homepages, six pages per app, and a 404 page.');
for (const app of apps) {
  for (const prefix of ['', 'zh/']) {
    for (const kind of ['privacy', 'support']) {
      const content = await readFile(new URL(join(prefix, 'apps', app.slug, kind, 'index.html'), root), 'utf8');
      assert(content.includes(publicEmail), `${app.slug}/${kind}: public contact missing.`);
      if (kind === 'privacy') assert(content.includes('<time datetime='), `${app.slug}: policy effective date missing.`);
    }
  }
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
      assert(content.includes('Normal Apps'), `${url.href}: unexpected deployment content.`);
      assert(!/<script(?:\s|>)/i.test(content), `${url.href}: unexpected script in published page.`);
    }
    console.log(`HTTP ${response.status} ${url.href}`);
  }
}
console.log(`Verified ${htmlFiles.length} HTML pages, ${checkedLinks} local links/assets, canonical URLs, language alternates, policy contacts, dates, and sitemap. No client JavaScript required.`);
