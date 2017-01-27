#!/bin/bash
#
# This script is triggered by `./travis.yml` for TravisCI builds. It executes the
# proper test and build depending on the given $TRAVIS_BRANCH.

set -e

# Don't build or run tests for a push to a branch that's not production or
# master. If this is a PR for a branch, we fall through to the tests

if [[ ( $TRAVIS_BRANCH != "production" &&
        $TRAVIS_BRANCH != "master" ) &&
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
  time npm run build -- --buildtype development;
  exit 1; # These builds always fail with Travis to prevent merges
fi

# Run package security checks
time npm install -g nsp
time nsp check

build() {
  time npm run build -- --buildtype $1;

  # Add build details to BUILD.txt
  BUILD_DETAILS_FILE=build/$1/BUILD.txt
  echo "BUILDTYPE=$1" > $BUILD_DETAILS_FILE
  echo "NODE_ENV=$NODE_ENV" >> $BUILD_DETAILS_FILE
  echo "TRAVIS_BUILD_NUMBER=$TRAVIS_BUILD_NUMBER" >> $BUILD_DETAILS_FILE
  echo "TRAVIS_JOB_NUMBER=$TRAVIS_JOB_NUMBER" >> $BUILD_DETAILS_FILE
  echo "TRAVIS_COMMIT=$TRAVIS_COMMIT" >> $BUILD_DETAILS_FILE
  echo "TRAVIS_COMMIT_RANGE=$TRAVIS_COMMIT_RANGE" >> $BUILD_DETAILS_FILE
  echo "TRAVIS_BRANCH=$TRAVIS_BRANCH" >> $BUILD_DETAILS_FILE
}

if [[ $TRAVIS_BRANCH == "production" &&
      $TRAVIS_PULL_REQUEST == "false" ]]
then
  # Will deploy production, tests have already been run from source PR
  build production;
  exit 0;
fi

if [[ $TRAVIS_BRANCH == "master" &&
      $TRAVIS_PULL_REQUEST == "false" ]]
then
  # We will deploy development build to development, and staging build
  # to staging.
  build development &
  build staging &
  wait;
fi

# Run lint
time npm run lint;

# Run the unit tests and generate coverage report
time npm run test:coverage;

# Build and run tests against production
build production;

export BUILDTYPE=production;

# Bootstrap selenium for all nightwatch-based tests
time npm run selenium:bootstrap;

# Run end to end tests
time npm run test:e2e;

# Run accessibility tests
time npm run test:accessibility;
