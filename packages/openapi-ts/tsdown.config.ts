import fs from 'node:fs';
import path from 'node:path';

import { defineConfig } from 'tsdown';

import { clientPlugins, getClientBundleDir, replaceCoreImports } from './tsdown-utils.ts';

const clientDependencies = {
  neverBundle: [
    '@angular/common/http',
    '@angular/core',
    'axios',
    'ky',
    'nuxt/app',
    'ofetch',
    'rxjs',
    'vue',
  ],
};

export default defineConfig([
  {
    attw: {
      ignoreRules: ['cjs-resolves-to-esm'],
      profile: 'esm-only',
    },
    deps: clientDependencies,
    entry: ['./src/{index,internal,plugins,run}.ts'],
    onSuccess: async () => {
      // Copy client files to dist folder for runtime access
      for (const pluginName of clientPlugins) {
        const srcPath = getClientBundleDir(pluginName);
        const destPath = path.resolve(
          import.meta.dirname,
          'dist',
          'clients',
          pluginName.slice('client-'.length),
        );

        if (fs.existsSync(srcPath)) {
          fs.mkdirSync(path.dirname(destPath), { recursive: true });
          fs.cpSync(srcPath, destPath, { recursive: true });

          // replace core imports in client bundle
          const clientFiles = fs.readdirSync(destPath);
          for (const file of clientFiles) {
            const filePath = path.resolve(destPath, file);
            let content = fs.readFileSync(filePath, 'utf8');
            content = replaceCoreImports(content);
            fs.writeFileSync(filePath, content, 'utf8');
          }
        }
      }
    },
    publint: true,
    sourcemap: true,
  },
  {
    clean: false,
    deps: clientDependencies,
    entry: ['./src/config.ts'],
    outDir: 'dist/config',
    sourcemap: true,
  },
]);
