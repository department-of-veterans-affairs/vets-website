#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
JEST=$SCRIPT_DIR/../node_modules/.bin/jest

if [ ! -f $JEST ]; then
  echo "Jest not found. Try \`yarn install\`"
  exit 1
fi

BABEL_ENV=test $JEST "$@"
exit $?
