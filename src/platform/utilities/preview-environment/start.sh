#!/bin/sh
#echo "Wipe out previous builds"
#cd /app/website/container


echo "Creating 'website' directory to hold front end sibling directories"
mkdir -p website/slow
cd website/slow

# Clone vagov-content
echo "Starting vagov-content"
git clone --depth 1 https://github.com/department-of-veterans-affairs/vagov-content

# Clone vets-gov-json schema
echo "Starting vets-json-schema"
git clone --depth 1 https://github.com/department-of-veterans-affairs/vets-json-schema.git

# Clone veteran-facing-services-tools
echo "Starting veteran-facing-services-tools"
git clone --depth 1 https://github.com/department-of-veterans-affairs/veteran-facing-services-tools

# Clone content-build
echo "Starting content-build"
git clone --depth 1 https://github.com/department-of-veterans-affairs/content-build.git

# Clone vets-website
if [ -z ${SOURCE_REF} ] ;
then
    echo "SOURCE_REF is NULL; starting vets-website main" ;
    git clone --depth 1 https://github.com/department-of-veterans-affairs/vets-website.git ;
else
    echo "SOURCE_REF is: " $SOURCE_REF " using workflow env var and starting vets-website" ;
    git clone -b ${SOURCE_REF} --single-branch https://github.com/department-of-veterans-affairs/vets-website.git ;
fi

echo "Listing contents website staging folder"
ls -l

echo "set yarn to allow self-signed cert for install"
yarn config set "strict-ssl" false

# Build and watch vets-website
echo "Install, build, and watch vets-website"
cd vets-website
echo "Installing"
yarn install
echo "Building"
yarn build:webpack --env buildtype=localhost
echo "Watch"
yarn watch --env api="http://vets-website-rework-pe-fronten-dev-platform-api.vfs.va.gov" &

# Serve the content-build
echo "Install and serve content-build"
cd ../content-build
yarn install
echo "Copy environment file template into place"
cp .env.example .env
echo "Fetch drupal cache as a discrete task so as to avoid SOCKS issues"
yarn fetch-drupal-cache
echo "Build using previously cached assets"
yarn build --use-cached-assets
echo "Serve up content-build"
yarn serve
