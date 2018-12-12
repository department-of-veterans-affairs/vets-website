#!/bin/bash

# Find the versions
NEW_VERSION=$(git ls-remote --tags git://github.com/department-of-veterans-affairs/vets-json-schema/ | awk -F / '{ print $3 }' | sort -V -r | head -n 1)
OLD_VERSION=$(grep -o -e 'department-of-veterans-affairs\/vets-json-schema#\(.*\)",\?$' package.json | awk -F '[#"]' '{ print $2 }')

# Set up color output
GREEN='\033[0;32m'
BROWN='\033[0;33m'
RESET='\033[0m'
NEW_VER_OUT="${GREEN}$NEW_VERSION${RESET}"
OLD_VER_OUT="${BROWN}$OLD_VERSION${RESET}"

# Escape hatch
if [ "$NEW_VERSION" == "$OLD_VERSION" ]; then
    echo -e "Newest version found on GitHub matches the version currently in package.json ($NEW_VER_OUT)"
    exit 0
fi

echo -e "Updating vets-json-schema from $OLD_VER_OUT to $NEW_VER_OUT"

REPLACE_COMMAND='s/\(department-of-veterans-affairs\/vets-json-schema#\)\(.*\)\(",$\)/\1'$NEW_VERSION'\3/'

# `sed -i ''` works for BSD sed, but not GNU; fall back to GNU
sed -i '' -e "$REPLACE_COMMAND" package.json 2>/dev/null || sed -i -e "$REPLACE_COMMAND" package.json
yarn install
