---
"@hey-api/openapi-ts": patch
---

Expose a configuration-only entry at `@hey-api/openapi-ts/config`. It preserves typed plugin configuration without importing the public runtime client exports for unselected frameworks. The root `defineConfig` export uses the same implementation.

Keep function and loop AST mode return types valid in strict bundled declarations, including function-expression type assertions.
