import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { build } from 'tsdown';
import { expect, it } from 'vitest';

const packageRoot = fileURLToPath(new URL('../../../', import.meta.url));

const runCompiler = (args: ReadonlyArray<string>) => {
  if (process.env.TSGO_BINARY) {
    return spawnSync(process.env.TSGO_BINARY, args, { encoding: 'utf8' });
  }
  if (!process.env.npm_execpath) {
    throw new Error('Run tests through pnpm or set TSGO_BINARY.');
  }
  return spawnSync(process.execPath, [process.env.npm_execpath, 'exec', 'tsgo', ...args], {
    cwd: packageRoot,
    encoding: 'utf8',
  });
};

it.each([
  {
    entry: 'src/ts-compiler/index.ts',
    invalid:
      "import { ts } from './index.mjs';\nconst keyword: ts.SyntaxKind.AnyKeyword = ts.SyntaxKind.StringKeyword;\nvoid keyword;\n",
    name: 'compiler keyword facade',
    runtime: 'ts.SyntaxKind.AnyKeyword',
    runtimeExport: 'ts',
    runtimeValue: 'AnyKeyword',
    valid:
      "import { ts } from './index.mjs';\nconst keyword: ts.SyntaxKind.AnyKeyword = ts.SyntaxKind.AnyKeyword;\nvoid keyword;\n",
  },
  {
    entry: 'src/config.ts',
    invalid:
      "import { type UserConfig } from './index.mjs';\nconst config: UserConfig = { input: 'spec.json', output: 'generated', plugins: [{ name: '@hey-api/client-fetch', throwOnError: 'invalid' }] };\nvoid config;\n",
    name: 'configuration without optional runtime clients',
    runtime: "(await defineConfig({ input: 'spec.json', output: 'generated' })).output",
    runtimeExport: 'defineConfig',
    runtimeValue: 'generated',
    valid:
      "import { defineConfig, type UserConfig } from './index.mjs';\nconst config: UserConfig = { input: 'spec.json', output: 'generated', plugins: [{ name: '@hey-api/client-fetch', throwOnError: true }, 'zod'] };\nvoid defineConfig(config);\n",
  },
])(
  'preserves bundled declarations for $name',
  async (scenario) => {
    const version = runCompiler(['--version']);
    expect(version.status, version.stderr).toBe(0);
    expect(version.stdout).toMatch(/Version 7\./);

    const cache = path.join(packageRoot, 'node_modules', '.cache');
    fs.mkdirSync(cache, { recursive: true });
    const output = fs.mkdtempSync(path.join(cache, 'compiler-declarations-'));
    try {
      await build({
        config: false,
        cwd: packageRoot,
        deps: {
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
        },
        dts: {
          build: true,
          tsgo: process.env.TSGO_BINARY ? { path: process.env.TSGO_BINARY } : true,
        },
        entry: { index: path.join(packageRoot, scenario.entry) },
        format: ['esm'],
        outDir: output,
        platform: 'node',
        tsconfig: path.join(packageRoot, 'tsconfig.json'),
      });

      const moduleUrl = pathToFileURL(path.join(output, 'index.mjs')).href;
      const runtime = spawnSync(
        process.execPath,
        [
          '--input-type=module',
          '-e',
          `import { ${scenario.runtimeExport} } from ${JSON.stringify(moduleUrl)}; console.log(${scenario.runtime});`,
        ],
        { encoding: 'utf8' },
      );
      expect(runtime.status, runtime.stderr).toBe(0);
      expect(runtime.stdout.trim()).toBe(scenario.runtimeValue);

      if (scenario.entry === 'src/config.ts') {
        const declarations = fs
          .readdirSync(output)
          .filter((file) => file.endsWith('.d.mts'))
          .map((file) => fs.readFileSync(path.join(output, file), 'utf8'))
          .join('\n');
        expect(declarations).not.toMatch(
          /(?:from\s+|import\()(['"])(?:@angular\/[^'"]+|axios|ky|nuxt\/app|ofetch|rxjs|vue)\1/,
        );
      }

      const source = path.join(output, 'probe.ts');
      const config = path.join(output, 'tsconfig.json');
      fs.writeFileSync(
        config,
        JSON.stringify({
          compilerOptions: {
            lib: ['ESNext'],
            module: 'ESNext',
            moduleResolution: 'Bundler',
            noEmit: true,
            skipLibCheck: false,
            strict: true,
            target: 'ESNext',
            types: ['node'],
          },
          files: ['probe.ts'],
        }),
      );
      const probe = (content: string) => {
        fs.writeFileSync(source, content);
        return runCompiler(['--project', config, '--pretty', 'false']);
      };
      const valid = probe(scenario.valid);
      expect(valid.status, valid.stdout + valid.stderr).toBe(0);
      const invalid = probe(scenario.invalid);
      expect(invalid.status).not.toBe(0);
      expect(invalid.stdout + invalid.stderr).toContain('TS2322');
    } finally {
      fs.rmSync(output, { force: true, recursive: true });
    }
  },
  120_000,
);
