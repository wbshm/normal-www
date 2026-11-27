import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
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
const languageTags = { en: 'en', zh: 'zh-CN', de: 'de', ja: 'ja' };
const prefixFor = (locale) => locale === 'en' ? '' : `${locale}/`;
const appPageKinds = ['overview', 'privacy', 'support'];
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

function verifyScripts(html, label) {
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  const hasGallery = html.includes('data-screenshot-gallery');
  const hasPlanner = html.includes('data-bridge-planner');
  const executable = [];
  for (const script of scripts) {
    const attrs = attributes(script[1]);
    if (attrs.type === 'application/ld+json') {
      assert(hasPlanner, `${label}: JSON-LD scripts are only expected on bridge-day pages.`);
      assert(!attrs.src, `${label}: JSON-LD script must not load an external src.`);
      assert.doesNotThrow(() => JSON.parse(script[2]), `${label}: invalid JSON-LD payload.`);
      continue;
    }
    executable.push({ attrs, body: script[2] });
  }
  const expectedCount = (hasGallery ? 1 : 0) + (hasPlanner ? 1 : 0);
  assert.equal(executable.length, expectedCount, `${label}: unexpected number of client scripts.`);
  const allowedSources = new Set([
    ...(hasGallery ? [`${base}/scripts/screenshot-lightbox.js`] : []),
    ...(hasPlanner ? [`${base}/scripts/brueckentage-planner.js`] : []),
  ]);
  for (const { attrs, body } of executable) {
    assert.equal(attrs.type, 'module', `${label}: client scripts must use type="module".`);
    assert(allowedSources.has(attrs.src), `${label}: unexpected client script ${attrs.src}.`);
    assert.equal(body.trim(), '', `${label}: unexpected inline script.`);
  }
}

function verifyAlternates(html, file, routes) {
  const alternates = [...html.matchAll(/<link\b[^>]*>/g)].map((match) => attributes(match[0])).filter((link) => link.rel === 'alternate');
  const expected = [...routes, { locale: 'x-default', path: routes.find((route) => route.locale === 'en').path }];
  assert.equal(alternates.length, expected.length, `${file}: incorrect number of language alternates.`);
  for (const target of expected) {
    assert(alternates.some((link) => link.hreflang === target.locale && link.href === new URL(target.path, origin).href), `${file}: incorrect ${target.locale} alternate.`);
  }
  const anchors = [...html.matchAll(/<a\b[^>]*>/g)].map((match) => attributes(match[0]));
  for (const target of routes.filter((route) => route.file !== file)) {
    assert(anchors.some((link) => link.hreflang === target.locale && new URL(link.href, origin).pathname === target.path), `${file}: missing ${target.locale} language switch.`);
  }
}

for (const file of htmlFiles) {
  const html = await readFile(new URL(file, root), 'utf8');
  const logicalPath = file === 'index.html' ? '/' : file.endsWith('/index.html') ? `/${file.slice(0, -10)}` : `/${file}`;
  const url = new URL(`${base}${logicalPath}`, origin);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${file}: expected exactly one h1.`);
  verifyScripts(html, file);
  assert(!/href=""|src=""|Lorem ipsum|TODO|example\.com|\[(?:你的名字|你的邮箱|Your (?:name|email)|あなたの名前|あなたのメールアドレス)\]/.test(html), `${file}: empty or placeholder content.`);
  const expectedLocale = languageTags[file.split('/')[0]] ?? languageTags.en;
  assert(html.includes(`<html lang="${expectedLocale}"`), `${file}: document language must be ${expectedLocale}.`);
  assert(/name="description"\s+content="[^"]+"/.test(html), `${file}: description is required.`);
  const isBridgePage = html.includes('data-bridge-planner');
  if (file !== '404.html') {
    assert(html.includes(`rel="canonical" href="${url.href}"`), `${file}: canonical URL mismatch.`);
    assert(sitemap.includes(`<loc>${url.href}</loc>`), `${file}: missing from sitemap.`);
    const requiredLangs = isBridgePage ? ['de', 'en', 'x-default'] : ['en', 'zh-CN', 'x-default'];
    for (const lang of requiredLangs) {
      assert(html.includes(`hreflang="${lang}"`), `${file}: missing ${lang} alternate.`);
    }
  }
  for (const match of html.matchAll(/<(?:a|link|img|script)\b[^>]*?\b(?:href|src)="([^"]+)"/g)) {
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
const bridgeYears = [2027, 2028];
const bridgeStates = [
  { de: 'baden-wuerttemberg', en: 'baden-wuerttemberg' },
  { de: 'bayern', en: 'bavaria' },
  { de: 'berlin', en: 'berlin' },
  { de: 'brandenburg', en: 'brandenburg' },
  { de: 'bremen', en: 'bremen' },
  { de: 'hamburg', en: 'hamburg' },
  { de: 'hessen', en: 'hesse' },
  { de: 'mecklenburg-vorpommern', en: 'mecklenburg-western-pomerania' },
  { de: 'niedersachsen', en: 'lower-saxony' },
  { de: 'nordrhein-westfalen', en: 'north-rhine-westphalia' },
  { de: 'rheinland-pfalz', en: 'rhineland-palatinate' },
  { de: 'saarland', en: 'saarland' },
  { de: 'sachsen', en: 'saxony' },
  { de: 'sachsen-anhalt', en: 'saxony-anhalt' },
  { de: 'schleswig-holstein', en: 'schleswig-holstein' },
  { de: 'thueringen', en: 'thuringia' },
];
const bridgePairs = bridgeYears.flatMap((year) => [
  [
    { locale: 'de', file: `de/apps/dayweave/brueckentage-${year}/index.html`, path: `${base}/de/apps/dayweave/brueckentage-${year}/` },
    { locale: 'en', file: `apps/dayweave/bridge-days-${year}/index.html`, path: `${base}/apps/dayweave/bridge-days-${year}/` },
  ],
  ...bridgeStates.map((st) => [
    { locale: 'de', file: `de/apps/dayweave/brueckentage-${year}/${st.de}/index.html`, path: `${base}/de/apps/dayweave/brueckentage-${year}/${st.de}/` },
    { locale: 'en', file: `apps/dayweave/bridge-days-${year}/${st.en}/index.html`, path: `${base}/apps/dayweave/bridge-days-${year}/${st.en}/` },
  ]),
]);
const additionalPolicies = policyRoutes.filter((route) => route.locale !== 'en' && route.locale !== 'zh-CN');
const appPageCount = apps.reduce((count, app) => count + Object.keys(app.locales).length * appPageKinds.length, 0);
const bridgePageCount = bridgePairs.length * 2;
assert.equal(htmlFiles.length, 3 + appPageCount + additionalPolicies.length + bridgePageCount, 'Expected two homepages, three pages per app language, the extra policies, Dayweave bridge-day pages, and a 404 page.');
for (const pair of bridgePairs) {
  for (const route of pair) {
    const html = await readFile(new URL(route.file, root), 'utf8');
    verifyAlternates(html, route.file, pair);
    assert(html.includes('name="apple-itunes-app" content="app-id=6836203431"'), `${route.file}: missing Smart App Banner meta tag.`);
    assert(html.includes('id6836203431'), `${route.file}: missing Dayweave App Store link.`);
  }
}
for (const app of apps) {
  const appLocales = Object.keys(app.locales);
  for (const [locale, translation] of Object.entries(app.locales)) {
    const prefix = prefixFor(locale);
    const productFile = `${prefix}apps/${app.slug}/index.html`;
    const product = await readFile(new URL(productFile, root), 'utf8');
    const home = locale === 'en' || locale === 'zh' ? await readFile(new URL(`${prefix}index.html`, root), 'utf8') : undefined;
    assert.equal((product.match(/<figure>/g) ?? []).length, app.screenshots.length, `${app.slug}: screenshot count mismatch.`);
    assert(!product.includes('screenshots-hint'), `${app.slug}/${locale}: redundant screenshot instructions must not be rendered.`);
    assert.equal((product.match(/class="screenshot-note"/g) ?? []).length, translation.screenshotNote ? 1 : 0, `${app.slug}/${locale}: only app-specific screenshot notices should be rendered.`);
    assert(!home?.includes('class="preview-note"'), `${locale}: homepage screenshots must not repeat the app tagline.`);
    for (const [index, shot] of app.screenshots.entries()) {
      const source = typeof shot.src === 'string' ? shot.src : shot.src[locale] ?? shot.src.en;
      assert(product.includes(`src="${base}${source}"`), `${app.slug}/${locale}: localized screenshot missing: ${source}`);
      assert(product.includes(`href="${base}${source}"`), `${app.slug}/${locale}: full-size screenshot link missing: ${source}`);
      if (home && index < 2 && app.status !== 'archived') assert(home.includes(`src="${base}${source}"`), `${app.slug}/${locale}: homepage screenshot missing.`);
      if (typeof shot.src !== 'string') {
        for (const otherSource of Object.values(shot.src)) {
          if (otherSource !== source) assert(!product.includes(`src="${base}${otherSource}"`), `${app.slug}/${locale}: screenshot from the wrong language.`);
        }
      }
    }
    for (const kind of appPageKinds) {
      const suffix = kind === 'overview' ? '' : `${kind}/`;
      const file = `${prefix}apps/${app.slug}/${suffix}index.html`;
      const content = kind === 'overview' ? product : await readFile(new URL(file, root), 'utf8');
      const routes = appLocales.map((language) => {
        const path = `${prefixFor(language)}apps/${app.slug}/${suffix}`;
        return { locale: languageTags[language], path: `${base}/${path}`, file: `${path}index.html` };
      });
      if (app.slug !== 'tilesense' || kind !== 'privacy') verifyAlternates(content, file, routes);
      if (kind === 'overview') continue;
      assert(content.includes(publicEmail), `${app.slug}/${kind}: public contact missing.`);
      if (kind === 'privacy') assert(content.includes('<time datetime='), `${app.slug}: policy effective date missing.`);
      if (app.slug === 'mapleoath' && kind === 'privacy') {
        assert(content.includes('<time datetime="2026-11-15"'), 'MapleOath policies must preserve the supplied update date.');
        assert.equal((content.match(/<h2(?:\s|>)/g) ?? []).length, 7, 'MapleOath policy must preserve all seven supplied sections.');
        const article = content.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1];
        assert(article?.includes(`mailto:${publicEmail}`), 'MapleOath policy body must include the support email.');
        assert(!/to be added|发布前补上/.test(content), 'MapleOath policy must not contain the draft contact placeholder.');
      }
    }
  }
}

const policyDates = new Set();
for (const route of policyRoutes) {
  const html = await readFile(new URL(route.file, root), 'utf8');
  verifyAlternates(html, route.file, policyRoutes);
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
  assert(!home.includes(publicEmail) && !home.includes('mailto:'), `${prefix || 'en/'} homepage: omit direct contact information.`);
  const footer = home.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/)?.[1];
  assert(footer?.includes('href="https://beian.miit.gov.cn/"') && footer.includes('闽ICP备2025110219号-2'), `${prefix || 'en/'} homepage: required ICP filing link missing.`);
  assert(home.includes(`href="${base}/${prefix}apps/tilesense/privacy/"`), `${prefix || 'en/'} homepage: TileSense policy entry missing.`);
  const standaloneCards = [...home.matchAll(/<article class="policy-card">([\s\S]*?)<\/article>/g)];
  assert(!standaloneCards.some((match) => match[1].includes('/apps/tilesense/')), `${prefix || 'en/'} homepage: TileSense must use the shared app card instead of a standalone policy card.`);
  for (const app of apps.filter((app) => app.status !== 'archived')) {
    assert.equal([...home.matchAll(/<article\b[^>]*\bdata-app="([^"]+)"/g)].filter((match) => match[1] === app.slug).length, 1, `${prefix || 'en/'} homepage: ${app.slug} needs exactly one shared app card.`);
    assert(home.includes(`href="${base}/${prefix}apps/${app.slug}/"`), `${app.slug}: homepage product link missing.`);
  }
  const product = await readFile(new URL(`${prefix}apps/tilesense/index.html`, root), 'utf8');
  assert(product.includes('class="product-hero"') && product.includes('class="product-story prose"'), 'TileSense must use the shared product introduction layout.');
  assert.equal((product.match(/<figure>/g) ?? []).length, apps.find((app) => app.slug === 'tilesense').screenshots.length, 'TileSense must show its actual screenshots.');
  assert(product.includes(`href="${base}/${prefix}apps/tilesense/support/"`), 'TileSense product page: support link missing.');
}
const japanesePolicy = await readFile(new URL('ja/apps/tilesense/privacy/index.html', root), 'utf8');
assert(japanesePolicy.includes(`href="${base}/apps/tilesense/"`), 'Japanese policy must link back to the existing English product page.');

if (process.env.SITE_ORIGIN) {
  const publicOrigin = new URL(process.env.SITE_ORIGIN);
  const checkPaths = [...htmlFiles.filter((file) => file !== '404.html').map((file) => file === 'index.html' ? '/' : `/${file.slice(0, -10)}`), '/sitemap.xml', '/robots.txt'];
  for (const path of checkPaths) {
    const url = new URL(`${base}${path}`, publicOrigin);
    const response = await fetch(url);
    assert(response.ok, `${url.href}: HTTP ${response.status}`);
    const content = await response.text();
    if (!path.endsWith('.xml') && !path.endsWith('.txt')) {
      const localHtml = await readFile(new URL(`${path.slice(1)}index.html`, root), 'utf8');
      const expectedTitle = localHtml.match(/<title>[^<]+<\/title>/)?.[0];
      assert(expectedTitle && content.includes(expectedTitle), `${url.href}: unexpected deployment page title.`);
      verifyScripts(content, url.href);
    }
    console.log(`HTTP ${response.status} ${url.href}`);
  }
}
console.log(`Verified ${htmlFiles.length} HTML pages, ${checkedLinks} local links/assets, canonical URLs, language alternates, policy contacts, dates, bridge-day pages, and sitemap.`);
