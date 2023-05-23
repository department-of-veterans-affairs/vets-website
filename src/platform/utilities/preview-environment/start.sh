#!/bin/sh
echo "Creating directory structure"
mkdir -p website
cd website

# Clone vagov-content
git clone --depth 1 https://github.com/department-of-veterans-affairs/vagov-content

# Clone vets-gov-json schema
git clone --depth 1 https://github.com/department-of-veterans-affairs/vets-json-schema.git

# Clone veteran-facing-services-tools
git clone --depth 1 https://github.com/department-of-veterans-affairs/veteran-facing-services-tools

# Clone content-build
git clone --depth 1 https://github.com/department-of-veterans-affairs/content-build.git

# Clone vets-website
if [ -z ${SOURCE_REF} ] ;
then
    echo "SOURCE_REF is NULL; using main" ;
    git clone --depth 1 https://github.com/department-of-veterans-affairs/vets-website.git ;
else
    echo "SOURCE_REF is not NULL; using workflow env var" ;
    git clone -b ${SOURCE_REF} --single-branch https://github.com/department-of-veterans-affairs/vets-website.git
fi

echo "Download dev content-build to website dir"

# if AWS_URL then use it
# else use default cache URL
# To-do -- change the fallback cache to something that is not hardcoded to a file that will eventually be cleaned up
if [ -z ${AWS_URL} ] ;
then
    echo "AWS_URL is NULL; using default" ;
    curl -LO https://vetsgov-website-builds-s3-upload.s3-us-gov-west-1.amazonaws.com/content-build/0008051ce15e731cc01289933dfb060d6f0d4df6/vagovprod.tar.bz2 ;
else
    echo "AWS_URL is not NULL; using workflow env var" ;
    curl -LO ${AWS_URL} ;
fi

echo "Setup content-build and extract pre-built content into content-build/build/localhost"
echo "make the build folder"
mkdir -p content-build/build/localhost
echo "untar the build into content-build/build/localhost/"
tar -xf vagovprod.tar.bz2 -C content-build/build/localhost/

echo "set yarn to allow self-signed cert for install"
yarn config set "strict-ssl" false

# Build and watch vets-website
echo "Install, build, and watch vets-website"
cd vets-website
yarn install
yarn build:webpack:local
yarn watch --env api="http://vets-api-web:3004" &

# Serve the content-build
echo "Install and serve content-build"
cd ../content-build
yarn install
ln -s /app/website/vets-website/build/localhost/generated /app/website/content-build/build/localhost/generated
yarn serve
