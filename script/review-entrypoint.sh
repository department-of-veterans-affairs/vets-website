#!/bin/sh

set -e
yarn install --production=false
npm run fetch-drupal-cache
npm run build -- --buildtype localhost --api='${API_URL}' --host='${WEB_HOST}' --port='${WEB_PORT}'
npm run heroku-serve -- build/localhost -p 3001

if [ -d "../vets-api" ] 
then
  # yarn install --production=false
  # npm run fetch-drupal-cache
  # npm run build -- --buildtype localhost --api='${API_URL}' --host='${WEB_HOST}' --port='${WEB_PORT}'
  # cd ../content-build && npm run build -- --buildtype localhost --api='${API_URL}' --host='${WEB_HOST}' --port='${WEB_PORT}' && npm run heroku-serve -- build/localhost -p 3002
else
  echo "Directory ../content-build does not exists."
  # npm run heroku-serve -- build/localhost -p 3001
fi
