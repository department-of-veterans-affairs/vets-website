#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
NYC=$SCRIPT_DIR/../node_modules/.bin/nyc

if [ ! -f $NYC ]; then
  echo "nyc not found. Try \`yarn install\`"
  exit 1
fi

# No test specified; run coverage on all of them
if [[ -z "$1" ]] || [[ $1 == -* ]]; then
  NODE_ENV=test $NYC --all --reporter=lcov --reporter=text --reporter=html mocha --reporter dot --reporter mocha-junit-reporter --no-color --opts src/platform/testing/unit/mocha.opts --recursive '{src,test}/**/*.unit.spec.js?(x)' src/platform/testing/unit/helper.js "$@"
  exit $?
fi

NODE_ENV=test $NYC --reporter=lcov --reporter=text --reporter=html mocha --reporter dot --reporter mocha-junit-reporter --no-color --opts src/platform/testing/unit/mocha.opts "$@"
