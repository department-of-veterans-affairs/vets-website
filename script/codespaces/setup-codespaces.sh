#!/usr/bin/env bash
if [ ! -d ../vagov-content ]; then
  git clone --single-branch --depth 1 https://github.com/department-of-veterans-affairs/vagov-content.git ../vagov-content
else
  echo "Repo vagov-content already cloned."
fi

if [ ! -d ../content-build ]; then
  git clone --single-branch --depth 1 https://github.com/department-of-veterans-affairs/content-build.git ../content-build
else
  echo "Repo content-build already cloned."
fi

# Build vets-website
set -e
yarn install --production=false --prefer-offline
yarn build -- --buildtype=localhost --api=https://api.va.gov --host=department-of-veterans-affairs-vets-website-7vrv7553xrg9-3002.githubpreview.dev/ --port=3002

# Build content-build and serve site
cd ../content-build
yarn install --production=false
yarn fetch-drupal-cache
yarn build -- --buildtype=localhost --api=https://api.va.gov --host=department-of-veterans-affairs-vets-website-7vrv7553xrg9-3002.githubpreview.dev/ --port=3002 --apps-directory-name=vets-website
yarn heroku-serve -- build/localhost -p 3002
