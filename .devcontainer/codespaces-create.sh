#!/usr/bin/env bash

# Build vets-website
# printf "\n\n##### Installing vets-website #####\n"
# set -e
# yarn cache clean && yarn install --production=false --prefer-offline && yarn build -- --host="${CODESPACE_NAME}-3001.githubpreview.dev/" --env api=${CODESPACE_NAME}-3000.githubpreview.dev/

printf "\n\n##### Starting vets-api #####\n"
cd ../vets-api
mkdir config/certs
touch config/certs/vetsgov-localhost.crt
touch config/certs/vetsgov-localhost.key
# Add codespace name to virtual hosts before copying settings
sed -i "/^virtual_hosts*/a - $CODESPACE_NAME" .devcontainer/vets-api/settings.local.yml
cp ../vets-website/.devcontainer/vets-api/settings.local.yml config/settings.local.yml
# make up
#CONFIG_HOST=/^vets-website-.*-3000\.githubpreview\.dev$/
#sed '/^config\.hosts.*/a hello' config/environments/development.rb
#echo "config.hosts << /^vets-website-.*-3000\.githubpreview\.dev$/" | config/environments/development.rb
