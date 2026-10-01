import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://wbshm.github.io',
  base: '/normal-www',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
