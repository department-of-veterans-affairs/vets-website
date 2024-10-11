#!/bin/bash

integrationHelper() {
  local product="$1"
  local app_path="src/applications/${product}"

  if [[ ! -d "$app_path" ]]; then
    echo "Error: Directory '${app_path}' does not exist."
    exit 1
  fi

  local slack_group
  slack_group=$(grep -A 3 "\"rootFolder\": \"$product\"" ./config/changed-apps-build.json | awk -F'"' '/slackGroup/ {print $4}')
  
  if [[ -z "$slack_group" ]]; then
    echo "Error: no slackGroup found for product '$product'"
    exit 1
  fi

  echo "VETS_WEBSITE_CHANNEL_ID=$slack_group" >> $GITHUB_ENV
  echo "INTEGRATION_APP_PATTERN=$app_path" >> $GITHUB_ENV
}

integrationHelper "$1"
