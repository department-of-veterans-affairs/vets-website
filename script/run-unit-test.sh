#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MOCHA=$SCRIPT_DIR/../node_modules/.bin/mocha

if [ ! -f $MOCHA ]; then
  echo "Mocha not found. Try \`yarn install\`"
  exit 1
fi

# No test specified; run all of them
if [ -z "$1" ]; then
  BABEL_ENV=test $MOCHA --recursive '$SCRIPT_DIR/../test/**/*.unit.spec.js?(x)' 
  exit 0
fi

BABEL_ENV=test $MOCHA $1

