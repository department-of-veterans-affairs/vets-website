#!/bin/bash

# configure NVM
# /usr/local/share/nvm install || true # ignore exit code due to npm prefix
# nvm use --delete-prefix

which yarn
yarn --version
yarn install
