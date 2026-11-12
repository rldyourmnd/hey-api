---
"@hey-api/openapi-ts": patch
---

Preserve keyword enum types when bundling the compiler facade's declarations. Keep the internal enum name distinct from the public namespace so aliases do not become circular. The public enum names and runtime values remain unchanged.
