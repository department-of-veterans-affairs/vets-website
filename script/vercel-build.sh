#!/bin/sh
set -e

echo "=== Vercel Build: vets-website (frontend only) ==="
echo "Building apps: static-pages, facilities, hca"

# Vercel sets VERCEL_URL to the unique *deployment* URL (e.g.
# my-app-abc123.vercel.app) which differs from the production alias
# (e.g. my-app.vercel.app).  If the user visits via the alias the
# browser treats the deployment URL as a different origin and blocks
# API calls with CORS errors.  Prefer the stable production URL.
if [ -n "$VERCEL_PROJECT_PRODUCTION_URL" ]; then
  API_URL="https://${VERCEL_PROJECT_PRODUCTION_URL}"
elif [ -n "$VERCEL_URL" ]; then
  API_URL="https://${VERCEL_URL}"
else
  API_URL="http://localhost:3001"
fi

echo "API_URL: ${API_URL}"

# Build only the three target apps + static-pages (always needed for site-wide widgets).
# The --env api flag sets __API__ which overrides the default API_URL at runtime.
NODE_OPTIONS="--openssl-legacy-provider --max-old-space-size=8192" \
  yarn build:webpack \
  --env buildtype=localhost \
  --env scaffold \
  --env "api=${API_URL}" \
  --env entry=static-pages,facilities,hca

# Copy vendor to shared-modules (required by the runtime)
cp -v build/localhost/generated/vendor.entry.js build/localhost/generated/shared-modules.entry.js

echo "=== Build complete ==="
ls -la build/localhost/
ls -la build/localhost/generated/ | head -20
