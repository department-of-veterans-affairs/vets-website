#!/bin/bash

# This script reads the build log output by Jenkins in the build step,
# checks for broken links, and if there are any, outputs a CSV file to
# be uploaded to Slack.
#
# Note: This must be called with the build log as the first argument
# and the csv file as the second.  It's brittle, but since it's only
# called from one place, that works for now.

LOG_FILE=$1
OUTPUT_FILE=$2

CSV=$(sed -n '/Page,Broken link/,/^$/p' "$LOG_FILE")

if [ ! -f "$LOG_FILE" ]; then
  echo "$LOG_FILE not found from $(pwd)"
else
  printf 'Head:\n'
  head "$LOG_FILE" -n 20
  printf '\nTail:\n'
  tail "$LOG_FILE" -n 30
  printf '\nCSV found:\n%s' "$CSV"
fi

if [ -n "$CSV" ]; then
  # The output wasn't empty; there are broken links
  echo "Printing the CSV to $OUTPUT_FILE"
  printf "%s" "$CSV" > "$OUTPUT_FILE"
else
  echo "No CSV found in $LOG_FILE"
fi

ls -la /application

exit 0
