#!/bin/bash

# configure NVM
source $NVM_DIR/nvm.sh
nvm install --lts || true # ignore exit code due to npm prefix
nvm use --delete-prefix

# check versions
node --version
yarn --version

# install
yarn install
