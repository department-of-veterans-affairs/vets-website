#!/bin/sh
set -e

echo "=== Vercel Build: vets-website (frontend only) ==="
echo "Building apps: static-pages, facilities, hca"

# Vercel provides VERCEL_URL (e.g. my-app-xyz.vercel.app) during builds.
# We use it to construct the API base URL so frontend API calls go to
# our mock serverless function on the same deployment.
if [ -n "$VERCEL_URL" ]; then
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

# Fetch the live VA.gov homepage HTML so the landing page renders with
# full static content (header, footer, benefit hubs, etc.) instead of
# the bare scaffold shell.  Falls back to the scaffold-generated page
# if the fetch fails for any reason.
echo "=== Fetching VA.gov homepage ==="
if curl -sL --max-time 15 -o /tmp/vagov-home.html https://www.va.gov/ \
   && [ -s /tmp/vagov-home.html ]; then
  cp /tmp/vagov-home.html build/localhost/index.html
  echo "Homepage fetched from www.va.gov"
else
  echo "WARNING: Could not fetch VA.gov homepage; using scaffold page"
fi

echo "=== Build complete ==="
ls -la build/localhost/
ls -la build/localhost/generated/ | head -20
