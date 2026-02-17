#!/bin/sh

# Build vets-website
set -e
yarn install --ignore-scripts --production=false
yarn postinstall
yarn build:rspack --env buildtype=localhost --env api="${API_URL}" --env host="${WEB_HOST}" --env port="${WEB_PORT}"

# Build content-build and serve site
cd ../content-build
cp .env.example .env && yarn install-safe --production=false
npm run fetch-drupal-cache
npm run build -- --buildtype=localhost --api="${API_URL}" --host="${WEB_HOST}" --port="${WEB_PORT}" --apps-directory-name=application
npm run heroku-serve -- build/localhost -p 3002
