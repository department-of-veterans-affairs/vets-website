#!/bin/bash

# This script runs yeoman generator to create a new form
#
# Usage interactive:
#   yarn new:app
#
# or ...
# Usage CLI:
# yarn new:app \
#   --force \
#   --appName="[APP_NAME]" \
#   --folderName="[FOLDER_NAME]" \
#   --entryName="[ENTRY_NAME]" \
#   --rootUrl="/[ROOT_URL]" \
#   --isForm=true \
#   --slackGroup="[SLACK_GROUP]" \
#   --contentLoc="../vagov-content" \
#   --formNumber="[FORM_NUMBER]" \
#   --trackingPrefix="[TRACKING_PREFIX]" \
#   --respondentBurden="[MINUTES]" \
#   --ombNumber="[OMB_NUMBER]" \
#   --expirationDate="[MM/DD/YYYY]" \
#   --benefitDescription="[DESCRIPTION]" \
#   --usesVetsJsonSchema=[true/false] \
#   --usesMinimalHeader=[true/false] \
#   --addToMyVaSip=[true/false] \
#   --templateType="WITH_1_PAGE"

# Install yo@6 and the generator into a temporary directory to isolate
# them from the main node_modules. npx -p does not reliably expose binaries
# in npm 10 (Node 22), so we install explicitly and invoke the binary directly.
TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

npm install --prefix "$TMPDIR" --loglevel=error yo@6 @department-of-veterans-affairs/generator-vets-website@4 > /dev/null 2>&1

"$TMPDIR/node_modules/.bin/yo" @department-of-veterans-affairs/vets-website "$@" && npm run lint:js:untracked:fix > /dev/null 2>&1