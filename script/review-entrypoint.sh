#!/bin/sh

set -e
yarn install --production=false
npm run fetch-drupal-cache
[ ! -d "../content-build" ] && exit 1
npm run build -- --buildtype localhost --api='${API_URL}' --host='${WEB_HOST}' --port='${WEB_PORT}'
[ -d "../content-build" ] && cd ../content-build && npm run build -- --buildtype localhost --api='${API_URL}' --host='${WEB_HOST}' --port='${WEB_PORT}'
[ ! -d "../content-build" ] && npm run heroku-serve -- build/localhost -p 3001
[ -d "../content-build" ] && cd ../content-build && npm run heroku-serve -- build/localhost -p 3002
