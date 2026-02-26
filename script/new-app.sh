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

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Use npx to run yo@6 with the generator package
# This isolates yo's ESM dependencies from the main node_modules
if [ $# -eq 0 ]; then
  npx --yes yo@6 @department-of-veterans-affairs/vets-website && npm run lint:js:untracked:fix > /dev/null 2>&1
else
  npx --yes yo@6 @department-of-veterans-affairs/vets-website "$@" && npm run lint:js:untracked:fix > /dev/null 2>&1
fi
