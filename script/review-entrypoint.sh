#!/bin/sh

# Build vets-website
set -e
YARN_CHECKSUM_BEHAVIOR=ignore yarn install --immutable
npm run build -- --buildtype=localhost --api='${API_URL}' --host='${WEB_HOST}' --port='${WEB_PORT}'

# Build content-build and serve site
cd ../content-build
cp .env.example .env && YARN_CHECKSUM_BEHAVIOR=ignore yarn install --immutable
npm run fetch-drupal-cache
npm run build -- --buildtype=localhost --api='${API_URL}' --host='${WEB_HOST}' --port='${WEB_PORT}' --apps-directory-name=application --no-drupal-proxy
npm run heroku-serve -- build/localhost -p 3002

