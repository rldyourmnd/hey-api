import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { createClient } from '../index';

describe('Fetch SDK headers', () => {
  it('normalizes HeadersInit instead of spreading it into a record', async () => {
    const output = fs.mkdtempSync(path.join(os.tmpdir(), 'hey-api-headers-'));
    try {
      await createClient({
        input: {
          info: { title: 'Headers probe', version: '1.0.0' },
          openapi: '3.1.0',
          paths: {
            '/probe': {
              post: {
                operationId: 'sendProbe',
                requestBody: {
                  content: {
                    'application/json': {
                      schema: { type: 'object' },
                    },
                  },
                  required: true,
                },
                responses: { '204': { description: 'Accepted' } },
              },
            },
          },
        },
        logs: { level: 'silent' },
        output,
        plugins: [
          '@hey-api/typescript',
          { bundle: false, name: '@hey-api/client-fetch' },
          '@hey-api/sdk',
        ],
      });
      const source = fs.readFileSync(path.join(output, 'sdk.gen.ts'), 'utf-8');
      expect(source).toContain('mergeHeaders');
      expect(source).toMatch(/headers: mergeHeaders\(/);
      expect(source).not.toMatch(/\.\.\.options\??\.headers/);
    } finally {
      fs.rmSync(output, { force: true, recursive: true });
    }
  });
});
