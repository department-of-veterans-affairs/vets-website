#!/bin/bash

# configure NVM
source $NVM_DIR/nvm.sh
nvm install || true # ignore exit code due to npm prefix
nvm use --delete-prefix

# check versions
echo "node version: "
node --version
echo "yarn version: "
yarn --version

# install dependencies
yarn install

# download content repo
yarn install-repos

# download drupal cache
yarn fetch-drupal-cache

# build content
# yarn build
