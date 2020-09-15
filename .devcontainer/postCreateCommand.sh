#!/bin/bash

# configure NVM
nvm install || true # ignore exit code due to npm prefix
nvm use --delete-prefix
yarn install
