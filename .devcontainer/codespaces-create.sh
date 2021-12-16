#!/bin/bash

# Configure NVM
printf "\n\n#####" Configuring Node, NPM, and Yarn #####\n""
source $NVM_DIR/nvm.sh
nvm install || true # ignore exit code due to npm prefix
nvm use --delete-prefix

# Download content repo
printf "\n\n##### Downloading content repo #####\n"
yarn install-repos

# Build vets-website
printf "\n\n##### Installing vets-website #####\n"
set -e
cd ../vets-website && yarn install --production=false --prefer-offline && yarn build -- --buildtype=localhost --api=https://staging-api.va.gov --host="${CODESPACE_NAME}-3001.githubpreview.dev/" --port=3001

if [[ "${VETS_WEBSITE_BUILD_CONTENT}" != "NO" ]]
then
  # Build content-build and serve site
  printf "\n\n##### Installing content-build #####\n"
  cd ../content-build && yarn install --production=false --prefer-offline && yarn fetch-drupal-cache && yarn build -- --buildtype=localhost --api=https://staging-api.va.gov --host="${CODESPACE_NAME}-3002.githubpreview.dev/" --port=3002 --apps-directory-name=vets-website
fi

printf "\n\n##### Your codespace has been created! #####\n"
