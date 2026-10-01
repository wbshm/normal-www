export const site = {
  name: 'Normal Apps',
  developer: 'Normal Apps',
  email: 'wrq142857@gmail.com',
  url: 'https://wbshm.github.io',
} as const;

export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const kinds = ['overview', 'privacy', 'support'] as const;
export type PageKind = (typeof kinds)[number];
