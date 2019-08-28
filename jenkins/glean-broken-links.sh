#!/bin/bash

# This script reads the build log output by Jenkins in the build
# step, checks for broken links, and if there are any, outputs a CSV
# file to be uploaded to Slack.
#
# Note: This must be called with the csv file as the first argument.
# It's brittle, but since it's only called from one place, that works for now.

OUTPUT_FILE=$1

# cd /application || exit 1

CSV=$(sed -n '/Page,Broken link/,/^$/p' build.log)

if [ -n "$CSV" ]; then
    # The output wasn't empty; there are broken links
    echo "$CSV" > "$OUTPUT_FILE"
fi
