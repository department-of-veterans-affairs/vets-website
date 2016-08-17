#!/bin/bash

set -e

if [ -z "$1" ]; then
  echo "Port number required as first argument"
  exit 1
fi

npm run build -- --buildtype development
npm run heroku-serve -- build/development -p $1
