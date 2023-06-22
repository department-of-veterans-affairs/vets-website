#!/bin/sh
echo "Creating 'website' directory to hold front end sibling directories"
mkdir -p website
cd website

# Clone vagov-content
echo "Cloning vagov-content"
git clone --depth 1 https://github.com/department-of-veterans-affairs/vagov-content

# Clone vets-gov-json schema
echo "Cloning vets-json-schema"
git clone --depth 1 https://github.com/department-of-veterans-affairs/vets-json-schema.git

# Clone veteran-facing-services-tools
echo "Cloning veteran-facing-services-tools"
git clone --depth 1 https://github.com/department-of-veterans-affairs/veteran-facing-services-tools

# Clone content-build
echo "Cloning content-build"
git clone --depth 1 https://github.com/department-of-veterans-affairs/content-build.git

# Clone vets-website
if [ -z ${SOURCE_REF} ] ;
then
    echo "SOURCE_REF is NULL; cloning vets-website main" ;
    git clone --depth 1 https://github.com/department-of-veterans-affairs/vets-website.git ;
else
    echo "SOURCE_REF is: " $SOURCE_REF " using workflow env var" ;
    git clone -b ${SOURCE_REF} --single-branch https://github.com/department-of-veterans-affairs/vets-website.git
fi

echo "set yarn to allow self-signed cert for install"
yarn config set "strict-ssl" false

# Build and watch vets-website
echo "Install, build, and watch vets-website"
cd vets-website
yarn install
yarn watch --env api="http://vets-api-web" &

# Serve the content-build
echo "Install and serve content-build"
cd ../content-build
yarn install
cp .env.example .env
yarn fetch-drupal-cache
yarn build --use-cached-assets
yarn serve