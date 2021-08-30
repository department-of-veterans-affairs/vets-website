#!/bin/sh

# Build vets-website
set -e
yarn install --production=false
npm run build -- --buildtype=localhost --api='${API_URL}' --host='${WEB_HOST}' --port='${WEB_PORT}'

# Build content-build and serve site
cd ../content-build
yarn install --production=false
npm run fetch-drupal-cache
npm run build -- --buildtype=localhost --api='${API_URL}' --host='${WEB_HOST}' --port='${WEB_PORT}' --apps-directory-name=application
npx http-server -- build/localhost -p 3002

