import { site } from '../data/site';
import { pageUrl, withBase } from './urls';
import {
  brueckentageOverviewPath,
  brueckentageStatePath,
  DAYWEAVE_APP_STORE_ID,
  DAYWEAVE_APP_STORE_URL,
  getBridgeOpportunities,
  getStateYearSummary,
  type BrueckentageLocale,
  type GermanStateInfo,
  type SupportedYear,
} from './brueckentage';
import { buildOverviewFaqs, buildStateFaqs, uiCopy } from './brueckentage-copy';

export function buildBrueckentageLayoutProps(
  locale: BrueckentageLocale,
  year: SupportedYear,
  state?: GermanStateInfo,
) {
  const t = uiCopy[locale];
  const canonicalPath = state
    ? brueckentageStatePath(locale, year, state)
    : brueckentageOverviewPath(locale, year);

  const alternateLinks = (['de', 'en'] as const).map((lang) => ({
    locale: lang,
    href: state ? brueckentageStatePath(lang, year, state) : brueckentageOverviewPath(lang, year),
  }));

  const stateSummary = state ? getStateYearSummary(year, state.code) : undefined;
  const faqs = stateSummary
    ? buildStateFaqs(locale, stateSummary)
    : buildOverviewFaqs(locale, year, getBridgeOpportunities(year, 'ALL'));

  const title = state
    ? t.titleState(year, state.name[locale])
    : t.titleOverview(year);

  const description = stateSummary
    ? t.descState(year, stateSummary.state.name[locale], stateSummary.recommendedPlan.leaveDays, stateSummary.recommendedPlan.freeDays)
    : t.descOverview[year];

  const appUrl = new URL(pageUrl(locale, 'dayweave', 'overview'), site.url).href;
  const overviewUrl = new URL(withBase(brueckentageOverviewPath(locale, year)), site.url).href;
  const pageCanonicalUrl = new URL(withBase(canonicalPath), site.url).href;

  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Dayweave', item: appUrl },
    { '@type': 'ListItem', position: 2, name: t.overviewCrumb(year), item: overviewUrl },
    ...(state
      ? [{ '@type': 'ListItem', position: 3, name: state.name[locale], item: pageCanonicalUrl }]
      : []),
  ];

  const structuredData: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Dayweave',
      operatingSystem: 'iOS 17+',
      applicationCategory: 'ProductivityApplication',
      url: appUrl,
      downloadUrl: DAYWEAVE_APP_STORE_URL[locale],
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
      },
    },
  ];

  return {
    locale,
    title,
    description,
    slug: 'dayweave',
    image: '/images/dayweave/icon.png',
    canonicalPath,
    alternateLinks,
    appStoreId: DAYWEAVE_APP_STORE_ID,
    structuredData,
    appBrand: {
      name: 'Dayweave',
      href: pageUrl(locale, 'dayweave', 'overview'),
      icon: '/images/dayweave/icon.png',
    },
  };
}
