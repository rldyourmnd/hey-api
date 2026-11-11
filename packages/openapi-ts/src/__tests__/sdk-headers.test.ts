import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { createClient } from '../../dist/index.mjs';

describe('Fetch SDK headers', () => {
  it('keeps JSON and multipart headers through actual generated operations', async () => {
    const output = fs.mkdtempSync(path.join(os.tmpdir(), 'hey-api-headers-'));
    try {
      await createClient({
        input: {
          info: { title: 'Headers probe', version: '1.0.0' },
          openapi: '3.1.0',
          paths: Object.fromEntries(
            [
              ['/json', 'sendJson', 'application/json'],
              ['/form', 'sendForm', 'multipart/form-data'],
            ].map(([route, operationId, media]) => [
              route!,
              {
                post: {
                  operationId,
                  requestBody: {
                    content: {
                      [media!]: {
                        schema: {
                          properties: { field: { type: 'string' } },
                          required: ['field'],
                          type: 'object',
                        },
                      },
                    },
                    required: true,
                  },
                  responses: { '204': { description: 'Accepted' } },
                },
              },
            ]),
          ),
        },
        logs: { level: 'silent' },
        output: { importFileExtension: '.ts', path: output },
        plugins: ['@hey-api/typescript', '@hey-api/client-fetch', '@hey-api/sdk'],
      });
      const source = fs.readFileSync(path.join(output, 'sdk.gen.ts'), 'utf-8');
      expect(source).not.toMatch(/\.\.\.options\??\.headers/);
      const sdk = await import(pathToFileURL(path.join(output, 'sdk.gen.ts')).href);
      const { client } = await import(pathToFileURL(path.join(output, 'client.gen.ts')).href);
      for (const operation of ['sendJson', 'sendForm']) {
        for (const [kind, headers] of [
          ['record', { 'X-Probe': 'record', 'X-Remove': null }],
          ['Headers', new Headers({ 'X-Probe': 'Headers' })],
          ['tuple', [['X-Probe', 'tuple']]],
        ]) {
          const fetch = vi.fn(async (request: Request) => {
            expect(request.headers.get('X-Probe')).toBe(kind);
            expect(request.headers.get('0')).toBeNull();
            expect(request.headers.get('X-Remove')).toBe(kind === 'record' ? null : 'configured');
            if (operation === 'sendForm') {
              expect(request.headers.get('Content-Type')).toMatch(
                /^multipart\/form-data; boundary=/,
              );
              expect((await request.formData()).get('field')).toBe('value');
            } else {
              expect(request.headers.get('Content-Type')).toBe('application/json');
              expect(await request.json()).toEqual({ field: 'value' });
            }
            return new Response(null, { status: 204 });
          });
          client.setConfig({
            baseUrl: 'https://example.test',
            fetch,
            headers: { 'X-Remove': 'configured' },
          });
          await sdk[operation]({ body: { field: 'value' }, headers });
          expect(fetch).toHaveBeenCalledOnce();
          expect(await fetch.mock.results[0]?.value).toBeInstanceOf(Response);
        }
      }
    } finally {
      fs.rmSync(output, { force: true, recursive: true });
    }
  });
});
