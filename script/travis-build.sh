#!/bin/bash
#
# This script is triggered by `./travis.yml` for TravisCI builds. It executes the
# proper test and build depending on the given $TRAVIS_BRANCH.
#
# Since there are minor differences between the production and development build
# types, both types are built and tested with unit and e2e tests. The accessibility
# test suite will run over master, staging and production branches, but will only
# prevent merges to staging and production.
#
# Additionally, if you'd like to run accessibility tests on a branch that's not
# staging, use a branch name that begins with 'accessibility/', such as:
#
#   `accessibility/fix-contrast`

set -e

# Run package security checks
npm install -g nsp
nsp check

# Run lint and perform a build
npm run lint;
npm run build -- --buildtype $BUILDTYPE;

# Run unit tests
npm run test:unit;

# Bootstrap selenium for all nightwatch-based tests
npm run selenium:bootstrap;

# Run end to end tests
npm run test:e2e;

# Run accessibility tests for master, staging, and production
ACCESSIBILITY_BRANCH_PATTERN="^(master|staging|production|accessibility\\/.*)$"

if [[ $TRAVIS_BRANCH =~ $ACCESSIBILITY_BRANCH_PATTERN ]]
then
  npm run attest:bootstrap

  if [[ $TRAVIS_BRANCH == 'master' ]]
  then
    # Don't fail if we encounter problems, just report
    set +e; npm run test:accessibility; set -e;
    exit 0;
  else
    npm run test:accessibility;
  fi
fi
