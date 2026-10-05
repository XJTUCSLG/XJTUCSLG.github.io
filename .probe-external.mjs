// 探针：复现 astro sync 时 vite 对 picomatch 的 externalize 决策。
// 目的：确定是哪个配置项（ssr.external / resolve.noExternal / command）决定 picomatch 被内联。
// 只做观测，不修改任何仓库文件。
import { createServer } from 'vite';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const root = process.cwd();
const importer = pathToFileURL(resolve(root, 'node_modules/astro/dist/content/loaders/glob.js')).href;

async function probe(label, extra) {
  const server = await createServer({
    root,
    configFile: false,
    server: { middlewareMode: true, hmr: false, watch: null, ws: false },
    optimizeDeps: { noDiscovery: true },
    logLevel: 'silent',
    ...extra,
  });
  try {
    for (const envName of ['ssr', 'client']) {
      const env = server.environments[envName];
      if (!env) continue;
      const resolveResult = await env.pluginContainer.resolveId('picomatch', importer);
      const r = env.config.resolve;
      console.log(
        `${label} [${envName}] resolveId.external=${String(resolveResult?.external)} id=${resolveResult?.id}`,
      );
      console.log(
        `${label} [${envName}] cfg.noExternal=${JSON.stringify(r.noExternal)} cfg.external=${JSON.stringify(r.external)}`,
      );
    }
  } finally {
    await server.close();
  }
}

await probe('A sync-like(cmd=build,ssr.external=[])', {
  command: 'build',
  ssr: { external: [] },
});
await probe('B dev-like(cmd=serve,ssr.external=[])', {
  command: 'serve',
  ssr: { external: [] },
});
await probe('C sync-like + astro noExternal list', {
  command: 'build',
  ssr: { external: [] },
  environments: {
    ssr: {
      resolve: {
        noExternal: ['astro', 'astro/components', '@nanostores/preact', '@fontsource/*', 'neotraverse'],
        external: [],
      },
    },
  },
});
await probe('D sync-like + ssr.external=[picomatch]', {
  command: 'build',
  ssr: { external: ['picomatch'] },
});
await probe('E sync-like + ssr.noExternal=[]', {
  command: 'build',
  ssr: { external: [], noExternal: [] },
});
