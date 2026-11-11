---
"@hey-api/openapi-ts": patch
"@hey-api/shared": patch
---

Add a configuration-only entry point that does not require optional client provider declarations. Preserve function and loop AST return types, expose plugin metadata types without declaration bundler name collisions, and publish the semver declarations used by the public API.
