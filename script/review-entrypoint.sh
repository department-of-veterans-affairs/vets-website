#!/bin/sh

# Build vets-website
set -e
yarn install --ignore-scripts --production=false
yarn postinstall
npm run build -- --buildtype=localhost --api='${API_URL}' --host='${WEB_HOST}' --port='${WEB_PORT}'

# Build content-build and serve site
cd ../content-build
echo "=== content-build: entered $(pwd) at $(date) ==="
node -v 2>/dev/null || echo "node not found"
npm -v 2>/dev/null || echo "npm not found"
echo "Checking for node-sass in node_modules..."

if [ -f package.json ] && grep -q '"node-sass"' package.json; then
  echo "node-sass declared in package.json"
fi

if [ -d node_modules/node-sass ]; then
  echo "node-sass appears installed under node_modules"
  # detect compiled/prebuilt binary
  if [ -n "$(find node_modules/node-sass/vendor -name 'binding.node' 2>/dev/null)" ]; then
    echo "Prebuilt node-sass binary found; skipping rebuild"
  else
    echo "No prebuilt node-sass binary found. Attempting: npm rebuild node-sass"
    if npm rebuild node-sass; then
      echo "npm rebuild node-sass succeeded"
    else
      echo "ERROR: npm rebuild node-sass failed"
      npm config ls
      exit 1
    fi
  fi
else
  echo "node-sass not present in node_modules; skipping rebuild"
fi
cp .env.example .env && yarn install --production=false
# Build necessary node modules since ignore-scripts is set globally.
cd node_modules/node-libcurl/ && npm run install && cd -
npm run fetch-drupal-cache

npm run build -- --buildtype=localhost --api='${API_URL}' --host='${WEB_HOST}' --port='${WEB_PORT}' --apps-directory-name=application
npm run heroku-serve -- build/localhost -p 3002
