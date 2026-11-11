import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { createClient } from '../index';

const temporary: Array<string> = [];

afterEach(async () => {
  await Promise.all(
    temporary.splice(0).map((directory) => rm(directory, { force: true, recursive: true })),
  );
});

async function generate(
  reuseSchemaReferences: boolean,
  infer = false,
  nullable = false,
  compatibilityVersion: 3 | 4 | 'mini' = 4,
) {
  const output = await mkdtemp(path.join(os.tmpdir(), 'hey-api-zod-reference-'));
  temporary.push(output);
  const reference = { $ref: '#/components/schemas/Item' };
  await createClient({
    input: {
      components: {
        schemas: {
          Item: { properties: { value: { type: 'string' } }, required: ['value'], type: 'object' },
          Other: {
            properties: { count: { type: 'integer' } },
            required: ['count'],
            type: 'object',
          },
        },
      },
      info: { title: 'reference reuse', version: '1.0.0' },
      openapi: '3.1.0',
      paths: {
        '/items': {
          post: {
            operationId: 'createItem',
            requestBody: { content: { 'application/json': { schema: reference } }, required: true },
            responses: {
              '200': {
                content: {
                  'application/json': {
                    schema: nullable ? { anyOf: [reference, { type: 'null' }] } : reference,
                  },
                },
                description: 'Item',
              },
            },
          },
        },
        '/other': {
          get: {
            operationId: 'getOther',
            responses: {
              '200': {
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Other' } } },
                description: 'Other',
              },
            },
          },
        },
      },
    },
    logs: { level: 'silent' },
    output,
    plugins: [
      '@hey-api/typescript',
      { bundle: false, name: '@hey-api/client-fetch' },
      {
        compatibilityVersion,
        name: 'zod',
        requests: true,
        responses: { types: { infer } },
        reuseSchemaReferences,
      },
      { name: '@hey-api/sdk', validator: { request: 'zod', response: 'zod' } },
    ],
  });
  return {
    sdk: await readFile(path.join(output, 'sdk.gen.ts'), 'utf8'),
    zod: await readFile(path.join(output, 'zod.gen.ts'), 'utf8'),
  };
}

describe('canonical operation schemas', () => {
  it('preserves operation aliases by default', async () => {
    const { zod } = await generate(false);
    expect(zod).toContain('export const zCreateItemBody = zItem;');
    expect(zod).toContain('export const zCreateItemResponse = zItem;');
  });

  it.each([3, 4, 'mini'] as const)(
    'reuses canonical validators and separates operations for %s',
    async (version) => {
      const { sdk, zod } = await generate(true, false, false, version);
      expect(zod).toContain('export const zItem =');
      expect(zod).toContain('export const zOther =');
      expect(zod).not.toContain('export const zCreateItemBody');
      expect(zod).not.toContain('export const zCreateItemResponse');
      expect(zod).not.toContain('export const zGetOtherResponse');
      expect(sdk).toContain('body: zItem');
      expect(sdk).toContain('await zItem.parseAsync(data)');
      expect(sdk).toContain('await zOther.parseAsync(data)');
    },
  );

  it('retains modified response validation', async () => {
    const { sdk, zod } = await generate(true, false, true);
    expect(zod).toContain('export const zCreateItemResponse =');
    expect(zod).toContain('.nullable()');
    expect(sdk).toContain('await zCreateItemResponse.parseAsync(data)');
  });

  it('retains schemas with explicitly requested type exports', async () => {
    const { zod } = await generate(true, true);
    expect(zod).toContain('export const zCreateItemResponse = zItem;');
    expect(zod).toContain('z.infer<typeof zCreateItemResponse>');
  });

  it('isolates aliases between separate generations', async () => {
    const first = await generate(true);
    const second = await generate(false);
    expect(first.zod).not.toContain('export const zCreateItemResponse');
    expect(second.sdk).toContain('await zCreateItemResponse.parseAsync(data)');
  });
});
