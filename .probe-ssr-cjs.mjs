// 探针：不经过 astro，直接用 vite 的 dev SSR（module runner）加载一个 import CJS 依赖的 ESM 文件。
// 目的：确定 vite 8.3.0 的 dev SSR 何时内联 node_modules 里的 CJS 包、何时外部化。
// 逐项改变一个变量（ssr.external / noExternal / environments.ssr.resolve）。
import { createServer } from 'vite';

const root = process.cwd();
const ENTRY = '/.repro-cjs-import.mjs';

async function run(label, extra) {
  const server = await createServer({
    root,
    configFile: false,
    server: { middlewareMode: true, hmr: false, watch: null, ws: false },
    optimizeDeps: { noDiscovery: true },
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

await run('01 default');
await run('02 ssr.external=[picomatch]', { ssr: { external: ['picomatch'] } });
await run('03 ssr.external=true', { ssr: { external: true } });
await run('04 ssr.noExternal=[picomatch]', { ssr: { noExternal: ['picomatch'] } });
await run('05 environments.ssr.resolve.external', {
  environments: { ssr: { resolve: { external: ['picomatch'] } } },
});
await run('06 environments.ssr.resolve.noExternal=[]', {
  environments: { ssr: { resolve: { noExternal: [] } } },
});
await run('07 ssr.external=[] (astro sync 用的形态)', { ssr: { external: [] } });
await run('08 optimizeDeps.include=[picomatch]', {
  optimizeDeps: { noDiscovery: true, include: ['picomatch'] },
});
await run('09 ssr.optimizeDeps.include=[picomatch]', {
  ssr: { optimizeDeps: { include: ['picomatch'] } },
});
