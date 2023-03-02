#!/bin/sh

# Clone content-build
git clone https://github.com/department-of-veterans-affairs/content-build

# Install dependencies
cd content-build
yarn install

# Fetch Drupal cache
yarn fetch-drupal-cache

# Build content
yarn build

# Navigate to vets-website
cd ../vets-website

# Build vets-website
yarn build

# Start watch mode
yarn watch &

# Start http-server
npx http-server . -p 3002 --host=0.0.0.0
