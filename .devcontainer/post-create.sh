#!/bin/bash

# configure NVM
printf "\n\n#####" Configuring Node, NPM, and Yarn #####\n""
source $NVM_DIR/nvm.sh
nvm install || true # ignore exit code due to npm prefix
nvm use --delete-prefix

# check versions
printf "Node version: "
node --version

printf "Yarn version: "
yarn --version

# download content repo
printf "\n\n##### Downloading content repo #####\n"
yarn install-repos

# Setup vets-website
printf "\n\n#####" Setting up vets-website #####\n""
yarn install --production=false --prefer-offline && yarn build -- --buildtype=localhost --api=https://staging-api.va.gov --host=department-of-veterans-affairs-vets-website-7vrv7553xrg9-3002.githubpreview.dev/ --port=3002

printf "\n\n#####" Setting up vets-api #####\n""
cd ../vets-api

printf "\n\n#####" Setting up content-build #####\n""
cd ../content-build && yarn install --production=false && yarn fetch-drupal-cache && yarn build -- --buildtype=localhost --api=https://staging-api.va.gov --host=department-of-veterans-affairs-vets-website-7vrv7553xrg9-3002.githubpreview.dev/ --port=3002 --apps-directory-name=vets-website && yarn watch

printf "\n\n##### Codespace setup complete! #####\n"