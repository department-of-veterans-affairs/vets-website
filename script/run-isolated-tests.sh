#!/bin/bash

# Get the list of subdirectories that contain apps and
# extract substrings from the paths for the following regex.
APP_SUBPATHS="$(find src -name manifest.json | sed -E 's/\/manifest.json//g' | xargs | sed 's/ /|/g')"

# Match changed files to the app paths determined above
FILES_CHANGED="$(git diff --name-only HEAD $(git merge-base HEAD origin/master))"
APP_SUBPATHS_CHANGED="$(echo $FILES_CHANGED | grep -oE "($APP_SUBPATHS)" | uniq)"
NUM_APPS_CHANGED=$(echo "$APP_SUBPATHS_CHANGED" | wc -l)

echo 'Modified files:'
echo "$FILES_CHANGED"
echo
echo 'Modified app dirs:'
echo "$APP_SUBPATHS_CHANGED"
echo

# Run tests only within the apps that have changed.
# If master is ahead of this branch, tests will still run
# for apps that have diffs with this branch.

# Handle when no app has been modified.
if [ -z "${APP_SUBPATHS_CHANGED// }" ]; then
  echo "No changes detected in apps."
  yarn test:coverage "src/platform/**/*.unit.spec.js?(x)"
  exit 0
fi

# Handle when only one app has been modified.
if [ $NUM_APPS_CHANGED -eq 1 ]; then
  yarn test:coverage "{src/platform,$APP_SUBPATHS_CHANGED}/**/*.unit.spec.js?(x)"
  exit $?
fi

echo $APP_SUBPATHS_CHANGED | sed 's/ /,/g' | xargs -I '$' yarn test:coverage '{src/platform,$}/**/*.unit.spec.js?(x)'
