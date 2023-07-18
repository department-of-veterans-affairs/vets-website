#!/bin/sh
# Use the mounted EFS volume to retrieve instance repos, install, and build
echo "Navigate into /app/website/slow"
cd website/slow
echo "Generating timestamp"
TIMESTAMP=$(date +%s)
echo "Timestamp value: " $TIMESTAMP
echo "Moving: " $SOURCE_REF " to " $SOURCE_REF"-"$TIMESTAMP
mv -vf $SOURCE_REF $SOURCE_REF"-"$TIMESTAMP
echo "Removing previous build in background"
rm -rf $SOURCE_REF"-"$TIMESTAMP &
echo "Creating directory: " $SOURCE_REF
mkdir $SOURCE_REF
echo "Navigate into: " $SOURCE_REF
cd $SOURCE_REF
Commenting out directory creation for 
mkdir -p website
cd website
git config --global --add safe.directory "*"

# Clone vagov-content
echo "Starting vagov-content"
git clone --depth 1 https://github.com/department-of-veterans-affairs/vagov-content

# Clone vets-gov-json schema
echo "Starting vets-json-schema"
git clone --depth 1 https://github.com/department-of-veterans-affairs/vets-json-schema.git

# Clone veteran-facing-services-tools
echo "Starting veteran-facing-services-tools"
git clone --depth 1 https://github.com/department-of-veterans-affairs/veteran-facing-services-tools

# # Clone content-build
# echo "Starting content-build"
# git clone --depth 1 https://github.com/department-of-veterans-affairs/content-build.git

# Clone vets-website
if [ -z ${SOURCE_REF} ] ;
then
    echo "SOURCE_REF is NULL; starting vets-website main" ;
    git clone --depth 1 https://github.com/department-of-veterans-affairs/vets-website.git ;
else
    echo "SOURCE_REF is: " $SOURCE_REF " using workflow env var and starting vets-website" ;
    git clone -b ${SOURCE_REF} --single-branch https://github.com/department-of-veterans-affairs/vets-website.git ;
fi

# Build and watch vets-website
echo "Install, build, and watch vets-website"
cd vets-website
echo "Installing"
yarn install #--production=false 
echo "Waiting for yarn install to finish before proceeding"
wait
echo "Building"
yarn build --env api="http://vets-website-rework-pe-fronten-dev-platform-api.vfs.va.gov"
# wait
# yarn watch --env api="http://vets-website-rework-pe-fronten-dev-platform-api.vfs.va.gov" &

# # Serve the content-build
# echo "Install and serve content-build"
# cd ../content-build
# yarn install
# wait
# echo "Copy environment file template into place"
# cp .env.example .env
# echo "Fetch drupal cache as a discrete task so as to avoid SOCKS issues"
# yarn fetch-drupal-cache
# wait
# echo "Build using previously cached assets"
# yarn build --use-cached-assets --api="http://vets-website-rework-pe-fronten-dev-platform-api.vfs.va.gov"
# wait"
# echo "Serve up content-build"
# yarn serve 
