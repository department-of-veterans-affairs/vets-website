#!/bin/sh

# Build vets-website
set -e
yarn install --ignore-scripts --production=false
yarn postinstall
npm run build -- --buildtype=localhost --api="${API_URL}" --host="${WEB_HOST}" --port="${WEB_PORT}"

# Start serving vets-website immediately so React apps are available.
# Content-build will run in the background and merge its output when done.
SERVE_DIR="$(pwd)/build/localhost"

# Add CSP nonce placeholder to script tags in webpack-generated HTML.
# The nginx reverse proxy replaces **CSP_NONCE** with a real nonce and sets
# a strict-dynamic CSP header requiring every <script> to carry a valid nonce.
# Webpack's dev-template.ejs only puts nonce on inline scripts, not on the
# injected bundle <script> tags (vendor.js, <app>.entry.js, etc.).
find "$SERVE_DIR" -name "*.html" -exec \
  perl -pi -e 's/<script(?![^>]*\bnonce\b)/<script nonce="**CSP_NONCE**"/g' {} +

# Inject status banner script into served directory so users see content-build progress
cp "$(pwd)/script/review-status-banner.js" "$SERVE_DIR/review-status-banner.js"
# Add banner script tag to every HTML file — each app route has its own index.html
find "$SERVE_DIR" -name "*.html" -exec \
  sed -i 's|</body>|<script nonce="**CSP_NONCE**" src="/review-status-banner.js"></script></body>|' {} +

# Start http-server in the background on the target port
npx http-server "$SERVE_DIR" -p 3002 --proxy "${API_URL}" -c-1 &
SERVER_PID=$!

echo "========================================="
echo "vets-website apps now available on :3002"
echo "Content-build starting in background..."
echo "========================================="

# Build content-build in the background
(
  cd ../content-build
  cp .env.example .env && yarn install-safe --production=false
  npm run fetch-drupal-cache
  npm run build -- --buildtype=localhost --api="${API_URL}" --host="${WEB_HOST}" --port="${WEB_PORT}" --apps-directory-name=application

  # Merge content-build output into the served directory.
  # --no-links: dereference the generated/ symlink instead of copying it
  #   (content-build symlinks generated/ back to vets-website; skip the
  #   redundant copy since those bundles are already in SERVE_DIR).
  # --exclude=generated: avoid overwriting vets-website bundles with themselves.
  # --checksum: only overwrite files that actually changed.
  rsync -a --no-links --exclude=generated --checksum build/localhost/ "$SERVE_DIR/"

  # Remove the banner script — content-build is done, no need for it
  rm -f "$SERVE_DIR/review-status-banner.js"

  echo "========================================="
  echo "Content-build complete. Static pages now available."
  echo "========================================="
) &
CONTENT_PID=$!

# Wait for both processes - if the server dies, exit
wait $SERVER_PID $CONTENT_PID
