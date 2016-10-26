#!/bin/bash
#
# This script is triggered by `./travis.yml` for TravisCI builds. It executes the
# proper test and build depending on the given $TRAVIS_BRANCH.
#
# Since there are minor differences between the production and development build
# types, both types are built and tested with unit and e2e tests. The accessibility
# test suite will run over master, staging and production branches, but will only
# prevent merges to staging and production.

set -e

# Set source timestamps equal to their git modified dates
# This is necessary for hard-source-plugin to work.
bash script/set-timestamps.sh

# Run package security checks
npm install -g nsp
nsp check

# Run lint and perform a build
npm run lint;
npm run build -- --buildtype $BUILDTYPE;

# Add build details to BUILD.txt
BUILD_DETAILS_FILE=build/$BUILDTYPE/BUILD.txt
echo "BUILDTYPE=$BUILDTYPE" > $BUILD_DETAILS_FILE
echo "NODE_ENV=$NODE_ENV" >> $BUILD_DETAILS_FILE
echo "TRAVIS_BUILD_NUMBER=$TRAVIS_BUILD_NUMBER" >> $BUILD_DETAILS_FILE
echo "TRAVIS_JOB_NUMBER=$TRAVIS_JOB_NUMBER" >> $BUILD_DETAILS_FILE
echo "TRAVIS_COMMIT=$TRAVIS_COMMIT" >> $BUILD_DETAILS_FILE
echo "TRAVIS_COMMIT_RANGE=$TRAVIS_COMMIT_RANGE" >> $BUILD_DETAILS_FILE
echo "TRAVIS_BRANCH=$TRAVIS_BRANCH" >> $BUILD_DETAILS_FILE

# Run unit tests
npm run test:unit;

# Bootstrap selenium for all nightwatch-based tests
# npm run selenium:bootstrap;

# Run end to end tests
# npm run test:e2e;

# Run accessibility tests for master, staging, and production
if [[ $TRAVIS_BRANCH == 'staging' ||
      $TRAVIS_BRANCH == 'production' ]]
then
  npm run test:accessibility;
fi
