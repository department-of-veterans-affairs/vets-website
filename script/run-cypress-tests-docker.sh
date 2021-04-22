#!/bin/bash

if [ "$(find src -name '*.cypress.spec.js' | wc -l)" -eq 0 ]; then
  echo "No Cypress tests found."
  exit 0
else
  export CYPRESS_BASE_URL=http://vets-website:3001
  export CYPRESS_CI=$CI
  export CYPRESS_FORMS=$FORMS
  if [ "$FORMS" = "true" ]; then
    yarn cy:run --config testFiles='**/tests/**/*.cypress.form.spec.js?(x)',video=false
  else
   yarn cy:run --config video=false
  fi
fi
