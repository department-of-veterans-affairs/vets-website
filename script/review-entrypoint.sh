#!/bin/sh
set -e
yarn install --production=false
npm run fetch-drupal-cache
npm run build -- --buildtype localhost --api='${API_URL}' --host='${WEB_HOST}' --port='${WEB_PORT}'
npm run heroku-serve -- build/localhost -p 3001
