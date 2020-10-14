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

# install dependencies
printf "\n\n#####" Installing dependencies #####\n""
yarn install

# download content repo
printf "\n\n##### Downloading content repo #####\n"
yarn install-repos

# download drupal cache
printf "\n\n##### Downloading Drupal cache #####\n"
yarn fetch-drupal-cache

# build content
# yarn build

printf "\n\n##### Codespace setup complete! #####\n"
