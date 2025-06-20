#!/bin/bash

# Try to use nvm to use a specific node version for a given script.
# Fail silently if nvm is not installed.
#
# Usage:
# NODE_VERSION=18 ./script/with-node.sh node ./script/my-node-script.js

export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck disable=SC1090
  . "$NVM_DIR/nvm.sh"

  if [ -n "$NODE_VERSION" ]; then
    nvm use "$NODE_VERSION" > /dev/null 2>&1 || true
  fi
fi

exec "$@"