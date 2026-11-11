import path from 'node:path';

import ts from 'typescript';

import { defineConfig } from '../config';
import { defineConfig as rootDefineConfig } from '../index';

describe('configuration entry point', () => {
  it('preserves the root configuration helper', () => {
    expect(defineConfig).toBe(rootDefineConfig);
  });

  it('typechecks the published entry without optional client providers', () => {
    const filename = path.resolve(import.meta.dirname, 'config-entry.fixture.mts');
    const contents = `
      import { defineConfig } from '../../dist/config/config.mjs';
      export default defineConfig({
        input: 'synthetic.json',
        output: { path: 'generated' },
        plugins: [
          '@hey-api/client-fetch',
          {
            name: 'zod',
            requests: true,
            responses: true,
            $resolvers: { number(context) { return context.nodes.base(context); } },
          },
          { name: '@hey-api/sdk', validator: { response: 'zod' } },
        ],
      });
    `;
    const options: ts.CompilerOptions = {
      exactOptionalPropertyTypes: true,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      noEmit: true,
      noUncheckedIndexedAccess: true,
      skipLibCheck: false,
      strict: true,
      target: ts.ScriptTarget.ES2022,
      types: ['node'],
    };
    const host = ts.createCompilerHost(options);
    const read = host.readFile.bind(host);
    const exists = host.fileExists.bind(host);
    const source = host.getSourceFile.bind(host);
    host.readFile = (file) => (file === filename ? contents : read(file));
    host.fileExists = (file) => file === filename || exists(file);
    host.getSourceFile = (file, version, error, fresh) =>
      file === filename
        ? ts.createSourceFile(file, contents, version, true)
        : source(file, version, error, fresh);
    const optionalProviders: Array<string> = [];
    host.resolveModuleNames = (names, containingFile) =>
      names.map((name) => {
        if (/^(?:@angular\/|axios$|ky$|nuxt\/|ofetch$|vue$)/.test(name)) {
          optionalProviders.push(name);
          return undefined;
        }
        return ts.resolveModuleName(name, containingFile, options, host).resolvedModule;
      });
    const program = ts.createProgram([filename], options, host);
    const errors = ts
      .getPreEmitDiagnostics(program)
      .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error)
      .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
    expect(optionalProviders).toEqual([]);
    expect(errors).toEqual([]);
  });
});
