#!/bin/bash

NEW_HASH=$(git ls-remote git://github.com/department-of-veterans-affairs/vets-json-schema/ refs/heads/master | awk '{print $1}')
sed -i '' -e 's/\(vets-json-schema\.git#\)\(.*\)\(",$\)/\1'$NEW_HASH'\3/' package.json
yarn install
