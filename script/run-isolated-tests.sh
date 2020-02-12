#!/bin/bash

# Get the list of subdirectories that contain apps and
# extract substrings from the paths for the following regex.
APP_SUBPATHS="$(find src -name manifest.json | sed -E 's/(src\/applications\/|\/manifest.json)//g' | xargs | sed 's/ /|/g')"

# Match changed files to the app paths determined above
FILES_CHANGED="$(git diff --name-only master)"
APP_SUBPATHS_CHANGED="$(echo $FILES_CHANGED | grep -oE "($APP_SUBPATHS)")"
NUM_APPS_CHANGED=$(echo "$APP_SUBPATHS_CHANGED" | wc -l)

# Run tests only within the apps that have changed.

# Handle when only one app has been modified.
if [ $NUM_APPS_CHANGED -eq 1 ]; then
  yarn test:coverage "src/applications/$APP_SUBPATHS_CHANGED/**/*.unit.spec.js?(x)"
  exit $?
fi

echo $APP_SUBPATHS_CHANGED | sed 's/ /,/g' | xargs -I '$' yarn test:coverage 'src/applications/{$}/**/*.unit.spec.js?(x)'
