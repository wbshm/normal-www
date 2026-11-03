export const site = {
  name: 'Normal Apps',
  developer: 'Normal Apps',
  email: 'wrq142857@gmail.com',
  url: 'https://wbshm.github.io',
} as const;

export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const contentLocales = [...locales, 'ja'] as const;
export type ContentLocale = (typeof contentLocales)[number];
export const languageInfo = {
  en: { tag: 'en', label: 'EN', read: 'Read this page in English', date: 'en-GB', og: 'en_US' },
  zh: { tag: 'zh-CN', label: '中文', read: '用中文阅读此页', date: 'zh-CN', og: 'zh_CN' },
  ja: { tag: 'ja', label: '日本語', read: 'このページを日本語で読む', date: 'ja-JP', og: 'ja_JP' },
} as const;
export const kinds = ['overview', 'privacy', 'support'] as const;
export type PageKind = (typeof kinds)[number];
