# Build vets-website
# printf "\n\n##### Installing vets-website #####\n"
# set -e
# yarn cache clean && yarn install --production=false --prefer-offline && yarn build -- --host="${CODESPACE_NAME}-3001.githubpreview.dev/" --env api=${CODESPACE_NAME}-3000.githubpreview.dev/

# Setup vets-api
cd ../vets-api
mkdir config/certs
touch config/certs/vetsgov-localhost.crt
touch config/certs/vetsgov-localhost.key
cp ../vets-website/.devcontainer/vets-api/setting.local.yml config/settings.local.yml
make up
#CONFIG_HOST=/^vets-website-.*-3000\.githubpreview\.dev$/
#sed '/^config\.hosts.*/a hello' config/environments/development.rb
#echo "config.hosts << /^vets-website-.*-3000\.githubpreview\.dev$/" | config/environments/development.rb
