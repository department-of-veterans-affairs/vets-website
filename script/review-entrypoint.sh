#!/bin/sh

set -e
yarn install --production=false
npm run build -- --buildtype localhost --api='${API_URL}' --host='${WEB_HOST}' --port='${WEB_PORT}'

if [ -d "../content-build" ]
then
  cd ../content-build
  yarn install --production=false
  npm run build -- --buildtype localhost --api='${API_URL}' --host='${WEB_HOST}' --port='${WEB_PORT}'
  npm run heroku-serve -- build/localhost -p 3002
else
  echo "Content build does not exist!"
  npm run heroku-serve -- build/localhost -p 3001
fi
