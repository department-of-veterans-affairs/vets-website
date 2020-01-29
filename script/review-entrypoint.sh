#!/bin/sh
set -e
yarn install --production=false
npm run build -- --buildtype localhost --api='${API_URL}'
npm run heroku-serve -- build/localhost -p 3001
