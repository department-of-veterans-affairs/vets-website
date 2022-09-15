#!/bin/bash

# Build vets-website
# printf "\n\n##### Installing vets-website #####\n"
# set -e
# yarn cache clean && yarn install --production=false --prefer-offline && yarn build -- --host="${CODESPACE_NAME}-3001.githubpreview.dev/" --env api=${CODESPACE_NAME}-3000.githubpreview.dev/

printf "\n\n##### Starting vets-api #####\n"

# Copy settings file to vets-api directory
cp .devcontainer/vets-api/settings.local.yml ../vets-api/config/settings.local.yml

# Change directory to vets-api
cd ../vets-api

# Add codespace name to `virtual_hosts` in settings file
sed -i "/^virtual_hosts*/a - $CODESPACE_NAME-3000.githubpreview.dev" config/settings.local.yml

# Setup key & cert for localhost authentication to ID.me
mkdir config/certs
touch config/certs/vetsgov-localhost.crt
touch config/certs/vetsgov-localhost.key

# Start vets-api server and associated services
make up
