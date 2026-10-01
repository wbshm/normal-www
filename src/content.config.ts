import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/apps' }),
  schema: z.object({
    app: z.string(),
    locale: z.enum(['en', 'zh']),
    kind: z.enum(['overview', 'privacy', 'support']),
    title: z.string().min(1),
    description: z.string().min(1),
    updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  }),
});

export const collections = { pages };
