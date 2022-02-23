#!/bin/sh

# Build vets-website
set -e
yarn install
npm run build -- --buildtype=localhost --api='${API_URL}' --host='${WEB_HOST}' --port='${WEB_PORT}'

# Build content-build and serve site
cd ../content-build
yarn install
npm run fetch-drupal-cache
npm run build -- --buildtype=localhost --api='${API_URL}' --host='${WEB_HOST}' --port='${WEB_PORT}' --apps-directory-name=application
npm run heroku-serve -- build/localhost -p 3002

