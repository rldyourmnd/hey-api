---
'@hey-api/openapi-ts': patch
---

Add opt-in `reuseSchemaReferences` to the Zod plugin. SDK request/response validators reuse unmodified canonical schemas without redundant operation aliases. Modified schemas and explicit type exports keep their own declarations; default output is unchanged.
