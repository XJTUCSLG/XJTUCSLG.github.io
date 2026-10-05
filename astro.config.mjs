// @ts-check
import { defineConfig } from 'astro/config';
import { inkTheme } from './src/lib/shiki-theme.mjs';

// 部署在 https://xjtucslg.github.io（组织主页仓库，无子路径）。
// Astro v7 起 compressHTML 默认是 'jsx'，会按 JSX 规则吃掉行内元素之间的空格；
// 以中文长文为主，这里设回 true，保留 HTML 语义下的空格处理。
export default defineConfig({
  site: 'https://xjtucslg.github.io',
  compressHTML: true,

  markdown: {
    // 代码块用站点自己的主题染色，见 src/lib/shiki-theme.mjs
    shikiConfig: {
      theme: inkTheme,
    },
  },
});
