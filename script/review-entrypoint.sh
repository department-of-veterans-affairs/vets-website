#!/bin/sh

# Build vets-website
set -e
yarn install --ignore-scripts --production=false
yarn postinstall
npm run build -- --buildtype=localhost --api='${API_URL}' --host='${WEB_HOST}' --port='${WEB_PORT}'

# Build content-build and serve site
cd ../content-build
cp .env.example .env && yarn install --production=false
# Build necessary node modules since ignore-scripts is set globally.
cd node_modules/node-libcurl/ && npm run install && cd -
npm run fetch-drupal-cache

npm run build -- --buildtype=localhost --api='${API_URL}' --host='${WEB_HOST}' --port='${WEB_PORT}' --apps-directory-name=application
npm run heroku-serve -- build/localhost -p 3002
