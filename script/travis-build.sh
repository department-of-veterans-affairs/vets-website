#!/bin/bash
#
# This script is triggered by `./travis.yml` for TravisCI builds. It executes the
# proper test and build depending on the given $TRAVIS_BRANCH and $TEST_SUITE.
#
# Since there are minor differences between the production and development build
# types, both types are built and tested with unit and e2e tests. The accessibility
# test suite will run over master, staging and production branches, but will only
# prevent merges to staging and production.

set -e

# If we're running the security suite, do it and exit

if [[ $TEST_SUITE == 'security' ]]
then
  npm install -g nsp
  nsp check
  exit $?
fi

# If asked to run accessibility tests, but not for the master,
# staging, or production branches, exit.

# TODO(james): If build concurrency issues are addressed
# reliably with Travis, enable for all branches
if [[ $TEST_SUITE == 'accessibility' &&
      $TRAVIS_BRANCH != 'master' &&
      $TRAVIS_BRANCH != 'staging' &&
      $TRAVIS_BRANCH != 'production' ]]
then
  exit 0;
fi

# Run lint and perform a build

npm run lint;
npm run build -- --buildtype $BUILDTYPE;

# And run the selected test suite

if [[ $TEST_SUITE == 'unit' ]]
then
  npm run test:unit;
fi

if [[ $TEST_SUITE == 'e2e' ]]
then
  npm run selenium:bootstrap;
  npm run test:e2e;
fi

# Run accessibility suite for master, staging, and production, but do not
# fail on master branch accessibility failures.

if [[ $TEST_SUITE == 'accessibility' ]]
then
  npm run selenium:bootstrap;

  if [[ $TRAVIS_BRANCH == 'master' ]]
  then
    set +e; npm run test:accessibility; set -e;
    exit 0;
  else
    npm run test:accessibility;
  fi
fi
