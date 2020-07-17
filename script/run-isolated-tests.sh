#!/bin/bash
set -e

# Get the list of subdirectories that contain apps and
# extract substrings from the paths for the following regex.
APP_SUBPATHS="$(find src -name manifest.json | sed -E 's/\/manifest.json//g' | xargs | sed 's/ /|/g')"

# Match changed files to the app paths determined above
FILES_CHANGED="$(git diff origin/master...HEAD --name-only)"
APP_SUBPATHS_CHANGED="$(echo $FILES_CHANGED | grep -oE "($APP_SUBPATHS)" | uniq)"
NUM_APPS_CHANGED=$(echo "$APP_SUBPATHS_CHANGED" | wc -l)

if [ -z "$FILES_CHANGED" ]; then
  echo 'No files changed. Skipping tests.'
  exit $?
fi

echo 'Files changed:'
echo "$FILES_CHANGED"
echo

# When no app has been modified, only run platform tests.
if [ -z "$APP_SUBPATHS_CHANGED" ]; then
  echo 'No changes detected in apps.'
  yarn test:coverage 'src/platform/**/*.unit.spec.js?(x)'
  exit $?
fi

echo 'Apps changed:'
echo "$APP_SUBPATHS_CHANGED"
echo

# When only one app has been modified, run its tests and platform's tests.
if [ $NUM_APPS_CHANGED -eq 1 ]; then
  yarn test:coverage "{src/platform,$APP_SUBPATHS_CHANGED}/**/*.unit.spec.js?(x)"
  node ./script/app-coverage-report.js
  exit $?
fi

# Run tests for platform and all apps that have changes.
echo $APP_SUBPATHS_CHANGED | sed 's/ /,/g' | xargs -I '$' yarn test:coverage '{src/platform,$}/**/*.unit.spec.js?(x)'
node ./script/app-coverage-report.js
