#!/bin/sh

echo "$AWS_URL"
# echo "Download dev content-build to website dir"
# cd ..
# curl -LO https://vetsgov-website-builds-s3-upload.s3-us-gov-west-1.amazonaws.com/content-build/0008051ce15e731cc01289933dfb060d6f0d4df6/vagovdev.tar.bz2

# echo "Setup content-build and extract pre-built content into content-build/build/localhost"
# echo "make the build folder"
# mkdir -p content-build/build/localhost
# echo "untar the build into content-build/build/localhost/"
# tar -xf vagovdev.tar.bz2 -C content-build/build/localhost/

# echo "set yarn to allow self-signed cert for install"
# yarn config set "strict-ssl" false

# # Build and watch vets-website
# echo "Install, build, and watch vets-website"
# cd vets-website
# yarn install
# yarn build:webpack:local
# yarn watch &

# # Serve the content-build
# echo "Install and serve content-build"
# cd ../content-build
# yarn install
# ln -s /website/vets-website/build/localhost/generated /website/content-build/build/localhost/generated
# yarn serve
