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
    throw new Error('Run declaration receiving through pnpm or set TSGO_BINARY.');
  }
  return spawnSync(process.execPath, [process.env.npm_execpath, 'exec', 'tsgo', ...args], {
    cwd: packageRoot,
    encoding: 'utf8',
  });
};

it('preserves keyword types and values in the bundled compiler facade', async () => {
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
      dts: {
        build: true,
        tsgo: process.env.TSGO_BINARY ? { path: process.env.TSGO_BINARY } : true,
      },
      entry: [path.join(packageRoot, 'src', 'ts-compiler', 'index.ts')],
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
        `import { ts } from ${JSON.stringify(moduleUrl)}; console.log(ts.SyntaxKind.AnyKeyword);`,
      ],
      { encoding: 'utf8' },
    );
    expect(runtime.status, runtime.stderr).toBe(0);
    expect(runtime.stdout.trim()).toBe('AnyKeyword');

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
    const probe = (keyword: string) => {
      fs.writeFileSync(
        source,
        `import { ts } from './index.mjs';\nconst keyword: ts.SyntaxKind.AnyKeyword = ts.SyntaxKind.${keyword};\nvoid keyword;\n`,
      );
      return runCompiler(['--project', config, '--pretty', 'false']);
    };
    const valid = probe('AnyKeyword');
    expect(valid.status, valid.stdout + valid.stderr).toBe(0);
    const invalid = probe('StringKeyword');
    expect(invalid.status).not.toBe(0);
    expect(invalid.stdout + invalid.stderr).toContain('TS2322');
  } finally {
    fs.rmSync(output, { force: true, recursive: true });
  }
}, 120_000);
