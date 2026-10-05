// 探针：不经过 astro，直接用 vite 的 dev SSR（module runner）加载一个 import CJS 依赖的 ESM 文件。
// 第二轮：区分「vite 8 默认行为」与「astro 的 noDiscovery 设置」谁导致 CJS 被内联。
import { createServer } from 'vite';

const root = process.cwd();
const ENTRY = '/.repro-cjs-import.mjs';

async function run(label, extra) {
  const server = await createServer({
    root,
    configFile: false,
    server: { middlewareMode: true, hmr: false, watch: null, ws: false },
    logLevel: 'silent',
    ...extra,
  });
  try {
    const mod = await server.ssrLoadModule(ENTRY);
    console.log(`${label}: OK isMatch=${mod.isMatch}`);
  } catch (error) {
    console.log(`${label}: FAIL ${error.constructor.name}: ${error.message.split('\n')[0]}`);
  } finally {
    await server.close();
  }
}

// 10：完全默认（不设 optimizeDeps），看 vite 8 是否自动预打包 CJS 依赖
await run('10 vite 全默认', {});
// 11：只关发现（astro sync 的临时服务器就是这样）
await run('11 optimizeDeps.noDiscovery=true', { optimizeDeps: { noDiscovery: true } });
// 12：astro 形态 + ssr.optimizeDeps.include
await run('12 astro 形态 + ssr.optimizeDeps.include', {
  optimizeDeps: { noDiscovery: true },
  ssr: { external: [], optimizeDeps: { include: ['picomatch'] } },
});
// 13：只给 ssr 环境开发现（不禁用）
await run('13 ssr.optimizeDeps 自动发现', {
  ssr: { optimizeDeps: { include: ['picomatch'] } },
});
