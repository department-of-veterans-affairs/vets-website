#!/bin/bash

# configure NVM
/usr/local/share/nvm install || true # ignore exit code due to npm prefix
/usr/local/share/nvm use --delete-prefix
yarn install
