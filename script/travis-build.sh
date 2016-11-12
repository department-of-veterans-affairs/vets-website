#!/bin/bash
#
# This script is triggered by `./travis.yml` for TravisCI builds. It executes the
# proper test and build depending on the given $TRAVIS_BRANCH.
#
# Since there are minor differences between the production and development build
# types, both types are built and tested with unit and e2e tests. The accessibility
# test suite will run over PRs to the `production` branch.

set -e

# Don't build or run tests for pushes to staging, production, or master. Tests
# were already run with the PR build that was merged and caused this to run.

echo "Travis branch: $TRAVIS_BRANCH";
echo "Travis pull request: $TRAVIS_PULL_REQUEST";

if [[ ( $TRAVIS_BRANCH == "staging" ||
        $TRAVIS_BRANCH == "production" ||
        $TRAVIS_BRANCH == "master" ) &&
      $TRAVIS_PULL_REQUEST == "false" ]]
then
  exit 0;
fi

# Automatically fail if using a content/wip/* branch. This is a temporary solution
# to slow build times while we address required structural and infrastructure
# issues, allowing the content team to use Heroku builds to preview content
# without running CI during their work.
#
# The build will still occur to provide insight into build failures that will
# prevent a successful Heroku review build.
#
# These branches must then be pulled into a new branch for inclusion into master
# as they will be marked as failed and unmergable.

if [[ $TRAVIS_BRANCH =~ ^content/wip/.* ]]
then
  if [[ $BUILDTYPE == "development" ]]
  then
    npm run build -- --buildtype development
  fi

  exit 1; # These builds always fail with Travis to prevent merges
fi

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
npm run selenium:bootstrap;

# Run end to end tests
npm run test:e2e;

# Run accessibility tests for staging and production

if [[ $TRAVIS_BRANCH == 'production' ]]
then
  npm run test:accessibility;
fi
