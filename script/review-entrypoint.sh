#!/bin/sh

set -e
cd ../vagov-content
yarn install --production=false
npm run fetch-drupal-cache
npm run build -- --buildtype localhost --api='${API_URL}' --host='${WEB_HOST}' --port='${WEB_PORT}'

if [ -d "../content-build" ]
then
  cd ../content-build
  yarn install --production=false
  npm run build -- --buildtype localhost --api='${API_URL}' --host='${WEB_HOST}' --port='${WEB_PORT}'
  npm run heroku-serve -- build/localhost -p 3002
else
  echo "Directory ../content-build does not exists."
  cd ../vagov-content
  npm run heroku-serve -- build/localhost -p 3001
fi

cd ../vagov-content
pwd
