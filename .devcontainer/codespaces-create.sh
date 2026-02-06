#!/bin/bash

# Configure NVM
printf "\n\n#####" Configuring Node, NPM, and Yarn #####\n""
source $NVM_DIR/nvm.sh
nvm install || true # ignore exit code due to npm prefix
nvm use --delete-prefix

# Download content repo
printf "\n\n##### Downloading content repo #####\n"
yarn install-repos

# Set up vets-api
# printf "\n\n##### Installing vets-api #####\n"
# set -e
# cd ../vets-api && make up

# Build vets-website
printf "\n\n##### Installing vets-website #####\n"
set -e
cd ../vets-website && yarn cache clean && yarn install --production=false --prefer-offline

if [[ "${VETS_WEBSITE_BUILD_SELF}" != "NO" ]]; then
  yarn build -- --host="${CODESPACE_NAME}-3001.githubpreview.dev/" --env api=${CODESPACE_NAME}-3000.githubpreview.dev/
fi

if [[ "${VETS_WEBSITE_BUILD_CONTENT}" != "NO" ]]
then
  # Build content-build and serve site
  printf "\n\n##### Installing content-build #####\n"
  cd ../content-build && cp .env.example .env && yarn cache clean && yarn install --production=false --prefer-offline && yarn fetch-drupal-cache && yarn build -- --host="${CODESPACE_NAME}-3002.githubpreview.dev/" --apps-directory-name=vets-website && npx http-server ./build/localhost --port 3002
fi

chmod +x ./.devcontainer/codespaces-start.sh

printf "\n\n##### Your codespace has been created! #####\n"
