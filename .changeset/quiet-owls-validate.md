---
"@hey-api/openapi-ts": patch
---

Validate successful Fetch responses before returning empty, text, and stream bodies. Treat a 204 response as undefined so validators for intentionally empty responses can accept it.
