#!/bin/bash

# configure NVM
source $NVM_DIR/nvm.sh
nvm install || true # ignore exit code due to npm prefix
nvm use --delete-prefix

# check versions
printf "node version: "
node --version

printf "yarn version: "
yarn --version

# install dependencies
printf "\n\n#####" Installing dependencies #####""
yarn install

# download content repo
printf "\n\n##### Downloading content repo #####"
yarn install-repos

# download drupal cache
printf "\n\n##### Downloading Drupal cache #####"
yarn fetch-drupal-cache

# build content
# yarn build

printf "\n\n##### Codespace setup complete! #####"