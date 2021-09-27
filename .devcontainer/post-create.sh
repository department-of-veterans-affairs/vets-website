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
yarn install && yarn build

printf "\n\n#####" Setting up vets-api #####\n""
cd ../vets-api

printf "\n\n#####" Setting up content-build #####\n""
cd ../content-build && yarn install && yarn build && yarn watch

printf "\n\n##### Codespace setup complete! #####\n"
